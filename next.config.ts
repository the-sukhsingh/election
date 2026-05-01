import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // ── Security Headers ──────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Block clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Control referrer info
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Restrict browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // HTTPS-only (Cloud Run serves HTTPS; safe to include)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js inline scripts + Framer Motion
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com",
              // Google Translate styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com",
              // Google Fonts + Translate
              "font-src 'self' https://fonts.gstatic.com",
              // Google Translate widget + API calls
              "connect-src 'self' https://translate.googleapis.com https://translate.google.com https://generativelanguage.googleapis.com",
              // Allow Google Translate images
              "img-src 'self' data: https://translate.google.com https://www.gstatic.com",
              // Iframes blocked
              "frame-src 'none'",
              // Objects blocked
              "object-src 'none'",
              // Base URI locked
              "base-uri 'self'",
              // Only HTTPS forms
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      // ── API route: extra headers ───────────────────────────────────────────
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },
};

export default nextConfig;
