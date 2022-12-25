const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    mode: 'production',
});

module.exports = withPWA({
    reactStrictMode: true
});