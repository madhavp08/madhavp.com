export const MEDIA_KINDS = ["movies", "music", "books", "shows"] as const;

export type MediaKind = (typeof MEDIA_KINDS)[number];

export const MEDIA_LABELS: Record<MediaKind, string> = {
  movies: "Movies",
  music: "Music",
  books: "Books",
  shows: "Shows",
};

export const MEDIA_ROWS: MediaKind[][] = [
  ["movies"],
  ["music"],
  ["books", "shows"],
];

export interface Piece {
  title: string;
  creator: string;
  coverImage: string;
  spineColor: string;
  textColor: string;
  slug: string;
  kind: MediaKind;
  notes: string;
  audio?: string;
  audioStart?: number;
  blurb?: string;
  rating?: number;
  review?: string;
  tag?: string;
}

export function letterboxdStars(rating: number) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return `${"★".repeat(full)}${half ? "½" : ""}`;
}

export function isMediaKind(value: string): value is MediaKind {
  return MEDIA_KINDS.includes(value as MediaKind);
}
