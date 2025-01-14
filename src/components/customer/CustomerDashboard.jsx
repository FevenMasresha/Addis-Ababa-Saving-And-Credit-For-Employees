import { DollarSign, CreditCard, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';
import MeetingCard from '../reusable/UpcomingMeetingCard';
import useTransactionStore from '@/store/useTransactionStore';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { Button } from '../ui/button';

export default function CustomerDashboard() {
  // const [transactions, setTransactions] = useState([]);
  const { user, token, setBalances, savingBalance, loanBalance } = useAuthStore((state) => state);
  const LIMIT = 5; // Number of transactions to display initially
  const [showAll, setShowAll] = useState(false);
  const { transactions, fetchTransactions, loading, error } = useTransactionStore();

  // Filter state
  const [filters, setFilters] = useState({
    transaction_type: 'all', // Match backend naming
    status: 'all',
    user_id: user.id || '',
    amount_min: '',
    search: '',
    amount_max: '',
    page: 1, // Pagination
    perPage: 5,
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/customerdata', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch customer data');
        }

        const customerData = await response.json();
        setBalances(customerData.saving_balance, customerData.loan_balance);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCustomerData();
  }, [token, setBalances]);

  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     if (!token) {
  //       setError('User not authenticated');
  //       // setLoading(false);
  //       return;
  //     }

  //     try {
  //       const response = await fetch('http://localhost:8000/api/transactions', {
  //         method: 'GET',
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch transactions');
  //       }

  //       const data = await response.json();
  //       setTransactions(data);
  //     } catch (error) {
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTransactions();
  // }, [token]);

  // Determine which transactions to display

  useEffect(() => {
    if (token) {
      const activeFilters = { ...filters };

      // Remove filters with empty or default values before sending the request
      Object.keys(activeFilters).forEach((key) => {
        if (!activeFilters[key] || activeFilters[key] === 'all') {
          delete activeFilters[key];
        }
      });

      fetchTransactions(activeFilters);
      console.log(user.id || 'hi');

    }
  }, [token, filters, fetchTransactions]);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
      page: 1,
      user_id: user.id
    }));
  };

  // Handle select dropdown changes
  const handleSelectChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
      page: 1, // Reset to the first page when filters change
    }));
  };

  // Handle pagination (next/prev)
  const handlePageChange = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: prev.page + direction,
    }));
  };


  const pendingTransactionsCount = transactions.filter(
    (transaction) => transaction.status === 'pending'
  ).length;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${savingBalance}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loan Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${loanBalance}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTransactionsCount}</div>
          </CardContent>
        </Card>
        <MeetingCard />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters Section */}
          <div className="space-y-4 mb-4">
            <div className="flex space-x-4">
              {/* Transaction Type Filter */}
              <Select
                value={filters.transaction_type}
                onValueChange={(value) => handleSelectChange('transaction_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="loan">Loan Application</SelectItem>
                  <SelectItem value="loan repayment">Loan Repayment</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={filters.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Amount Range Filters */}
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="amount_min"
                  placeholder="Min Amount"
                  value={filters.amount_min}
                  onChange={handleFilterChange}
                  className="input input-sm"
                />
                <input
                  type="number"
                  name="amount_max"
                  placeholder="Max Amount"
                  value={filters.amount_max}
                  onChange={handleFilterChange}
                  className="input input-sm"
                />
              </div>
            </div>

            {/* Search Field */}
            <div className="flex space-x-4">
              <input
                type="text"
                name="search"
                placeholder="Search key word"
                value={filters.search}
                onChange={handleFilterChange}
                className="input input-sm w-1/3"
              />
            </div>
          </div>
          {/* Table Section */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Id</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.user_id}</TableCell>
                  <TableCell>{transaction.transaction_type}</TableCell>
                  <TableCell
                    className={
                      transaction.amount < 0 ? 'text-red-500' : 'text-green-500'
                    }
                  >
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
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Section */}
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => handlePageChange(-1)}
              disabled={filters.page === 1}
              className="bg-transparent text-blue-600 hover:bg-transparent hover:text-blue-800"
            >
              Previous
            </Button>
            <Button
              onClick={() => handlePageChange(1)}
              disabled={transactions.length < filters.perPage}
              className="bg-transparent text-blue-600 hover:bg-transparent hover:text-blue-800"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
