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
  const data = (await res.json()) as ItunesResponse;
  const hit = data.results?.find((item) => item.previewUrl);
  return {
    audio: hit?.previewUrl,
    cover: hit?.artworkUrl100?.replace("100x100bb", "600x600bb"),
  };
}
