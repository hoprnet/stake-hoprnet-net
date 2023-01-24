/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  // assetPrefix: './',
  //  trailingSlash: true,
  // exportPathMap: function () {
  //   return {
  //     '/': { page: '/' },
  //   }
  // },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/nft/:path*',
      },
    ]
  },
}

module.exports = nextConfig
