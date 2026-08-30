import { redirectIfUnauthenticated } from '@utils/admin/Auth';
import { getTaskBoard } from '@utils/admin/TaskBoardService';
import TaskBoard from '@components/admin/TaskBoard';
import styles from '@styles/page/admin-tickets.module.css';

export const metadata = {
    title: 'Task Board',
    robots: { index: false, follow: false }
};

export default async function AdminTaskBoard() {
    await redirectIfUnauthenticated();

    const { tasks, updatedAt } = await getTaskBoard();

    return (
        <div className={`page-flex ${styles.wrapper}`}>
            <TaskBoard initialTasks={tasks} initialUpdatedAt={updatedAt} />
        </div>
    );
}
