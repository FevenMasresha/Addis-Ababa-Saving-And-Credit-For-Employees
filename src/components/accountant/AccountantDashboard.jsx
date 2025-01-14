import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, ArrowUpFromLine, DollarSign, FileText } from 'lucide-react';
import useTransactionStore from '@/store/useTransactionStore';
import useAuthStore from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import ProcessTransactionDialog from './ProcessTransactionDialog';
import DepositsWithdrawalsGraph from './DepositeWithdrawLIne';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function AccountantDashboard() {
  const { transactions, fetchTransactions, loading, error } = useTransactionStore();
  const { token } = useAuthStore();
  const [showAll, setShowAll] = useState(false);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [totalLoanRepayments, setTotalLoanRepayments] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(null);
  const [previousDayPendingCount, setPreviousDayPendingCount] = useState(0);
  const navigate = useNavigate();

  const LIMIT = 5;
  const successToast = (message) => toast.success(message);
  const errorToast = (message) => toast.error(message);

  const pendingTransactions = (transactions || []).filter(
    (transaction) => transaction.status === 'pending' && transaction.transaction_type !== 'loan'
  );
  const displayedTransactions = showAll ? pendingTransactions : pendingTransactions.slice(0, LIMIT);

  useEffect(() => {
    if (token) {
      fetchTransactions(token); // Fetch transactions when token is available
    }
  }, [token, fetchTransactions]);

  useEffect(() => {
    if (transactions.length > 0) {
      const totalDeposits = transactions
        .filter((transaction) => transaction.transaction_type === 'deposit' && transaction.status === 'approved')
        .reduce((total, transaction) => total + Number(transaction.amount), 0);
      setTotalDeposits(totalDeposits);

      const totalWithdrawals = transactions
        .filter((transaction) => transaction.transaction_type === 'withdrawal' && transaction.status === 'approved')
        .reduce((total, transaction) => total + Number(transaction.amount), 0);
      setTotalWithdrawals(totalWithdrawals);

      const totalLoanRepayments = transactions
        .filter((transaction) => transaction.transaction_type === 'loan repayment' && transaction.status === 'approved')
        .reduce((total, transaction) => total + Number(transaction.amount), 0);
      setTotalLoanRepayments(totalLoanRepayments);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];

      const previousDayPending = transactions.filter(
        (transaction) => transaction.status === 'pending' && transaction.date === yesterdayString
      );
      setPreviousDayPendingCount(previousDayPending.length);
    }
  }, [transactions]);

  const pendingComparisonText =
    pendingTransactions.length > previousDayPendingCount
      ? `${pendingTransactions.length - previousDayPendingCount} more than yesterday`
      : `${previousDayPendingCount - pendingTransactions.length} fewer than yesterday`;

  const handleDialogOpen = (transactionId) => {
    setDialogOpen(transactionId);
  };

  const handleDialogClose = () => {
    setDialogOpen(null);
  };

  const handleGoToPendingTransactions = () => {
    const section = document.getElementById('pending-transactions');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Total Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => navigate('/transaction-history')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDeposits}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => navigate('/transaction-history')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalWithdrawals}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => navigate('/transaction-history')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loan Repayments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalLoanRepayments}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition" onClick={handleGoToPendingTransactions}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTransactions.length}</div>
            <p className="text-xs text-muted-foreground">{pendingComparisonText}</p>
          </CardContent>
        </Card>
      </div>
      <DepositsWithdrawalsGraph transactions={transactions} />
      {/* Transactions Table */}
      <Card id="pending-transactions">
        <CardHeader>
          <CardTitle>Pending Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Id</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.user_id}</TableCell>
                  <TableCell>{transaction.transaction_type}</TableCell>
                  <TableCell className={transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}>
                    ${Math.abs(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{transaction.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDialogOpen(transaction.id)} disabled={loading}>
                      {loading ? 'Processing...' : 'Process'}
                    </Button>
                    {dialogOpen === transaction.id && (
                      <ProcessTransactionDialog
                        key={transaction.id}
                        isOpen={dialogOpen === transaction.id}
                        onClose={handleDialogClose}
                        transaction={transaction}
                        token={token}
                        onSuccess={() => successToast('Transaction processed successfully!')}
                        onError={() => errorToast('There was an error processing the transaction.')}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
