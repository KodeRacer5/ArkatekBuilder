/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias.canvas = false
      config.resolve.alias.sharp = false
    }
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'sharp']
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['canvas', 'sharp', 'pdfjs-dist'],
  },
}
export default nextConfig
