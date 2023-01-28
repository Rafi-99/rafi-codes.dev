import Image from 'next/legacy/image';
import Link from 'next/link';
import { FaNodeJs, FaRedditSquare } from 'react-icons/fa';
import { SiDiscord, SiGithub, SiGoogledomains, SiGradle, SiHeroku, SiMongodb, SiNextdotjs, SiYoutube } from 'react-icons/si';
import styles from '../styles/pages/projects.module.css';

export default function Projects() {
    return (
        <>
            <div className={styles.intro}>
                <h1>My Projects</h1>
                <p>Come check out what I have been working on recently!</p>
            </div>

            <div className = {styles.cards_container}>
                <div>
                    <Image src ='/assets/images/discord.png' width={3840} height={2160} alt='Project Thumbnail: The-Monitor ™' priority />
                    <h1>The Monitor ™&nbsp;<Link href="https://www.github.com/Rafi-99/The-Monitor" rel="noopener noreferrer" target="_blank" aria-label="Link to Rafi's GitHub Project | The Monitor ™"><SiGithub /></Link></h1>
                    <p>Multipurpose Discord server bot built with Gradle and open-source libraries. Used for running a variety of commands in multiple Discord servers. Smooth music/video playback is provided through LavaPlayer and Google&apos;s YouTube API. Hosted 24/7 through Heroku with a PostgreSQL database for storing multiple server settings.</p>
                    <div className={styles.tools}><SiGradle /><SiDiscord /><SiYoutube /></div>
                </div>
                <div>
                    <Image src='/assets/images/meme.png' width={3840} height={2160} alt='Project Thumbnail: Meme API' priority />
                    <h1>Meme API&nbsp;<Link href="https://www.github.com/Rafi-99/Meme-API" rel="noopener noreferrer" target="_blank" aria-label="Link to Rafi's GitHub Project | Meme API"><SiGithub /></Link></h1>
                    <p>This project is a simple Node.js Express API I created for fetching memes off Reddit. It&apos;s currently being hosted with Heroku. Each GET request to the API returns a random JSON response with all the necessary information about the meme. My API is able to access most reddit subreddits and will give you a good laugh or two!</p>
                    <div className={styles.tools}><FaNodeJs /><FaRedditSquare /><SiHeroku /></div>
                </div>
                <div>
                    <Image src='/assets/images/nextjs.png' width={3840} height={2160} alt='Project Thumbnail: Rafi Codes | Portfolio' />
                    <h1>Rafi Codes&nbsp;<Link href="https://www.github.com/Rafi-99/rafi-codes.dev" rel="noopener noreferrer" target="_blank" aria-label="Link to Rafi's GitHub Project | Portfolio"><SiGithub /></Link></h1>
                    <p>The website you&apos;re on right now is a full-stack progressive web app built using the Next.js React framework. My site utilizes a MongoDB database for data retrieval. My custom domain is provided through Google Domains and the site is currently being hosted on Vercel. Current plans include implementing more SEO and perfomance optimizations and learning Three.js.</p>
                    <div className={styles.tools}><SiNextdotjs /><SiMongodb /><SiGoogledomains /></div>
                </div>
            </div>
        </>
    );
};

Projects.defaultProps = {
    title: 'Rafi Codes | Projects',
    description: 'This page is a showcase of all my projects.',
    url: 'https://www.rafi-codes.dev/projects',
    image: '/assets/images/nextjs.png',
};