export function coverSrc(cover: string) {
  if (cover.startsWith("isbn:")) {
    return `https://covers.openlibrary.org/b/isbn/${cover.slice(5)}-L.jpg`;
  }
  if (cover.startsWith("olid:")) {
    return `https://covers.openlibrary.org/b/olid/${cover.slice(5)}-L.jpg`;
  }
  return cover;
}
