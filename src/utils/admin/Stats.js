import 'server-only';
import { getAdminCollection, SESSIONS_DOC_ID } from '@utils/admin/Auth';
import { getTaskBoard } from '@utils/admin/TaskBoardService';

export async function getAdminStats() {
    const adminDashboard = await getAdminCollection();
    const [ sessions, { tasks } ] = await Promise.all([adminDashboard.findOne({ _id: SESSIONS_DOC_ID }), getTaskBoard()]);

    const now = new Date();
    const activeSessions = (sessions?.items ?? []).filter((session) => session.expiresAt > now).length;
    const totalItems = tasks.reduce((sum, task) => sum + (task.task_items?.length ?? 0), 0);
    const openItems = tasks.reduce((sum, task) => sum + (task.task_items?.filter((item) => !item.done).length ?? 0), 0);

    return {
        activeSessions,
        projectCount: tasks.length,
        openTickets: openItems,
        totalTickets: totalItems
    };
}
