import Meta from './Meta';
import Navigation from './Navigation';
import Footer from './Footer';

export default function Layout({ children }) {
    return (
        <>
            <Meta pageProps={children.props} />
            <Navigation />
            <main>{children}</main>
            <Footer />
        </>
    );
};