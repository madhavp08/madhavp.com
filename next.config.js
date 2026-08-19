const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

module.exports = withMDX({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  async redirects() {
    return [
      {
        source: "/art",
        destination: "/favorites",
        permanent: true,
      },
      {
        source: "/art/:path*",
        destination: "/favorites/:path*",
        permanent: true,
      },
    ];
  },
});
