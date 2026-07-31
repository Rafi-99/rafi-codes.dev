export default function sitemap() {
    const routes = ['', '/about', '/projects', '/contact'];

    return routes.map((route) => ({
        url: `${process.env.SITE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.7,
    }));
}
