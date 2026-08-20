import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import fs from "fs";
import { MEDIA_KINDS, MediaKind, Piece } from "./media";
import { coverSrc } from "./covers";
import { songPreview } from "./previews";
import { songLyrics, fromCatalog } from "./lyrics";
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
  lyrics?: string[];
  blurb?: string;
  rating?: number;
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
      const source = await serialize(item.notes || "", {
        mdxOptions: { development: false },
      });
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
        notes: source.compiledSource,
      };
      const audio = item.audio || preview?.audio;
      if (audio) {
        piece.audio = audio;
      }
      if (kind === "music") {
        const lyrics = item.lyrics?.length
          ? fromCatalog(item.lyrics)
          : await songLyrics(item.title, item.creator);
        if (lyrics && lyrics.length) {
          piece.lyrics = lyrics;
        }
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
