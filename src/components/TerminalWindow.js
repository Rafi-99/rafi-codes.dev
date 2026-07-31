const variants = {
    interactive: 'terminal--interactive',
    ambient: 'terminal--ambient',
};

export default function TerminalWindow({ title, children, className = '', variant }) {
    const variantClass = variant ? variants[variant] : '';

    return (
        <div className={`terminal ${variantClass} ${className}`.trim()}>
            <div className='terminal_bar'>
                <span className='terminal_dot' style={{ background: '#ff5f56' }} />
                <span className='terminal_dot' style={{ background: '#ffbd2e' }} />
                <span className='terminal_dot' style={{ background: '#27c93f' }} />
                <span className='terminal_title'>{title}</span>
            </div>
            {children}
        </div>
    );
};
