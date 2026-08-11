const variants = {
    interactive: 'terminal-interactive',
    ambient: 'terminal-ambient',
};

export default function TerminalWindow({ title, children, className = '', variant }) {
    const variantClass = variant ? variants[variant] : '';

    return (
        <div className={`terminal ${variantClass} ${className}`.trim()}>
            <div className='terminal-bar'>
                <span className='terminal-dot' style={{ background: '#ff5f56' }} />
                <span className='terminal-dot' style={{ background: '#ffbd2e' }} />
                <span className='terminal-dot' style={{ background: '#27c93f' }} />
                <span className='terminal-title'>{title}</span>
            </div>
            {children}
        </div>
    );
}
