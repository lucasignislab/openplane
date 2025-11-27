import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import GlobalIssueModal from '@/components/GlobalIssueModal';

const AppLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-[#151516]">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto bg-[#151516] relative text-[#E0E1EC]">
                <div className="min-h-screen">
                    <Outlet />
                </div>
            </main>
            <GlobalIssueModal />
        </div>
    );
};

export default AppLayout;
