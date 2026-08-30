'use client';

import { useEffect, useState } from 'react';
import styles from '@styles/component/AdminStats.module.css';

const STATS_POLL_INTERVAL_MS = 10000; // Check every 10s
const HEALTH_POLL_INTERVAL_MS = 60000; // Check every 60s

export default function AdminStats({ initialStats, initialScore, healthIds }) {
    const [ stats, setStats ] = useState(initialStats ?? null);
    const [ score, setScore ] = useState(initialScore ?? null);

    useEffect(() => {
        let cancelled = false;

        const pollStats = async () => {
            try {
                const response = await fetch('/api/admin/dashboard/stats');

                if (response.ok) {
                    const data = await response.json();

                    if (!cancelled) {
                        setStats(data);
                    }
                }
                else if (!cancelled) {
                    setStats(null);
                }
            }
            catch (error) {
                console.error('Failed to poll admin stats:', error);

                if (!cancelled) {
                    setStats(null);
                }
            }
        };

        pollStats();
        const interval = setInterval(pollStats, STATS_POLL_INTERVAL_MS);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    // The health score drives external checks, so poll it slowly in a seperate hook.
    useEffect(() => {
        let cancelled = false;

        const pollHealth = async () => {
            try {
                const response = await fetch(`/api/admin/dashboard/health?ids=${healthIds.join(',')}`);

                if (response.ok) {
                    const data = await response.json();
                    const up = Object.values(data).filter((health) => health.ok).length;

                    if (!cancelled) {
                        setScore({ up, total: healthIds.length });
                    }
                }
                else if (!cancelled) {
                    setScore(null);
                }
            }
            catch (error) {
                console.error('Failed to poll admin health score:', error);

                if (!cancelled) {
                    setScore(null);
                }
            }
        };

        const interval = setInterval(pollHealth, HEALTH_POLL_INTERVAL_MS);
        
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [ healthIds.join(',') ]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <p className={styles.value}>{stats ? stats.activeSessions : '—'}</p>
                    <p className={styles.label}>Active Sessions</p>
                </div>
                <div className={styles.card}>
                    <p className={styles.value}>{stats ? stats.projectCount : '—'}</p>
                    <p className={styles.label}>Open Projects</p>
                </div>
                <div className={styles.card}>
                    <p className={styles.value}>{stats ? stats.openTickets : '—'}</p>
                    <p className={styles.label}>Open Tickets</p>
                </div>
                <div className={styles.card}>
                    <p className={styles.value}>{stats ? stats.totalTickets : '—'}</p>
                    <p className={styles.label}>Total Tickets</p>
                </div>
            </div>
            <div className={`${styles.card} ${styles.scoreCard}`}>
                <p className={styles.value}>{score ? `${score.up}/${score.total}` : '—'}</p>
                <p className={styles.label}>System Health Score</p>
            </div>
        </div>
    );
}
