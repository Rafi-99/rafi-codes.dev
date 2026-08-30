import 'server-only';
import { getAdminCollection } from '@utils/admin/Auth';

const DEFAULT_TASKS = [
    {
        id: 'rafi-codes',
        name: 'rafi-codes.dev',
        accent: '#5EEAD4',
        task_items: [],
    },
    {
        id: 'memes',
        name: 'memes.rafi-codes.dev',
        accent: '#F472B6',
        task_items: [],
    },
    {
        id: 'portal',
        name: 'portal.rafi-codes.dev',
        accent: '#FBBF24',
        task_items: [],
    },
];

export async function getTaskBoard() {
    const adminDashboard = await getAdminCollection();
    const taskBoardDocument = await adminDashboard.findOne({ _id: 'task_board', type: 'tickets' });

    if (taskBoardDocument?.tasks) {
        return {
            tasks: taskBoardDocument.tasks,
            updatedAt: taskBoardDocument.updatedAt ?? null
        };
    }

    const updatedAt = new Date();
    await adminDashboard.updateOne({ _id: 'task_board' }, { $set: { type: 'tickets', tasks: DEFAULT_TASKS, updatedAt } }, { upsert: true });

    return {
        tasks: DEFAULT_TASKS,
        updatedAt
    };
}

export async function saveTaskBoard(tasks) {
    const adminDashboard = await getAdminCollection();
    const updatedAt = new Date();
    await adminDashboard.updateOne({ _id: 'task_board' }, { $set: { type: 'tickets', tasks, updatedAt } }, { upsert: true });

    return updatedAt;
}
