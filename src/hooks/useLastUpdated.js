'use client';

import { useEffect, useState } from 'react';

function getAgeLabel(date, now) {
    if (!date) {
        return { label: null, next: null };
    }

    const age = now - new Date(date).getTime();
    const seconds = Math.floor(age / 1000);

    if (seconds < 10) {
        return { label: 'just now', next: 10_000 - age };
    }

    if (seconds < 60) {
        return { label: `${seconds}s ago`, next: 1000 - (age % 1000) };
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return { label: `${minutes}m ago`, next: 60_000 - (age % 60_000) };
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return { label: `${hours}h ago`, next: 3_600_000 - (age % 3_600_000) };
    }

    const days = Math.floor(hours / 24);

    return { label: `${days}d ago`, next: 86_400_000 - (age % 86_400_000) };
}

export function useLastUpdated(date) {
    const [ now, setNow ] = useState(() => Date.now());
    const { label, next } = getAgeLabel(date, now);

    useEffect(() => {
        if (next == null) {
            return;
        }
        const timer = setTimeout(() => setNow(Date.now()), next);
        return () => clearTimeout(timer);
    }, [ now, date ]);

    return label;
}
