import type { NextApiRequest, NextApiResponse } from "next";

const KINDS = ["movies", "music", "books", "shows"] as const;

type Kind = (typeof KINDS)[number];

function isKind(value: unknown): value is Kind {
  return typeof value === "string" && KINDS.includes(value as Kind);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) {
    return res.status(501).json({ error: "Recommendations are not set up" });
  }

  const body = req.body as {
    kind?: unknown;
    title?: unknown;
    message?: unknown;
    company?: unknown;
  };

  if (typeof body.company === "string" && body.company.trim()) {
    return res.status(200).json({ ok: true });
  }

  if (!isKind(body.kind)) {
    return res.status(400).json({ error: "Pick a media type" });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 200) {
    return res.status(400).json({ error: "Add a title" });
  }

  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";

  const labels: Record<Kind, string> = {
    movies: "Movie",
    music: "Song",
    books: "Book",
    shows: "Show",
  };

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: key,
      subject: `Recommendation: ${labels[body.kind]} — ${title}`,
      from_name: "madhavp.com",
      Media: labels[body.kind],
      Title: title,
      Message: message || "(none)",
    }),
  });

  if (!response.ok) {
    return res.status(502).json({ error: "Could not send" });
  }

  return res.status(200).json({ ok: true });
}
