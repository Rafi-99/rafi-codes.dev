import { JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SerwistProvider } from '@serwist/turbopack/react';
import { generateOpenGraphImage } from '@utils/shared/OpenGraph';
import AmbientBackground from '@components/shared/AmbientBackground';
import Navigation from '@components/layout/Navigation';
import Footer from '@components/layout/Footer';
import '@styles/global/globals.css';

const jetbrainsMono = JetBrains_Mono({ subsets: [ 'latin' ], variable: '--font-jetbrains-mono', display: 'swap' });
const defaultOpenGraphImage = generateOpenGraphImage({ title: 'Rafi Codes', description: 'Full-Stack Software Engineer.' });

export const metadata = {
    metadataBase: new URL(process.env.SITE_URL),
    title: {
        default: 'Rafi Codes',
        template: 'Rafi Codes | %s',
    },
    description: 'Rafi Codes | Full-Stack Software Engineer.',
    manifest: '/manifest.webmanifest',
    icons: {
        icon: [
            { url: '/assets/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/assets/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/assets/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/assets/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
        ],
        other: [
            { rel: 'mask-icon', url: '/assets/favicons/safari-pinned-tab.svg', color: '#6ee7a5' }
        ],
    },
    other: {
        'msapplication-TileColor': '#0d1117',
        'msapplication-config': '/browserconfig.xml'
    },
    openGraph: {
        siteName: 'Rafi Codes',
        type: 'website',
        images: [ { url: defaultOpenGraphImage, width: 1200, height: 630, alt: 'Rafi Codes | Open Graph Card' } ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Rafi Codes',
        description: 'Rafi Codes | Full-Stack Software Engineer.',
        images: [ defaultOpenGraphImage ]
    }
};

export const viewport = {
    themeColor: '#0a0d12',
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    viewportFit: 'cover'
};

export default function RootLayout({ children }) {
    return (
        <html lang='en' className={jetbrainsMono.variable} data-scroll-behavior='smooth'>
            <body>
                <AmbientBackground />
                <Navigation />
                <SerwistProvider swUrl='/serwist/sw.js'>
                    <main>{children}</main>
                </SerwistProvider>
                <Footer />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
