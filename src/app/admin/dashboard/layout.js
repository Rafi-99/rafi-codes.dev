import { logoutAction } from '@app/admin/actions';
import AdminWheel from '@components/admin/AdminWheel';

export default function AdminDashboardLayout({ children }) {
    return (
        <>
            {children}
            <AdminWheel logoutAction={logoutAction} />
        </>
    );
}
