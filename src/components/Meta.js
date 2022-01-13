import Head from 'next/head';

export default function Meta({ pageProps: { title, description, url, image } }) {
    return (
        <Head>
            <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no, viewport-fit=cover' />
            <meta property='og:title' content={title} key='title' />
            <meta property='og:description' content={description} key='description' />
            <meta property='og:url' content={url} key='url' />
            <meta property='og:image' content={image} key='image' />
            <meta name='description' content={description} />
            <title>{title}</title>
        </Head>
    );
};