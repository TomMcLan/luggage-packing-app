/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001',
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
}

module.exports = nextConfig