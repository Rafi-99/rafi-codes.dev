import Image from 'next/legacy/image';
import Link from 'next/link';
import DateTime from '../components/DateTime';
import TypeWriter from '../components/TypeWriter';
import styles from '../styles/pages/index.module.css';

export default function Home() {
    return (
        <>
            <div className={styles.content}>
                <h1>👋🏾 Hello There!</h1>
                <div className={styles.profile}>
                    <Image src='/assets/images/profile.png' width={250} height={250} layout='intrinsic' alt='A picture of Rafi.' className={styles.picture} quality='100' priority />
                </div>
                <p>My name is Rafi.</p>
                <TypeWriter />
                <DateTime />

                <div className={styles.links}>
                    <Link href='/about'><button>About Me</button></Link>
                    <Link href='/projects'><button>My Projects</button></Link>
                    <Link href='/contact'><button>Contact Me</button></Link>
                </div>
            </div>
        </>
    );
};

Home.defaultProps = {
    title: 'Rafi Codes | Home',
    description: 'Welcome to my home base on the internet! Feel free to check out my portfolio.',
    url: 'https://www.rafi-codes.dev/',
    image: '/assets/favicons/Terminal.png'
};