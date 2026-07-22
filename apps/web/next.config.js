/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  images: {
    domains: ['veritasbackend.up.railway.app'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
