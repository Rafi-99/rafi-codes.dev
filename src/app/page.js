import { buildPageMetadata } from '@utils/shared/OpenGraph';
import HomeTerminal from '@components/home/HomeTerminal';
import GithubWidget from '@components/home/GithubWidget';
import styles from '@styles/page/index.module.css';

export const metadata = buildPageMetadata({
    title: 'Home',
    description: 'Welcome to my home base on the internet! Feel free to check out my portfolio.',
    socialDescription: 'Hello! My name is Rafi and I am a Full-Stack Software Engineer. Welcome to my home base on the internet.',
    image: {
        title: 'Home',
        description: 'Welcome to my portfolio!',
        prompt: '$ cat welcome.txt',
        tag: 'Home',
        accent: '#7dd3fc'
    }
});

export default function Home() {
    return (
        <div className={`page-flex ${styles.wrapper}`}>
            <HomeTerminal />
            <GithubWidget />
        </div>
    );
}
