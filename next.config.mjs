/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict Mode intentionally double-invokes effects in dev, which races
  // against ScrollTrigger's pin-spacer DOM restructuring and is the
  // well-documented cause of "removeChild ... not a child of this node"
  // errors with GSAP. Turned off for that reason.
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
      {
        protocol: "https",
        hostname: "greenpal-images.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
