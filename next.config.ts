import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // חשוב: אם אתה משתמש ב-Component של Image, צריך לבטל אופטימיזציה בסטטי
  images: {
    unoptimized: true,
  },
};


export default nextConfig;