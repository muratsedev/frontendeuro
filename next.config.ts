import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Image configuration for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'euronews-001-site1.stempurl.com',
      },
      {
        protocol: 'https',
        hostname: 'euronews-001-site2.stempurl.com',
      },
      {
        protocol: 'https',
        hostname: '**.atempurl.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: true, // Changed to true to avoid optimization issues with CORS
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://euronews-001-site1.stempurl.com';
    return [
      {
        source: '/api/backend/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      // Proxy image requests to avoid CORS issues
      {
        source: '/backend-images/:path*',
        destination: `${backendUrl}/:path*`,
      },
      // Handle old article URL redirects using rewrites instead of middleware
      {
        source: '/article/:id',
        destination: '/articles/:id',
      },
    ];
  },
  async redirects() {
    return [
      // Handle legacy article URLs
      {
        source: '/article/:id',
        destination: '/articles/:id',
        permanent: true,
      },
    ];
  },
  // Enable CORS for development
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

export default nextConfig;
