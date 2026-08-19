import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import fs from "fs";
import { MediaKind, Piece } from "./media";
import { coverSrc } from "./covers";
import { MEDIA_HREF } from "./site";

interface CatalogItem {
  slug: string;
  title: string;
  creator: string;
  cover: string;
  spineColor: string;
  textColor: string;
  notes: string;
}

function readCatalog() {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content", "media.json"), "utf8")
  ) as Record<MediaKind, CatalogItem[]>;
}

export async function getPieces(kind: MediaKind): Promise<Piece[]> {
  const items = readCatalog()[kind] || [];

  return Promise.all(
    items.map(async (item) => {
      const source = await serialize(item.notes || "", {
        mdxOptions: { development: false },
      });

      return {
        title: item.title,
        creator: item.creator,
        coverImage: coverSrc(item.cover),
        spineColor: item.spineColor,
        textColor: item.textColor,
        kind,
        slug: `${MEDIA_HREF}/${kind}/${item.slug}`,
        notes: source.compiledSource,
      };
    })
  );
}
