import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import AccountantDashboard from './components/accountant/AccountantDashboard';
import RegisterCustomer from './components/accountant/RegisterCustomer';
import TransactionHistory from './components/accountant/TransactionHistory';
import AccountantLayout from './components/accountant/AccountantLayout';
import CustomerLayout from './components/customer/CustomerLayout';
import ViewCustomer from './components/accountant/ViewCustomer';
import ViewFeedback from './components/accountant/ViewFeedback';
import AdminLayout from './components/admin/AdminLayout';
import ViewUser from './components/admin/ViewUser';
import Login from './components/reusable/Login';
import CustomerDashboard from './components/customer/CustomerDashboard';
import SendRequest from './components/customer/SendRequest';
import SendFeedback from './components/customer/SendFeedback';
import ViewLogFile from './components/admin/ViewLogfiles';
import LoanCommitteeDashboard from './components/loan-commitee/LoanCommitteeDashboard';
import ViewLoanRequests from './components/loan-commitee/ViewLoanRequest';
import ManagerDashboard from './components/manager/ManagerDashboard';
import ManagerLayout from './components/manager/ManagerLayout';
import LoanCommiteeLayout from './components/loan-commitee/LoanCommiteeLayout';
import RecentTransaction from './components/accountant/TransactionHistory';
import ViewReport from './components/accountant/ViewReport';
import Dashboard from './components/admin/AdminDashboard';
import EmployeeManagement from './components/manager/EmplyeeManagement';
import MeetingManagement from './components/manager/MeetingManagement';
import ViewMeeting from './components/reusable/ViewMeeting';
import AddUser from './components/admin/AddUser';
import Transaction from './components/customer/TransactionHistory';
import Home from './components/Home';
import CompanyOverview from './components/CompanyOverview';
import ServicesPage from './components/Services';

// Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { role } = useAuthStore();
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  return allowedRoles.includes(role) ? element : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/add-user-admin" element={<AddUser />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<CompanyOverview />} />
        <Route path="/services" element={<ServicesPage />} />
        {/* Accountant Routes */}
        <Route element={<ProtectedRoute allowedRoles={['accountant']} element={<AccountantLayout />} />}>
          <Route path="/accountant" element={<AccountantDashboard />} />
          <Route path="/register-customer" element={<RegisterCustomer />} />
          <Route path="/transaction-history" element={<RecentTransaction />} />
          <Route path="/accountant/view-report" element={<ViewReport />} />
          <Route path="/accountant/view-customer" element={<ViewCustomer />} />
          <Route path="/view-meeting" element={<ViewMeeting />} />
          <Route path="/accountant/view-feedback" element={<ViewFeedback />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} element={<AdminLayout />} />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/view-log" element={<ViewLogFile />} />
          <Route path="/admin/view-feedback" element={<ViewFeedback />} />
          <Route path="/admin/view-meeting" element={<ViewMeeting />} />
          <Route path="/admin/view-user" element={<ViewUser />} />
        </Route>

        {/* Customer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} element={<CustomerLayout />} />}>
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/customer/send-request" element={<SendRequest />} />
          <Route path="/customer/view-meeting" element={<ViewMeeting />} />
          <Route path="/customer/send-feedback" element={<SendFeedback />} />
          <Route path="/customer/my-transactions" element={<Transaction />} />
        </Route>

        {/* Loan Committee Routes */}
        <Route element={<ProtectedRoute allowedRoles={['loan-committee']} element={<LoanCommiteeLayout />} />}>
          <Route path="/loan-committee" element={<LoanCommitteeDashboard />} />
          <Route path="/loan-committee/view-meeting" element={<ViewMeeting />} />
          <Route path="/loan-committee/view-loan-request" element={<ViewLoanRequests />} />
          <Route path="/loan-committee/view-feedback" element={<ViewFeedback />} />
          <Route path="/loan-committee/view-transactions" element={<RecentTransaction />} />

        </Route>

        {/* Manager Routes */}
        <Route element={<ProtectedRoute allowedRoles={['manager']} element={<ManagerLayout />} />}>
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/view-employee" element={<EmployeeManagement />} />
          <Route path="/manager/view-meeting" element={<MeetingManagement />} />
          <Route path="/manager/view-report" element={<ViewReport />} />
          <Route path="/manager/view-feedback" element={<ViewFeedback />} />
          <Route path="/manager/view-customers" element={<ViewCustomer />} />
          <Route path="/manager/view-transactions" element={<TransactionHistory />} />
        </Route>
      </Routes>

    </Router>
  );
}

export default App;
