import useDateTime from '../hooks/useLiveDateTime';

export default function DateTime() {
    const [ currentDate, currentTime ] = useDateTime();

    return (
        <p suppressHydrationWarning>{currentDate} | {currentTime} </p>
    );
};