/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  // Configure basePath if deploying to a subfolder on GitHub Pages
  // basePath: '/your-repo-name',
  // Configure trailing slash for better compatibility with GitHub Pages
  trailingSlash: true,
}

export default nextConfig

