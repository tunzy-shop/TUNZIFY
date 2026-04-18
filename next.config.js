/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org'],
  },
  // THIS IS CRITICAL - ensures CSS loads properly
  distDir: '.next',
  generateEtags: false,
}

module.exports = nextConfig
