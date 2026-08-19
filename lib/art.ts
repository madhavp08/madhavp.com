export const ART_KINDS = ["books", "movies", "music"] as const;

export type ArtKind = (typeof ART_KINDS)[number];

export const ART_LABELS: Record<ArtKind, string> = {
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
  kind: ArtKind;
  notes: string;
}

export function isArtKind(value: string): value is ArtKind {
  return ART_KINDS.includes(value as ArtKind);
}
