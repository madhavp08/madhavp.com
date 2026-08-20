module.exports = {
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
};
