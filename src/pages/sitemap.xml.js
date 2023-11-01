const Sitemap = () => null;

export async function getServerSideProps({ res }) {
    const baseUrl = 'https://rafi-codes.dev';
    const pages = ['/', '/about', '/contact', '/projects'];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages.map((page) => {
            const url = `${baseUrl}${page}`;
            return `
                <url>
                    <loc>${url}</loc>
                    <lastmod>${new Date().toISOString()}</lastmod>
                    <changefreq>monthly</changefreq>
                    <priority>1.0</priority>
                </url>`;
        }).join('')}
    </urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
};

export default Sitemap;