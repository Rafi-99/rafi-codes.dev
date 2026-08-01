import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {

    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') ?? 'Rafi Codes';
    const description = searchParams.get('description') ?? 'Full-Stack Software engineer';
    const prompt = searchParams.get('prompt') ?? '$ whoami';
    const tag = searchParams.get('tag') ?? 'Portfolio';
    const accent = searchParams.get('accent') ?? '#6ee7a5';
    const year = new Date().getFullYear();

    return new ImageResponse(
        (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(150deg, #1d252e 0%, #141b22 50%, #0e141a 100%)', color: '#e6edf3', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', padding: 56, position: 'relative', overflow: 'hidden', border: '1px solid rgba(148, 163, 184, 0.2)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 40px 90px rgba(0, 0, 0, 0.6)' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 82% 6%, rgba(110, 231, 165, 0.1), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 22%)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                <div style={{ position: 'absolute', inset: 28, border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: 16 }} />
                <div style={{ position: 'absolute', left: 28, right: 28, top: 28, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02), transparent 80%)' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 999, background: '#ff6b6b' }} />
                        <div style={{ width: 10, height: 10, borderRadius: 999, background: '#ffb454' }} />
                        <div style={{ width: 10, height: 10, borderRadius: 999, background: accent }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, border: '1px solid rgba(110, 231, 165, 0.22)', background: 'rgba(6, 9, 12, 0.85)', color: '#cbd5e1' }}>
                        <div style={{ width: 8, height: 8, borderRadius: 999, background: accent }} />
                        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{tag}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 780 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 26, marginBottom: 16, fontWeight: 700, letterSpacing: '0.06em' }}>
                        <span style={{ display: 'flex', color: '#34d399' }}>rafi@codes:~$</span>
                        <span style={{ display: 'flex', color: '#ffffff' }}>{prompt.replace(/^\$\s*/, '')}</span>
                    </div>
                    <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, lineHeight: 1.02, marginBottom: 14, color: '#f8fbff', letterSpacing: '-0.03em', textShadow: '0 0 40px rgba(110, 231, 165, 0.18)' }}>{title}</div>
                    <div style={{ display: 'flex', fontSize: 30, color: '#b8c4d0', lineHeight: 1.24, maxWidth: 760 }}>{description}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 999, background: accent }} />
                        <div style={{ fontSize: 20, color: '#7d8b99', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Full-Stack Software Engineer</div>
                    </div>
                    <div style={{ display: 'flex', fontSize: 18, color: '#64748b', letterSpacing: '0.14em' }}>© {year} Rafi Codes</div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630
        },
    );
}
