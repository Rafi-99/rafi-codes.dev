import 'server-only';
import { NextResponse } from 'next/server';
import { rejectIfUnauthorized } from '@utils/admin/Auth';
import { runHealthChecks } from '@utils/admin/Health';

export async function GET(request) {
    const unauthorized = await rejectIfUnauthorized(request);

    if (unauthorized) {
        return unauthorized;
    }

    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    const ids = idsParam ? idsParam.split(',') : null;
    const ignoreCache = searchParams.get('ignoreCache') === 'true';

    const results = await runHealthChecks(ids, ignoreCache);

    return NextResponse.json(results);
}
