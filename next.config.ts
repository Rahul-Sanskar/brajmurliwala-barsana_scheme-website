import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Force HTTPS for 1 year
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  // Control referrer info
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features not needed
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Content Security Policy
  // - Razorpay checkout requires checkout.razorpay.com in script-src and frame-src
  // - Google Maps requires maps.googleapis.com and maps.gstatic.com
  // - Web3Forms requires api.web3forms.com in connect-src
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Razorpay checkout + Google Maps + inline scripts needed by Next.js
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://maps.googleapis.com",
      // Styles: self + inline (Tailwind)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: self + data URIs + Razorpay + Google Maps tiles
      "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://*.razorpay.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // API calls: self + Razorpay + Web3Forms
      "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://api.web3forms.com",
      // iframes: Google Maps + Razorpay
      "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://maps.google.com https://www.google.com",
      // Workers for Next.js
      "worker-src 'self' blob:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  eslint: {
    /**
     * ESLint disabled during builds — eslint-config-next bundles old versions
     * of braces/micromatch that trigger audit warnings. These are dev-only tools.
     */
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
