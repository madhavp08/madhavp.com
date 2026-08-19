export const MEDIA_KINDS = ["books", "movies", "music"] as const;

export type MediaKind = (typeof MEDIA_KINDS)[number];

export const MEDIA_LABELS: Record<MediaKind, string> = {
  books: "Books",
  movies: "Movies",
  music: "Music",
};

export interface Piece {
  title: string;
  creator: string;
  coverImage: string;
  spineColor: string;
  textColor: string;
  slug: string;
  kind: MediaKind;
  notes: string;
}

export function isMediaKind(value: string): value is MediaKind {
  return MEDIA_KINDS.includes(value as MediaKind);
}
