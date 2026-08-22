export const MEDIA_HREF = "/media";
export const PROJECTS_HREF = "/projects";
export const WEB3FORMS_ACCESS_KEY = "ff9fe6de-bc08-4ef0-af88-ec548587cde0";
export const RECOMMEND_EMAIL = "madhav.pillai08@gmail.com";

type Social = {
  label: string;
  href?: string;
  copy?: string;
};

export const site = {
  name: "Madhav Pillai",
  description: "about me, media, and projects",
  url: "https://madhavp.com",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Media", href: MEDIA_HREF },
    { label: "Projects", href: PROJECTS_HREF },
  ],
  socials: [
    { label: "Email", copy: RECOMMEND_EMAIL },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/madhavpillai" },
    { label: "X", href: "https://x.com/madhav_p08" },
    { label: "GitHub", href: "https://github.com/madhavp08" },
    { label: "Letterboxd", href: "https://letterboxd.com/madhavp08/" },
    { label: "Chess.com", href: "https://www.chess.com/member/sack_madhav" },
    { label: "Goodreads", href: "https://www.goodreads.com/user/show/189090255-madhav-pillai" },
  ] as Social[],
};
