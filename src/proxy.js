import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@utils/admin/Auth';

export function proxy(request) {
    if (!request.cookies.get(SESSION_COOKIE)?.value) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/dashboard/:path*']
};
