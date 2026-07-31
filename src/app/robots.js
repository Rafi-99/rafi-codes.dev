export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        host: process.env.SITE_URL,
        sitemap: `${process.env.SITE_URL}/sitemap.xml`,
    };
}
