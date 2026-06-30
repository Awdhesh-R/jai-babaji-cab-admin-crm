/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use standalone for Docker builds, not for Vercel
  ...(process.env.STANDALONE === "true" && { output: "standalone" }),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.rodbez.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/**",
      },
    ],
  },
  // Exclude olamaps-web-sdk from server-side bundling (browser-only)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("olamaps-web-sdk");
    }
    return config;
  },
  // Suppress warnings about missing client reference manifest files in standalone builds
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Experimental features to improve build stability
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Security headers to prevent XSS, clickjacking, and other attacks
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com https://api.olamaps.io https://eazypay.icicibank.com", // Google Maps & OlaMaps scripts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com https://api.olamaps.io https://eazypay.icicibank.com", // Google Maps & OlaMaps styles
              "img-src 'self' data: https: https://maps.googleapis.com https://maps.gstatic.com https://api.olamaps.io https://eazypay.icicibank.com", // Google Maps & OlaMaps tiles
              "font-src 'self' data: https://fonts.gstatic.com", // Google Fonts
              "connect-src 'self' https://api.rodbez.com https://*.rodbez.com https://maps.googleapis.com https://api.olamaps.io http://local-admin.rodbez.com:5001 http://localhost:5001 https://eazypay.icicibank.com", // Google Maps & OlaMaps API calls
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https://eazypay.icicibank.com", // ICICI Bank EazyPay form submissions
              "frame-src 'none' https://maps.googleapis.com https://api.olamaps.io https://eazypay.icicibank.com", // Google Maps & OlaMaps iframes
              "worker-src 'self' blob:", // Allow web workers from same origin and blob URLs
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
