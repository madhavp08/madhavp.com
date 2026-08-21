import path from "path";
import fs from "fs";
import { MEDIA_KINDS, MediaKind, Piece } from "./media";
import { coverSrc } from "./covers";
import { songPreview } from "./previews";
import { MEDIA_HREF } from "./site";

interface CatalogItem {
  slug: string;
  title: string;
  creator: string;
  cover: string;
  spineColor: string;
  textColor: string;
  notes: string;
  audio?: string;
  audioStart?: number;
  blurb?: string;
  rating?: number;
  tag?: string;
}

let catalog: Record<MediaKind, CatalogItem[]> | undefined;

function readCatalog() {
  if (!catalog) {
    catalog = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "content", "media.json"), "utf8")
    ) as Record<MediaKind, CatalogItem[]>;
  }
  return catalog;
}

export async function getPieces(kind: MediaKind): Promise<Piece[]> {
  const items = readCatalog()[kind] || [];

  return Promise.all(
    items.map(async (item) => {
      const preview =
        kind === "music" && !item.audio && item.creator !== "To be replaced"
          ? await songPreview(item.title, item.creator)
          : undefined;

      const piece: Piece = {
        title: item.title,
        creator: item.creator,
        coverImage: coverSrc(item.cover),
        spineColor: item.spineColor,
        textColor: item.textColor,
        kind,
        slug: `${MEDIA_HREF}/${kind}/${item.slug}`,
        notes: item.notes || "",
      };
      const audio = item.audio || preview?.audio;
      if (audio) {
        piece.audio = audio;
      }
      if (item.audioStart != null) {
        piece.audioStart = item.audioStart;
      }
      if (item.blurb) {
        piece.blurb = item.blurb;
      }
      if (item.rating != null) {
        piece.rating = item.rating;
      }
      if (item.notes?.trim()) {
        piece.review = item.notes.trim();
      }
      if (item.tag) {
        piece.tag = item.tag;
      }
      return piece;
    })
  );
}

export async function getShelves(): Promise<Record<MediaKind, Piece[]>> {
  const rows = await Promise.all(MEDIA_KINDS.map((kind) => getPieces(kind)));
  return Object.fromEntries(
    MEDIA_KINDS.map((kind, index) => [kind, rows[index]])
  ) as Record<MediaKind, Piece[]>;
}
