export interface LyricLine {
  t: number;
  text: string;
}

interface LrclibHit {
  name?: string;
  artistName?: string;
  duration?: number;
  syncedLyrics?: string | null;
  plainLyrics?: string | null;
}

const cache = new Map<string, LyricLine[] | undefined>();

function parseLrc(lrc: string) {
  const lines: LyricLine[] = [];
  const pattern = /\[(\d+):(\d+(?:\.\d+)?)\](.*)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(lrc))) {
    const text = match[3].trim();
    if (!text) {
      continue;
    }
    lines.push({
      t: Number(match[1]) * 60 + Number(match[2]),
      text,
    });
  }
  return lines;
}

function fromPlain(plain: string) {
  return plain
    .split("\n")
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ t: 0, text }));
}

function fold(value: string) {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function score(hit: LrclibHit, title: string, artist: string) {
  let value = 0;
  const name = fold(hit.name || "");
  const who = fold(hit.artistName || "");
  const wantTitle = fold(title);
  const wantArtist = fold(artist.split(",")[0] || artist);
  if (hit.syncedLyrics) {
    value += 8;
  } else if (hit.plainLyrics) {
    value += 2;
  }
  if (hit.duration && hit.duration < 20) {
    value -= 12;
  }
  if (name === wantTitle) {
    value += 6;
  } else if (name.includes(wantTitle) || wantTitle.includes(name)) {
    value += 3;
  }
  if (who.includes(wantArtist) || wantArtist.includes(who.split(" ")[0] || "")) {
    value += 3;
  }
  if (wantTitle.includes("reprise") && name.includes("reprise")) {
    value += 4;
  }
  return value;
}

async function request(params: Record<string, string>) {
  const url = `https://lrclib.net/api/search?${new URLSearchParams(params)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "madhavp.com (personal site)" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    return [];
  }
  const text = await res.text();
  if (!text) {
    return [];
  }
  try {
    return JSON.parse(text) as LrclibHit[];
  } catch {
    return [];
  }
}

function linesFrom(hit: LrclibHit) {
  if (hit.syncedLyrics) {
    return parseLrc(hit.syncedLyrics);
  }
  if (hit.plainLyrics) {
    return fromPlain(hit.plainLyrics);
  }
  return [];
}

export function fromCatalog(lines: string[]): LyricLine[] {
  return lines.map((text) => ({ t: 0, text: text.trim() })).filter((line) => line.text);
}

export async function songLyrics(title: string, artist: string) {
  const key = `${title}|${artist}`;
  if (cache.has(key)) {
    return cache.get(key);
  }

  const artists = [artist, artist.split(",")[0]?.trim() || ""].filter(
    (name, index, all) => name && all.indexOf(name) === index
  );

  try {
    const hits: LrclibHit[] = [];
    for (const name of artists) {
      hits.push(...(await request({ track_name: title, artist_name: name })));
    }
    hits.push(...(await request({ q: `${title} ${artists[0]}` })));

    const ranked = [...hits].sort(
      (a, b) => score(b, title, artist) - score(a, title, artist)
    );
    for (const hit of ranked) {
      const lines = linesFrom(hit);
      if (lines.length) {
        cache.set(key, lines);
        return lines;
      }
    }
  } catch {
    cache.set(key, undefined);
    return undefined;
  }

  cache.set(key, undefined);
  return undefined;
}
