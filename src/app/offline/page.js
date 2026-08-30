'use client';

export default function Offline() {
    return (
        <div className='page-flex status-wrapper'>
            <div className='status-text'>
                <p className='prompt-line'><span className='prompt-symbol'>$</span> ping rafi-codes.dev</p>
                <h1>No Connection</h1>
                <p>It looks like you&apos;re offline. Please try again.</p>
                <div className='status-actions'>
                    <button type='button' onClick={() => window.location.reload()} className='pushable accent'>$ retry</button>
                </div>
            </div>
        </div>
    );
}
