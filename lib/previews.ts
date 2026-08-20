interface ItunesSong {
  trackName?: string;
  artistName?: string;
  previewUrl?: string;
  artworkUrl100?: string;
}

interface ItunesResponse {
  results?: ItunesSong[];
}

export async function songPreview(title: string, artist: string) {
  const term = encodeURIComponent(`${title} ${artist}`);
  const res = await fetch(
    `https://itunes.apple.com/search?term=${term}&entity=song&limit=5`
  );
  if (!res.ok) {
    return { audio: undefined, cover: undefined };
  }
  const text = await res.text();
  if (!text) {
    return { audio: undefined, cover: undefined };
  }
  let data: ItunesResponse;
  try {
    data = JSON.parse(text) as ItunesResponse;
  } catch {
    return { audio: undefined, cover: undefined };
  }
  const hit = data.results?.find((item) => item.previewUrl);
  return {
    audio: hit?.previewUrl,
    cover: hit?.artworkUrl100?.replace("100x100bb", "600x600bb"),
  };
}
