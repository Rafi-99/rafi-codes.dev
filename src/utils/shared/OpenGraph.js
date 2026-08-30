export function generateOpenGraphImage({ title, description, prompt, tag, accent }) {
    return `/api/open-graph?${new URLSearchParams({ title, description, prompt, tag, accent }).toString()}`;
}

export function buildPageMetadata({ title, description, path = '', socialDescription, image }) {
    const url = `${process.env.SITE_URL}${path}`;
    const socialTitle = `Rafi Codes | ${title}`;
    const imageUrl = generateOpenGraphImage(image);
    const alt = `Rafi Codes - ${title} | Open Graph Card`;

    return {
        title,
        description,
        alternates: { canonical: path || '/' },
        openGraph: {
            title: socialTitle,
            description: socialDescription,
            url,
            images: [ { url: imageUrl, width: 1200, height: 630, alt } ]
        },
        twitter: {
            card: 'summary_large_image',
            title: socialTitle,
            description: socialDescription,
            images: [ imageUrl ]
        }
    };
}
