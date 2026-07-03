/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/physics/new?moduleId=1&ignoreBlock=true',
                permanent: false,
            },
        ];
    },
    async rewrites() {
        return [
            // /console and /console/* → physics virtuallab SPA
            { source: '/console', destination: '/physics/virtuallab.html' },
            { source: '/console/:p*', destination: '/physics/virtuallab.html' },
            // /physics/* catch-all SPA fallback (non-file routes)
            { source: '/physics/new', destination: '/physics/virtuallab.html' },
        ];
    },
    // [SAFARI IFRAME FIX] Serve every asset with cross-origin embedding headers so the lab works
    // inside smart-class's cross-origin iframe. Safari (ITP / cache partitioning) otherwise aborts
    // subresource/chunk loads → ChunkLoadError. no-cache keeps entry + chunks fresh so a re-mirror
    // never leaves stale hash references.
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
                    { key: 'Timing-Allow-Origin', value: '*' },
                    { key: 'Cache-Control', value: 'no-cache' },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
