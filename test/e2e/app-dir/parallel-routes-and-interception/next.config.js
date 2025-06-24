/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    ppr: process.env.__NEXT_EXPERIMENTAL_PPR === 'true',
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/foo',
          destination: '/en/foo',
        },
        {
          source: '/photos',
          destination: '/en/photos',
        },
      ],
    }
  },
}

module.exports = nextConfig
