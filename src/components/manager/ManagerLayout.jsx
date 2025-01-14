import { Header } from '../reusable/Header';
import { Outlet } from 'react-router-dom';
import ManagerSidebar from './ManagerSidbar';

export default function ManagerLayout() {
    return (
        <div className="flex h-screen bg-gray-100">
            <ManagerSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header title="AA-SCAE" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
