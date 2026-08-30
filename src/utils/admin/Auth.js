import 'server-only';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { argon2id, argon2Verify } from 'hash-wasm';
import { getCollection } from '@utils/shared/DatabaseService';

export const SESSION_COOKIE = 'admin_session';
const SESSION_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
};

const DB_NAME = 'app';
const ADMIN_COLLECTION = 'admin_dashboard';
const PASSWORD_DOC_ID = 'password';
export const SESSIONS_DOC_ID = 'sessions';
const RESET_TOKENS_DOC_ID = 'resetTokens';
const RATE_LIMITS_DOC_ID = 'rateLimits';

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const RESET_TOKEN_TTL_MS = 1000 * 60 * 15; // 15 minutes

const RATE_LIMIT_CONFIG = {
    login: { windowMs: 15 * 60 * 1000, maxAttempts: 10 },
    'change-password': { windowMs: 15 * 60 * 1000, maxAttempts: 10 },
    'forgot-password': { windowMs: 15 * 60 * 1000, maxAttempts: 5 }
};

const DEFAULT_RATE_LIMIT = { windowMs: 15 * 60 * 1000, maxAttempts: 5 };

const ARGON2_PARAMS = {
    parallelism: 5,
    iterations: 3,
    memorySize: 65536,
    hashLength: 32,
    outputType: 'encoded'
};

function getSecret() {
    const secret = process.env.SESSION_SECRET;

    if (!secret) {
        throw new Error('SESSION_SECRET is not set');
    }

    return secret;
}

function sign(payload) {
    return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
}

function packToken(id) {
    return `${id}.${sign(id)}`;
}

function unpackToken(token) {
    if (!token) {
        return null;
    }

    const [ id, sig ] = token.split('.');

    if (!id || !sig) {
        return null;
    }

    const expected = sign(id);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);

    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return null;
    }

    return id;
}

export async function getAdminCollection() {
    return getCollection(DB_NAME, ADMIN_COLLECTION);
}

async function pruneExpired(docId) {
    const admin = await getAdminCollection();
    await admin.updateOne({ _id: docId }, { $pull: { items: { expiresAt: { $lte: new Date() } } } });
}

export async function createSessionToken() {
    const id = crypto.randomBytes(24).toString('hex');
    const admin = await getAdminCollection();
    const now = new Date();

    await pruneExpired(SESSIONS_DOC_ID);
    await admin.updateOne(
        { _id: SESSIONS_DOC_ID },
        {
            $set: { type: 'sessions' },
            $push: { items: { id, createdAt: now, expiresAt: new Date(now.getTime() + SESSION_TTL_MS) } }
        },
        { upsert: true }
    );

    return packToken(id);
}

export async function verifySessionToken(token) {
    const id = unpackToken(token);

    if (!id) {
        return false;
    }

    const admin = await getAdminCollection();
    const doc = await admin.findOne({ _id: SESSIONS_DOC_ID, items: { $elemMatch: { id, expiresAt: { $gt: new Date() } } } });

    return !!doc;
}

export async function revokeSession(token) {
    const id = unpackToken(token);

    if (!id) {
        return;
    }

    const admin = await getAdminCollection();
    await admin.updateOne({ _id: SESSIONS_DOC_ID }, { $pull: { items: { id } } });
}

/**
 * sameSite is the one option that legitimately differs per caller: 'lax'
 * for the Google OAuth callback (the cookie has to survive a cross-site
 * redirect from accounts.google.com), 'strict' everywhere else.
 */
export async function setSessionCookie(response, sameSite = 'strict') {
    response.cookies.set(SESSION_COOKIE, await createSessionToken(), { ...SESSION_COOKIE_OPTIONS, sameSite });
    return response;
}

/**
 * proxy.js already fast-fails obviously unauthenticated requests at the
 * edge before they ever reach here — this is the authoritative,
 * Mongo-backed check that always runs regardless, since proxy.js only
 * ever checks cookie presence, not validity.
 */
export async function redirectIfUnauthenticated() {
    const cookieStore = await cookies();

    if (!(await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value))) {
        redirect('/admin');
    }
}

export async function rejectIfUnauthorized(request) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!(await verifySessionToken(token))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return null;
}

export async function getPasswordHash() {
    const admin = await getAdminCollection();
    const doc = await admin.findOne({ _id: PASSWORD_DOC_ID, type: 'settings' });

    return doc?.hash ?? process.env.ADMIN_PASSWORD_HASH ?? null;
}

export async function setPasswordHash(hash) {
    const admin = await getAdminCollection();
    await admin.updateOne({ _id: PASSWORD_DOC_ID }, { $set: { type: 'settings', hash } }, { upsert: true });
}

export async function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    return argon2id({ password, salt, ...ARGON2_PARAMS });
}

export async function verifyPassword(hash, password) {
    try {
        return await argon2Verify({ password, hash });
    }
    catch {
        return false;
    }
}

export function isValidPassword(newPassword, confirmNewPassword) {
    return typeof newPassword === 'string' && newPassword.length >= 12 && newPassword === confirmNewPassword;
}

function hashResetToken(rawToken) {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export async function createResetToken() {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const admin = await getAdminCollection();

    await pruneExpired(RESET_TOKENS_DOC_ID);
    await admin.updateOne(
        { _id: RESET_TOKENS_DOC_ID },
        { $set: { type: 'resetTokens' }, $push: { items: { hash: hashResetToken(rawToken), expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) } } },
        { upsert: true }
    );

    return rawToken;
}

export async function verifyResetToken(rawToken) {
    if (typeof rawToken !== 'string' || !rawToken) {
        return false;
    }

    const admin = await getAdminCollection();
    const hash = hashResetToken(rawToken);
    const doc = await admin.findOne({ _id: RESET_TOKENS_DOC_ID, items: { $elemMatch: { hash, expiresAt: { $gt: new Date() } } } });

    return !!doc;
}

export async function consumeResetToken(rawToken) {
    const admin = await getAdminCollection();
    await admin.updateOne({ _id: RESET_TOKENS_DOC_ID }, { $pull: { items: { hash: hashResetToken(rawToken) } } });
}

export async function invalidateAllCredentials() {
    const admin = await getAdminCollection();
    await Promise.all([ admin.updateOne({ _id: SESSIONS_DOC_ID }, { $set: { type: 'sessions', items: [] } }, { upsert: true }), admin.updateOne({ _id: RESET_TOKENS_DOC_ID }, { $set: { type: 'resetTokens', items: [] } }, { upsert: true }) ]);
}

export function safeEqual(a, b) {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);

    if (bufA.length !== bufB.length) {
        return false;
    }

    return crypto.timingSafeEqual(bufA, bufB);
}

export function getClientIp(request) {
    const forwarded = request.headers.get('x-forwarded-for');

    if (!forwarded) {
        return 'local';
    }

    const first = forwarded.split(',')[0].trim();

    return first.replace(/^::ffff:/, '');
}

function rateLimitConfig(bucket) {
    return RATE_LIMIT_CONFIG[bucket] ?? DEFAULT_RATE_LIMIT;
}

export async function isRateLimited(bucket, ip) {
    const { maxAttempts } = rateLimitConfig(bucket);
    const admin = await getAdminCollection();
    const id = `${bucket}:${ip}`;
    const doc = await admin.findOne({ _id: RATE_LIMITS_DOC_ID, items: { $elemMatch: { id, expiresAt: { $gt: new Date() }, count: { $gte: maxAttempts } } } });

    return !!doc;
}

export async function recordFailedAttempt(bucket, ip) {
    const { windowMs } = rateLimitConfig(bucket);
    const admin = await getAdminCollection();
    const id = `${bucket}:${ip}`;
    const now = new Date();

    await pruneExpired(RATE_LIMITS_DOC_ID);

    const incremented = await admin.updateOne({ _id: RATE_LIMITS_DOC_ID, 'items.id': id }, { $inc: { 'items.$.count': 1 } });

    if (incremented.matchedCount === 0) {
        await admin.updateOne(
            { _id: RATE_LIMITS_DOC_ID },
            { $set: { type: 'rateLimits' }, $push: { items: { id, count: 1, expiresAt: new Date(now.getTime() + windowMs) } } },
            { upsert: true }
        );
    }
}

export async function clearRateLimit(bucket, ip) {
    const admin = await getAdminCollection();
    const id = `${bucket}:${ip}`;
    await admin.updateOne({ _id: RATE_LIMITS_DOC_ID }, { $pull: { items: { id } } });
}
