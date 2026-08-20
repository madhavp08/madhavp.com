import fs from "fs";
import path from "path";
import { PROJECTS_HREF } from "./site";

export interface Project {
  slug: string;
  title: string;
  blurb: string;
  website?: string;
  github: string;
  href: string;
}

export function getProjects(): Project[] {
  const items = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content", "projects.json"), "utf8")
  ) as Omit<Project, "href">[];

  return items.map((item) => ({
    ...item,
    href: `${PROJECTS_HREF}/${item.slug}`,
  }));
}
