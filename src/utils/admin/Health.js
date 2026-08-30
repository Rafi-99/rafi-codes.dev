import 'server-only';
import { getConnection } from '@utils/shared/DatabaseService';
import { checkGmailAuth } from '@utils/shared/MailService';
import { callRecaptchaAssessment } from '@utils/shared/Recaptcha';

const FETCH_TIMEOUT_MS = 10000;
const RECAPTCHA_CACHE_MS = 24 * 60 * 60 * 1000; // Called once a day, unless the cache is bypassed. Resets on cold server restarts.
const GMAIL_CACHE_MS = 5 * 60 * 1000; // getProfile() is cheap but there's no reason to hit Google every poll. Called every 5 minutes.

let recaptchaCache = { ok: null, checkedAt: 0 };
let gmailCache = { ok: null, checkedAt: 0 };

async function checkUrl(url, headers = {}) {
    const start = Date.now();

    try {
        const response = await fetch(url, { method: 'GET', cache: 'no-store', headers, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });

        if (!response.ok) {
            console.error(`Health check failed for ${url}: HTTP ${response.status}`);
        }

        return {
            ok: response.ok,
            latencyMs: Date.now() - start
        };
    }
    catch (error) {
        console.error(`Health check error occurred for ${url}:`, error.message);

        return {
            ok: false,
            latencyMs: null
        };
    }
}

async function checkMongo() {
    try {
        const client = await getConnection();
        const start = Date.now();
        await client.db('admin').command({ ping: 1 });

        return {
            ok: true,
            latencyMs: Date.now() - start
        };
    }
    catch {
        return {
            ok: false,
            latencyMs: null
        };
    }
}

async function checkGithub() {
    // Authenticated so the 10s polling doesn't exhaust GitHub's anonymous rate limit (60/hr). Falls back to anonymous if no token is set.
    const headers = process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};

    return checkUrl('https://api.github.com', headers);
}

async function checkRecaptchaLive() {
    try {
        const data = await callRecaptchaAssessment('health-check-probe');

        // A garbage token still returns a well-formed assessment (tokenProperties present) when the API key/project ID are genuinely correct — that's what proves the service is reachable and configured, not the fake token's own validity.
        return !!data?.tokenProperties;
    }
    catch {
        return false;
    }
}

async function checkGoogle(ignoreCache) {
    const now = Date.now();
    const recaptchaFresh = recaptchaCache.checkedAt && now - recaptchaCache.checkedAt < RECAPTCHA_CACHE_MS;
    const gmailFresh = gmailCache.checkedAt && now - gmailCache.checkedAt < GMAIL_CACHE_MS;

    let recaptchaOk;

    if (recaptchaFresh && !ignoreCache) {
        recaptchaOk = recaptchaCache.ok;
    }
    else {
        recaptchaOk = await checkRecaptchaLive();
        recaptchaCache = { ok: recaptchaOk, checkedAt: now };
    }

    let gmailOk;

    if (gmailFresh && !ignoreCache) {
        gmailOk = gmailCache.ok;
    }
    else {
        gmailOk = (await checkGmailAuth()).ok;
        gmailCache = { ok: gmailOk, checkedAt: now };
    }

    /**
     * "Last checked" should reflect the most recent *live* verification — a plain poll just serves cached results, so stamping it "now" would
     * be misleading. The caches' checkedAt only advance on a real check (retry or cache expiry), so take the newer of the two.
     */
    const lastLiveCheck = Math.max(recaptchaCache.checkedAt, gmailCache.checkedAt);

    return {
        ok: recaptchaOk && gmailOk,
        checkedAt: new Date(lastLiveCheck).toISOString()
    };
}


const DOMAIN_URLS = {
    www: 'https://www.rafi-codes.dev',
    memes: 'https://memes.rafi-codes.dev',
    portal: 'https://portal.rafi-codes.dev',
    crypto: 'https://cryptography-service.rafi-codes.dev'
};

const HEALTH_CHECKS = {
    www: () => Promise.resolve({ ok: true, latencyMs: null }),
    memes: () => checkUrl(DOMAIN_URLS.memes),
    portal: () => checkUrl(DOMAIN_URLS.portal),
    crypto: () => checkUrl(DOMAIN_URLS.crypto),
    mongo: () => checkMongo(),
    github: () => checkGithub(),
    google: (ignoreCache) => checkGoogle(ignoreCache)
};

export async function runHealthChecks(ids, ignoreCache = false) {
    const targets = ids?.length ? ids.filter((id) => HEALTH_CHECKS[id]) : Object.keys(HEALTH_CHECKS);
    const now = new Date().toISOString();
    const entries = await Promise.all(targets.map(async (id) => {
        const result = await HEALTH_CHECKS[id](ignoreCache);
        return [ id, { ...result, checkedAt: result.checkedAt ?? now } ];
    }));
    
    return Object.fromEntries(entries);
}
