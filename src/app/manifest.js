import packageJson from '@root/package.json';

export default function manifest() {
    return {
        name: 'Rafi Codes',
        short_name: 'Rafi Codes',
        description: 'Rafi Codes | Software Engineer',
        version: packageJson.version,
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0a0d12',
        theme_color: '#0a0d12',
        icons: [
            {
                src: '/assets/favicons/favicon-16x16.png',
                sizes: '16x16',
                type: 'image/png',
            },
            {
                src: '/assets/favicons/favicon-32x32.png',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                src: '/assets/favicons/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/assets/favicons/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/assets/favicons/android-chrome-maskable-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/assets/favicons/android-chrome-maskable-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ]
    };
}
