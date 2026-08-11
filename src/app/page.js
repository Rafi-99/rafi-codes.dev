import { generateOpenGraphImage } from '@utils/OpenGraph';
import HomeTerminal from '@components/HomeTerminal';
import GithubWidget from '@components/GithubWidget';
import styles from '@styles/page/index.module.css';

export const metadata = {
    title: 'Home',
    description: 'Welcome to my home base on the internet! Feel free to check out my portfolio.',
    alternates: { canonical: '/' },
    openGraph: {
        title: 'Rafi Codes | Home',
        description: 'Hello! My name is Rafi and I am a Full-Stack Software Engineer. Welcome to my home base on the internet.',
        url: process.env.SITE_URL,
        images: [{ url: generateOpenGraphImage({ title: 'Rafi Codes', description: 'Welcome to my portfolio!', prompt: '$ cat welcome.txt', tag: 'Home', accent: '#7dd3fc' }), width: 1200, height: 630, alt: 'Rafi Codes - Home | Open Graph Card' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Rafi Codes | Home',
        description: 'Hello! My name is Rafi and I am a Full-Stack Software Engineer. Welcome to my home base on the internet.',
        images: [ generateOpenGraphImage({ title: 'Rafi Codes', description: 'Welcome to my portfolio!', prompt: '$ cat welcome.txt', tag: 'Home', accent: '#7dd3fc' }) ]
    }
};

export default function Home() {
    return (
        <div className={styles.wrapper}>
            <HomeTerminal />
            <GithubWidget />
        </div>
    );
}
