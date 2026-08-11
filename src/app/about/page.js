import Image from 'next/image';
import Link from 'next/link';
import { getConnection } from '@utils/DatabaseService';
import { generateOpenGraphImage } from '@utils/OpenGraph';
import { FaDownload } from 'react-icons/fa';
import SkillsJson from '@components/SkillsJson';
import FadeInSection from '@components/FadeInSection';
import TerminalWindow from '@components/TerminalWindow';
import styles from '@styles/page/about.module.css';

export const metadata = {
    title: 'About',
    description: 'About Rafi: Software Engineer',
    alternates: { canonical: '/about' },
    openGraph: {
        title: 'Rafi Codes | About',
        description: 'Click here to learn more about me!',
        url: `${process.env.SITE_URL}/about`,
        images: [{ url: generateOpenGraphImage({title: 'About Rafi', description: 'Check out my skills and work experience.', prompt: '$ whoami', tag: 'About', accent: '#34d399' }), width: 1200, height: 630, alt: 'Rafi Codes - About | Open Graph Card' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Rafi Codes | About',
        description: 'Click here to learn more about me!',
        images: [ generateOpenGraphImage({title: 'About Rafi', description: 'Check out my skills and work experience.', prompt: '$ whoami', tag: 'About', accent: '#34d399' }) ]
    }
};

async function getAboutData() {
    try {
        const client = await getConnection();
        const [ skills, jobs ] = await Promise.all([client.db('résumé').collection('skills').find().sort({ _id: 1 }).toArray(), client.db('résumé').collection('work_experience').find().sort({ _id: -1 }).limit(5).toArray()]);

        return { skills, jobs };
    }
    catch (error) {
        console.error('Error: Failed to fetch data from MongoDB.', error);
        return null;
    }
};

export default async function About() {
    const data = await getAboutData();

    if (!data) {
        throw new Error('Failed to fetch data from the database.')
    }

    const { skills, jobs } = data;

    return (
        <div className={styles.wrapper}>
            <div className={styles.intro}>
                <h1 className={styles.promptLine}><span className={styles.promptSymbol}>$</span> whoami</h1>
                <div className={styles.introRow}>
                    <Image src='/assets/images/runner.png' width={140} height={140} alt='A picture of Rafi.' className={styles.picture} priority />
                    <p className={styles.bio}><span className={styles.promptSymbol}>#</span> Hello! My name is Rafi and I&apos;m a software engineer from Edina, Minnesota. My favorite languages are Java and JavaScript — keep scrolling to learn more about me.</p>
                </div>
            </div>

            <TerminalWindow title='rafi@codes: ~/about' className={styles.terminal}>
                <h2 className={styles.titles}><span className={styles.promptSymbol}>$</span> cat skills.json</h2>
                <SkillsJson skills={skills} />

                <h2 className={styles.titles}><span className={styles.promptSymbol}>$</span> git log --experience</h2>
                <div className={styles.jobs}>
                    {jobs.map((job) => (
                            <FadeInSection key={job._id}>
                                <div className={styles.jobCard}>
                                    <p className={styles.jobTitle}>{job.title}</p>
                                    <p className={styles.jobMeta}>{job.duration} · {job.location}</p>
                                    <div className={styles.bullets}>
                                        {job.description.map((bullet, index) => (
                                                <p key={index} className={styles.bullet}>{bullet}</p>
                                            ))
                                        }
                                    </div>
                                </div>
                            </FadeInSection>
                        ))
                    }
                </div>

                <h2 className={styles.titles}><span className={styles.promptSymbol}>$</span> cat interests.txt</h2>
                <p className={styles.interests}>Software Engineering, Web Development, Fitness, Reading, and Spicy Food</p>

                <div className={styles.resumeWrapper}>
                    <Link href='/assets/pdf/Md_Rafi_Résumé.pdf' target='_blank' className={styles.button}>
                        <FaDownload />&nbsp;Download Résumé
                    </Link>
                </div>
            </TerminalWindow>
        </div>
    );
}
