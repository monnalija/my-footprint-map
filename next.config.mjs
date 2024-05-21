/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 't1.daumcdn.net',
        port: '',
        pathname: '/localimg/localimages/07/mapapidoc/**',
      },
    ],
  },
};

export default nextConfig;
