# Adding and removing media

Edit `content/media.json`. Each shelf is an array. Add an object to add an item. Delete the object to remove it. Then the site updates on the next refresh.

This is the catalog. Later, Spotify, Letterboxd, and Goodreads can fill the same file. Until those are wired, add items by hand.

## Projects

Edit `content/projects.json`. Add an object to add a project. Delete it to remove it.

```json
{
  "slug": "my-project",
  "title": "My Project",
  "blurb": "One short sentence.",
  "demo": "https://example.com",
  "github": "https://github.com/madhavp08/my-project"
}
```

Leave `demo` out if there is no live site. `github` is required.

## A book

```json
{
  "slug": "the-alchemist",
  "title": "The Alchemist",
  "creator": "Paulo Coelho",
  "cover": "isbn:9780061122415",
  "spineColor": "#1b2838",
  "textColor": "#fff",
  "notes": "A short note."
}
```

`cover` can be:

- `isbn:9780061122415` — fetches the cover from [Open Library](https://openlibrary.org/)
- `olid:OL7353617M` — Open Library ID, same source
- `/art/books/my-scan.jpg` — a file you put in `public/art/books/`
- `https://example.com/cover.jpg` — any image URL

Find an ISBN on the book's Amazon or Open Library page. Use the 13-digit ISBN with no dashes.

## A movie or album

Same shape. Open Library is for books, so for movies and music use a file or a URL:

```json
{
  "slug": "whiplash",
  "title": "Whiplash",
  "creator": "Damien Chazelle",
  "cover": "/art/movies/whiplash.jpg",
  "spineColor": "#111111",
  "textColor": "#fff",
  "notes": "Short note."
}
```

Drop the image in `public/art/movies/` or `public/art/music/`.

## Spine colors

`spineColor` is the thin side of the 3D item. `textColor` is the title on that spine. Pick a dark hex and `#fff` for most titles.

## Later: Spotify, Letterboxd, Goodreads

None of these are connected yet. Manual JSON always works as a fallback.

**Spotify (music) — possible.** Official API. Needs a Spotify developer app, a one-time login, and secrets in Vercel env vars. Can pull saved albums and cover art. Refresh tokens now expire after six months, so login has to be redone occasionally.

**Letterboxd (movies) — no personal API.** Letterboxd does not grant API keys for personal sites. Two workable paths later: the public diary RSS feed (`https://letterboxd.com/USERNAME/rss/`) or a CSV export from Letterboxd settings. Covers would come from that feed or a poster URL you paste in.

**Goodreads (books) — no official API.** Goodreads shut its API. Two workable paths later: a public shelf RSS feed or a CSV export from Goodreads. ISBN in that data can still use Open Library covers the same way as a hand-added book.

When you are ready to connect one, send the Spotify app credentials, Letterboxd username, and/or Goodreads user id.
