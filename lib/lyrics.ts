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

const cache = new Map<string, LyricLine[]>();

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
    .map((text, index) => ({ t: index * 4, text }));
}

function pick(hits: LrclibHit[]) {
  return hits.find((hit) => hit.syncedLyrics) || hits.find((hit) => hit.plainLyrics);
}

async function search(title: string, artist: string) {
  const url = `https://lrclib.net/api/search?${new URLSearchParams({
    track_name: title,
    artist_name: artist,
  })}`;
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

export async function songLyrics(title: string, artist: string) {
  const key = `${title}|${artist}`;
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  const artists = [artist, ...artist.split(",").map((part) => part.trim())].filter(
    (name, index, all) => name && all.indexOf(name) === index
  );

  try {
    for (const name of artists) {
      const hit = pick(await search(title, name));
      if (!hit) {
        continue;
      }
      const lines = hit.syncedLyrics
        ? parseLrc(hit.syncedLyrics)
        : hit.plainLyrics
          ? fromPlain(hit.plainLyrics)
          : [];
      if (lines.length) {
        cache.set(key, lines);
        return lines;
      }
    }
  } catch {
    return undefined;
  }

  return undefined;
}
