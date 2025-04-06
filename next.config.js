/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  compiler: {
    emotion: true,
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig 