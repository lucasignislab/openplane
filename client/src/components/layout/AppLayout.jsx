import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import GlobalIssueModal from '@/components/GlobalIssueModal';

const AppLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto bg-slate-50 relative text-slate-900">
                <div className="min-h-screen">
                    <Outlet />
                </div>
            </main>
            <GlobalIssueModal />
        </div>
    );
};

export default AppLayout;
