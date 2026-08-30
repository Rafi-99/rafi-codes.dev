import 'server-only';
import { NextResponse } from 'next/server';
import { rejectIfUnauthorized } from '@utils/admin/Auth';
import { getAdminStats } from '@utils/admin/Stats';

export async function GET(request) {
    const unauthorized = await rejectIfUnauthorized(request);

    if (unauthorized) {
        return unauthorized;
    }
    
    const stats = await getAdminStats();
    return NextResponse.json(stats);
}
