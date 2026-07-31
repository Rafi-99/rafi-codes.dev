import { createSerwistRoute } from '@serwist/turbopack';

const revision = process.env.VERCEL_GIT_COMMIT_SHA ?? crypto.randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({ additionalPrecacheEntries: [{ url: '/offline', revision }], swSrc: 'src/app/sw.js', useNativeEsbuild: true });