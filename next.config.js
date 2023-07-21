/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    domains: ["cloudflare-ipfs.com"],
    loader: "akamai",
    path: "/",
  },
};

module.exports = nextConfig;
