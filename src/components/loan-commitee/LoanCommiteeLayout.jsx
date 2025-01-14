import { Header } from '../reusable/Header';
import { Outlet } from 'react-router-dom';
import LoanCommiteeSidebar from './LoanCommiteeSidebar';

export default function LoanCommiteeLayout() {
    return (
        <div className="flex h-screen bg-gray-100">
            <LoanCommiteeSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header title="AA-SCAE Loan Committee Dashboard" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
