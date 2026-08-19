const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

module.exports = withMDX({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/art",
        destination: "/media",
        permanent: true,
      },
      {
        source: "/art/:path*",
        destination: "/media/:path*",
        permanent: true,
      },
      {
        source: "/favorites",
        destination: "/media",
        permanent: true,
      },
      {
        source: "/favorites/:path*",
        destination: "/media/:path*",
        permanent: true,
      },
    ];
  },
});
