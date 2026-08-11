import Image from 'next/image';
import Link from 'next/link';
import { generateOpenGraphImage } from '@utils/OpenGraph';
import { GrReddit, GrHeroku } from "react-icons/gr";
import { SiGithub, SiGradle, SiDiscord, SiYoutube, SiNodedotjs, SiNextdotjs, SiMongodb, SiSquarespace } from 'react-icons/si';
import FadeInSection from '@components/FadeInSection';
import TerminalWindow from '@components/TerminalWindow';
import styles from '@styles/page/projects.module.css';

export const metadata = {
    title: 'Projects',
    description: 'Project showcase.',
    alternates: { canonical: '/projects' },
    openGraph: {
        title: 'Rafi Codes | Projects',
        description: 'A collection of my recent projects.',
        url: `${process.env.SITE_URL}/projects`,
        images: [{ url: generateOpenGraphImage({ title: 'My Projects', description: 'Take a look at what I have been working on!', prompt: '$ ls ./projects', tag: 'Projects', accent: '#fbbf24' }), width: 1200, height: 630, alt: 'Rafi Codes - Projects | Open Graph Card' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Rafi Codes | Projects',
        description: 'A collection of my recent projects.',
        images: [ generateOpenGraphImage({ title: 'My Projects', description: 'Take a look at what I have been working on!', prompt: '$ ls ./projects', tag: 'Projects', accent: '#fbbf24' }) ]
    }
};

const projects = [
    {
        image: '/assets/images/discord.png',
        title: 'The Monitor',
        status: 'Archived',
        repo: 'https://www.github.com/Rafi-99/The-Monitor',
        description: 'Multipurpose Discord server bot built with Gradle and open-source libraries. Used for running a variety of commands in multiple servers and channels. Smooth music/video playback is provided through LavaPlayer and Google\u2019s YouTube API. Hosted 24/7 through Heroku with a PostgreSQL database for storing multiple server settings.',
        tools: [ <SiGradle key='gradle' />, <SiDiscord key='discord' />, <SiYoutube key='youtube' /> ],
    },
    {
        image: '/assets/images/meme.png',
        title: 'Meme API',
        status: 'Archived',
        repo: 'https://www.github.com/Rafi-99/Meme-API',
        description: 'A simple Node.js Express API for fetching memes off Reddit, deployed with Heroku. Each GET request returns a random JSON response with relevant information about the meme. Compatible with most subreddits.',
        tools: [ <SiNodedotjs key='node' />, <GrReddit key='reddit' />, <GrHeroku key ='heroku' /> ],
    },
    {
        image: '/assets/images/nextjs.png',
        title: 'Rafi Codes',
        status: 'Active',
        repo: 'https://www.github.com/Rafi-99/rafi-codes.dev',
        description: 'The site you\u2019re on right now is a full-stack progressive web app built with the Next.js App Router and a MongoDB database. The domain has been acquired through Squarespace (formerly Google Domains) and the site is currently deployed on Vercel.',
        tools: [ <SiNextdotjs key='next' />, <SiMongodb key='mongo' />, <SiSquarespace key='squarespace' /> ],
    },
];

export default function Projects() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.intro}>
                <h1><span className={styles.promptSymbol}>$</span> ls ./projects</h1>
                <p>Come check out what I&apos;ve been working on recently!</p>
            </div>
            <div className={styles.cardsContainer}>
                {projects.map((project, index) => (
                    <FadeInSection key={project.title} delay={index * 0.15}>
                        <TerminalWindow title={`${project.title.replace(/\s+/g, '-')}/README.md`} variant='interactive'>
                        <div className={styles.cardBody}>
                            <div className={styles.thumb}><Image src={project.image} fill sizes='(min-width: 900px) 45vw, 100vw' alt={`Project thumbnail: ${project.title}`} /></div>
                            <h2>
                                <Link className={styles.titleGroup} href={project.repo} rel='noopener noreferrer' target='_blank' aria-label={`Link to Rafi's GitHub project | ${project.title}`}>{project.title}&nbsp;<SiGithub /></Link>
                                <span className={styles.status} data-status={project.status}>{project.status}</span>
                            </h2>
                            <p>{project.description}</p>
                            <div className={styles.tools}>{project.tools}</div>
                        </div>
                        </TerminalWindow>
                    </FadeInSection>
                ))}
            </div>
        </div>
    );
}
