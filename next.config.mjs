import withPWA from 'next-pwa';

export default withPWA({
    pwa: {
        dest: 'public',
        disable: process.env.NODE_ENV === 'development',
        mode: 'production'
    },

    reactStrictMode: true
});