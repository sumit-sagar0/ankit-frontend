/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/api/upload/images/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
