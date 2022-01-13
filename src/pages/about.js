import Image from 'next/image';
import Link from 'next/link';
import { FaLaptopCode, FaReact, FaAws, FaDatabase, FaDownload } from 'react-icons/fa';
import FadeInSection from '../components/FadeInSection';
import { getConnection } from '../utils/DatabaseService';
import styles from '../styles/pages/about.module.css';

export default function About({ skills, jobs, icons }) {
    return (
        <>
            <div className={styles.intro}>
                <Image src='/assets/images/runner.png' width={250} height={250} layout='intrinsic' alt='A picture of Rafi.' className={styles.picture} quality='100' priority />
                <p>Hello! My name is Rafi and I am a software engineer from Edina, Minnesota. My favorite programming languages are Java and JavaScript! Keep scrolling to learn more about me!</p>
            </div>
            <h1 className={styles.titles}>Relevant Skills</h1>
            <div className={styles.skills}>
                {skills.map((skill) => {
                    return (
                        <div key={skill._id}>
                            {icons[skill._id - 1]}
                            <p>{skill.category}</p>
                            <p>{skill.description}</p>
                        </div>
                    );
                })}
            </div>
            <h1 className={styles.titles}>Relevant Experience</h1>
            <div className={styles.jobs}>
                {jobs.map((job) => {
                    return (
                        <FadeInSection key={job._id}>
                            <p>{job.title}</p>
                            <p>{job.duration} | {job.location}</p>
                            <div>
                                {job.description.map((bullet, index) => {
                                    return (
                                        <p key={index}>{bullet}</p>
                                    );
                                })}
                            </div>
                        </FadeInSection>
                    );
                })}
            </div>
            <h1 className={styles.titles}>My Interests</h1>
            <p style={{ textAlign: 'center', padding: '0 2rem' }}>Software Engineering, Web Development, Fitness, Reading, and Spicy Food</p>
            <button className={styles.button}>
                <Link href='/assets/pdf/Md_Rafi_Résumé.pdf'><a target='_blank'><FaDownload />&nbsp;Download Résumé</a></Link>
            </button>
        </>
    );
};

export async function getServerSideProps() {
    try {
        const client = await getConnection();
        const data = await Promise.all([
            client.db('résumé').collection('skills').find().sort({ _id: 1 }).toArray(),
            client.db('résumé').collection('work_experience').find().sort({ _id: -1 }).limit(5).toArray()
        ]);

        return {
            props: {
                skills: data[0],
                jobs: data[1]
            }
        };
    } catch (error) {
        console.log('Error: Failed to fetch data from MongoDB');
        console.error(error);
        return {
            notFound: true
        };
    }
};

About.defaultProps = {
    title: 'Rafi Codes | About',
    description: 'About Rafi: Full Stack Software Engineer',
    url: 'https://www.rafi-codes.dev/about',
    image: '/assets/images/runner.png',
    icons: [ <FaLaptopCode key={1} />, <FaReact key={2} />, <FaAws key={3} />, <FaDatabase key={4} /> ]
};