'use client';

import { useCallback, useEffect, useState } from 'react';
import { MdRefresh } from 'react-icons/md';
import { useLastUpdated } from '@hooks/useLastUpdated';
import styles from '@styles/component/HealthMonitor.module.css';

const POLL_INTERVAL_MS = 30000; // Every 30s

function Row({ item, result, retrying, onRetry }) {
    const state = item.static ? item.state : result === undefined ? 'pending' : result.ok ? 'active' : 'down';
    const checked = useLastUpdated(result?.checkedAt);

    return (
        <div className={styles.row}>
            <span className={styles.dot} data-state={state} />
            <div className={styles.info}>
                <p className={styles.name} title={item.name}>{item.name}</p>
                {item.description && <p className={styles.meta}>{item.description}</p>}
            </div>
            {!item.static && result?.checkedAt && (
                <p className={styles.checked}>Last checked: <span suppressHydrationWarning>{checked}</span></p>
            )}
            {!item.static && (
                <button type='button' onClick={() => onRetry(item.id)} className={styles.retry} aria-label={`Retry ${item.name} check`} disabled={retrying}>
                    <MdRefresh className={retrying ? styles.retrySpinning : ''} />
                </button>
            )}
        </div>
    );
}

export default function HealthMonitor({ sections, initialResults }) {
    const allIds = sections.flatMap((section) => (section.subsections ? section.subsections.flatMap((subsection) => subsection.items) : section.items).filter((item) => !item.static).map((item) => item.id));
    const [ results, setResults ] = useState(initialResults ?? {});
    const [ retrying, setRetrying ] = useState({});

    const fetchChecks = useCallback(async (targetIds, ignoreCache = false) => {
        if (!targetIds.length) {
            return;
        }

        try {
            const url = `/api/admin/dashboard/health?ids=${targetIds.join(',')}${ignoreCache ? '&ignoreCache=true' : ''}`;
            const response = await fetch(url);

            if (!response.ok) {
                return;
            }

            const data = await response.json();
            setResults((previous) => ({ ...previous, ...data }));
        }
        catch (error) {
            console.error('Failed to poll health checks:', error);
        }
    }, []);

    // This interval is purely the periodic refresh.
    useEffect(() => {
        const interval = setInterval(() => fetchChecks(allIds), POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [ allIds.join(','), fetchChecks ]);

    const handleRetry = async (id) => {
        setRetrying((previous) => ({ ...previous, [id]: true }));
        await fetchChecks([ id ], true);
        setRetrying((previous) => ({ ...previous, [id]: false }));
    };

    return (
        <div className={styles.card}>
            {sections.map((section) => (
                <div key={section.label} className={styles.section}>
                    <p className={styles.sectionTitle}>{section.label}</p>
                    {section.subsections ?
                    (
                        <div className={styles.subsectionGroup}>
                            {section.subsections.map((sub) => (
                                <div key={sub.label} className={styles.subsection}>
                                    <p className={styles.subsectionTitle}>{sub.label}</p>
                                    <div className={styles.rows}>
                                        {sub.items.map((item) => (
                                            <Row key={item.id} item={item} result={results[item.id]} retrying={!!retrying[item.id]} onRetry={handleRetry} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                    :
                    (
                        <div className={styles.rows}>
                            {section.items.map((item) => (
                                <Row key={item.id} item={item} result={results[item.id]} retrying={!!retrying[item.id]} onRetry={handleRetry} />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
