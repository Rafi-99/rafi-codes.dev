import 'server-only';
import { NextResponse } from 'next/server';
import { rejectIfUnauthorized } from '@utils/admin/Auth';
import { saveTaskBoard } from '@utils/admin/TaskBoardService';

export async function POST(request) {
    const unauthorized = await rejectIfUnauthorized(request);

    if (unauthorized) {
        return unauthorized;
    }

    const tasks = await request.json();
    const updatedAt = await saveTaskBoard(tasks);
    return NextResponse.json({ ok: true, updatedAt });
}
