// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;



// next.config.mjs
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);



