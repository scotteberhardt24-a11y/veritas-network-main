/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "veritasbackend.up.railway.app" },
    ],
  },
};
module.exports = nextConfig;
