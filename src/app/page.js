import Image from 'next/image';
import Link from 'next/link';
import DateTime from '@components/DateTime';
import TypeWriter from '@components/TypeWriter';
import TerminalWindow from '@components/TerminalWindow';
import styles from '@styles/page/index.module.css';

export const metadata = {
    title: 'Home',
    description: 'Welcome to my home base on the internet! Feel free to check out my portfolio.',
    alternates: { canonical: '/' },
    openGraph: {
        title: 'Rafi Codes | Home',
        description: 'Welcome to my home base on the internet! Feel free to check out my portfolio.',
        url: process.env.SITE_URL,
        images: ['/assets/images/profile.png'],
    },
};

export default function Home() {
    return (
        <div className={styles.wrapper}>
            <TerminalWindow title="rafi@codes: ~" className={styles.terminal} variant="ambient">
                <div className={styles.content}>
                    <div className={styles.profile}>
                        <Image src="/assets/images/profile.png" width={140} height={140} alt="A picture of Rafi." className={styles.picture} priority />
                    </div>

                    <div className={styles.commandBlock}>
                        <p className={styles.greeting}>
                            <span className={styles.promptSymbol}>rafi@codes:~$</span> cat welcome.txt
                        </p>
                        <p className={styles.greeting}>
                            Hello! I&apos;m Rafi. 👋🏾
                        </p>
                        <TypeWriter />
                    </div>
                    <DateTime />

                    <div className={styles.links}>
                        <Link href="/about"><button>$ cd ~/about</button></Link>
                        <Link href="/projects"><button>$ cd ~/projects</button></Link>
                        <Link href="/contact"><button>$ cd ~/contact</button></Link>
                    </div>
                </div>
            </TerminalWindow>
        </div>
    );
}
