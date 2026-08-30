import Image from 'next/image';
import Link from 'next/link';
import { getCollection } from '@utils/shared/DatabaseService';
import { buildPageMetadata } from '@utils/shared/OpenGraph';
import { FaDownload } from 'react-icons/fa';
import SkillsJson from '@components/about/SkillsJson';
import FadeInSection from '@components/shared/FadeInSection';
import TerminalWindow from '@components/shared/TerminalWindow';
import styles from '@styles/page/about.module.css';

export const metadata = buildPageMetadata({
    title: 'About',
    description: 'About Rafi: Software Engineer',
    path: '/about',
    socialDescription: 'Click here to learn more about me!',
    image: {
        title: 'About Rafi',
        description: 'Check out my skills and work experience.',
        prompt: '$ whoami',
        tag: 'About',
        accent: '#34d399',
    },
});

export const revalidate = 3600;

async function getAboutData() {
    try {
        const cv = await getCollection('app', 'about_cv');
        const [ skillsDocument, workExperienceDocument ] = await Promise.all([cv.findOne({ _id: 'skills' }), cv.findOne({ _id: 'work_experience' })]);

        const skills = skillsDocument.items;
        const jobs = workExperienceDocument.items.reverse().slice(0, 5);

        return { skills, jobs };
    }
    catch (error) {
        console.error('Error: Failed to fetch data from MongoDB.', error);
        return null;
    }
}

export default async function About() {
    const data = await getAboutData();

    if (!data) {
        throw new Error('Error: Failed to fetch data from the database.');
    }

    const { skills, jobs } = data;

    return (
        <div className='page-wrapper'>
            <div className={styles.intro}>
                <p className='prompt-line'><span className='prompt-symbol'>$</span> whoami</p>
                <div className={styles.introRow}>
                    <Image src='/assets/images/runner.png' width={140} height={140} alt='A picture of Rafi.' className={styles.picture} priority />
                    <p className={styles.bio}>
                        <span className='prompt-symbol'>#</span> Hello! My name is Rafi and I&apos;m a software engineer from Edina, Minnesota. My favorite languages are Java and JavaScript — keep scrolling to learn more about me.
                    </p>
                </div>
            </div>

            <TerminalWindow title='rafi@codes: ~/about' className={styles.terminal}>
                <h2 className={styles.titles}><span className='prompt-symbol'>$</span> cat skills.json</h2>
                <SkillsJson skills={skills} />

                <h2 className={styles.titles}><span className='prompt-symbol'>$</span> git log --experience</h2>
                <div className={styles.jobs}>
                    {jobs.map((job) => (
                        <FadeInSection key={job.id}>
                            <div className={styles.jobCard}>
                                <p className={styles.jobTitle}>{job.title}</p>
                                <p className={styles.jobMeta}>{job.duration} · {job.location}</p>
                                <div className={styles.bullets}>
                                    {job.description.map((bullet, index) => (
                                        <p key={index} className={styles.bullet}>{bullet}</p>
                                    ))}
                                </div>
                            </div>
                        </FadeInSection>
                    ))}
                </div>

                <h2 className={styles.titles}><span className='prompt-symbol'>$</span> cat interests.txt</h2>
                <p className={styles.interests}>Software Engineering, Web Development, Fitness, Reading, and Spicy Food</p>

                <div className={styles.resumeWrapper}>
                    <Link href='/assets/pdf/Md_Rafi_Résumé.pdf' target='_blank' className='pushable accent'><FaDownload />&nbsp;Download Résumé</Link>
                </div>
            </TerminalWindow>
        </div>
    );
}
