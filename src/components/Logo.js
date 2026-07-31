export default function Logo({ size = 26, className = '' }) {
    return (
        <svg width={size} height={size} viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg' className={className} aria-hidden='true'>
            <rect x='1' y='1' width='30' height='30' rx='7' stroke='currentColor' strokeOpacity='0.35' strokeWidth='1.5' />
            <path d='M8.5 11.5L14 16L8.5 20.5' stroke='#6ee7a5' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M17 20.5H23.5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
        </svg>
    );
};
