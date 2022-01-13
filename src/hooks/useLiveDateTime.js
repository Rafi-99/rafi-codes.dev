import { useEffect, useState } from 'react';

export default function useLiveDateTime() {
    const [ dateState, setDateState ] = useState(new Date());
    const currentDate = dateState.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const currentTime = dateState.toLocaleTimeString();

    useEffect(() => {
        const interval = setInterval(() => setDateState(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return [ currentDate, currentTime ];
};