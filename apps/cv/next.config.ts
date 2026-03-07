import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  transpilePackages: ['@myui/ui'],
  turbopack: {
    // Explicitly set the monorepo root so Next.js doesn't infer the wrong one
    root: path.resolve(dirname, '../..'),
  },
};

export default nextConfig;
