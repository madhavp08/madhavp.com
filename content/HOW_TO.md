# Adding and removing favorites

Edit `content/favorites.json`. Each shelf is an array. Add an object to add an item. Delete the object to remove it. Then the site updates on the next refresh.

## A book

```json
{
  "slug": "the-alchemist",
  "title": "The Alchemist",
  "creator": "Paulo Coelho",
  "cover": "isbn:9780061122415",
  "spineColor": "#1b2838",
  "textColor": "#fff",
  "notes": "Why this book matters to me."
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
