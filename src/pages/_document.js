import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html lang='en'>
                <Head>
                    <link rel='manifest' href='/manifest.json' />
                    <link rel='apple-touch-icon' sizes='180x180' href='/assets/icons/apple-touch-icon.png' />
                    <link rel='icon' type='image/png' href='/assets/favicons/Terminal.png' />
                    <link rel='icon' type='image/png' sizes='32x32' href='/assets/icons/favicon-32x32.png' />
                    <link rel='icon' type='image/png' sizes='16x16' href='/assets/icons/favicon-16x16.png' />
                    <link rel='mask-icon' href='/assets/icons/safari-pinned-tab.svg' color='#080e2a' />
                    <link rel='shortcut icon' href='/assets/icons/favicon.ico' />
                    <meta charSet='UTF-8' />
                    <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
                    <meta name='msapplication-TileColor' content='#080e2a' />
                    <meta name='msapplication-config' content='/browserconfig.xml' />
                    <meta name='theme-color' content='#202020' />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    };
};

export default MyDocument;