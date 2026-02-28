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
};

module.exports = nextConfig;
