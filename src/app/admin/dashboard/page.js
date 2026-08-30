import Link from 'next/link';
import { redirectIfUnauthenticated } from '@utils/admin/Auth';
import { getAdminStats } from '@utils/admin/Stats';
import { runHealthChecks } from '@utils/admin/Health';
import AdminStats from '@components/admin/AdminStats';
import HealthMonitor from '@components/admin/HealthMonitor';
import styles from '@styles/page/admin-dashboard.module.css';

export const metadata = {
    title: 'Admin Dashboard',
    robots: { index: false, follow: false }
};

const HEALTH_IDS = [ 'www', 'memes', 'portal', 'crypto', 'mongo', 'github', 'google' ];

export default async function AdminDashboard() {
    await redirectIfUnauthenticated();

    const [stats, healthResults] = await Promise.all([ getAdminStats(), runHealthChecks(HEALTH_IDS) ]);
    const initialScore = { up: Object.values(healthResults).filter((response) => response.ok).length, total: HEALTH_IDS.length };
    const commitSha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
    const commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE;
    const branch = process.env.VERCEL_GIT_COMMIT_REF;

    const healthSections = [
        {
            label: 'Domains',
            subsections: [
                {
                    label: 'Front End',
                    items: [
                        {
                            id: 'www',
                            name: 'www.rafi-codes.dev',
                            description: 'Portfolio'
                        },
                        {
                            id: 'memes',
                            name: 'memes.rafi-codes.dev',
                            description: 'Meme API'
                        },
                        {
                            id: 'portal',
                            name: 'portal.rafi-codes.dev',
                            description: 'Portal - Password Manager Client'
                        }
                    ]
                },
                {
                    label: 'Back End',
                    items: [
                        {
                            id: 'crypto',
                            name: 'cryptography-service.rafi-codes.dev',
                            description: 'Portal - Password Manager Server'
                        }
                    ]
                }
            ]
        },
        {
            label: 'Services',
            items: [
                {
                    id: 'mongo',
                    name: 'MongoDB',
                    description: 'Portfolio Cluster'
                },
                {
                    id: 'github',
                    name: 'GitHub API',
                    description: 'Repositories',
                },
                {
                    id: 'google',
                    name: 'Google APIs',
                    description: 'Gmail · reCAPTCHA'
                }
            ]
        },
        {
            label: 'Deployment',
            items: [
                {
                    id: 'deployment',
                    name: commitSha ? `${branch}@${commitSha}` : 'Local Development',
                    description: commitMessage || (!commitSha ? 'Not available' : undefined),
                    static: true,
                    state: commitSha ? 'active' : 'pending'
                }
            ]
        }
    ];

    return (
        <div className={`page-flex ${styles.wrapper}`}>
            <p className='prompt-line'>
                <span className='prompt-symbol'>$</span> ls /root
            </p>

            <div className={styles.dashboardBody}>
                <section className={styles.section}>
                    <p className={styles.sectionLabel}>Live Monitoring</p>
                    <AdminStats initialStats={stats} initialScore={initialScore} healthIds={HEALTH_IDS}/>
                </section>

                <section className={styles.section}>
                    <p className={styles.sectionLabel}>System Health</p>
                    <HealthMonitor sections={healthSections} initialResults={healthResults}/>
                </section>

                <section className={styles.section}>
                    <p className={styles.sectionLabel}>Utilities</p>
                    <div className={styles.utilitiesList}>
                        <Link href='/admin/dashboard/tickets' className='pushable accent'>Task Board</Link>
                        <Link href='/admin/dashboard/settings' className='pushable accent'>Settings</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
