/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    cpus: 1,
    dynamicIO: true,
    enablePrerenderSourceMaps: true,
    serverSourceMaps: true,
    devtoolNewPanelUI: true,
  },
  serverExternalPackages: ['external-pkg'],
}

module.exports = nextConfig
