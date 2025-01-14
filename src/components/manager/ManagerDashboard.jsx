import { useEffect, useState } from "react";
import { Users, CreditCard, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useAuthStore from "@/store/authStore";
import useTransactionStore from "@/store/useTransactionStore";
import useCustomerStore from "@/store/useCustomerStore";
import MeetingCard from "../reusable/UpcomingMeetingCard";
import DepositsWithdrawalsGraph from "../accountant/DepositeWithdrawLIne";
import LoanGraph from "./LoanGraph";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export default function ManagerDashboard() {
  const { customers, fetchCustomers, loading: customerLoading, error: customerError } = useCustomerStore();
  const { transactions, processTransaction, fetchTransactions, loading, error } = useTransactionStore();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    if (token) {
      fetchTransactions(token);
      fetchCustomers(token);
    }
  }, [token, fetchTransactions, fetchCustomers]);

  const handleViewTransactions = (userId) => {
    setSelectedUserId(userId);
    // Show the transaction history dialog
    setShowTransactionHistory(true);
  };

  const loanTransactions = transactions.filter((transaction) => transaction.transaction_type === "loan");

  // Utility function to calculate the loan duration in months
  const calculateLoanDurationInMonths = (createdAt) => {
    const loanCreatedDate = new Date(createdAt);
    const currentDate = new Date();

    const yearsDifference = currentDate.getFullYear() - loanCreatedDate.getFullYear();
    const monthsDifference = currentDate.getMonth() - loanCreatedDate.getMonth();

    return yearsDifference * 12 + monthsDifference;
  };

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card onClick={() => navigate('view-customers')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {customerLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="text-2xl font-bold">{customers.length}</div>
                <p className="text-xs text-muted-foreground">
                  +{customers.filter((customer) => customer.isNew).length} this month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card onClick={() => navigate('view-transactions')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {loanTransactions.filter((loan) => loan.status === "approved").length}
                </div>
                <p className="text-xs text-muted-foreground">Approved loans</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card onClick={() => navigate('view-transactions')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {transactions.filter((transaction) => transaction.transaction_type === "withdrawal" && transaction.status === "pending").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  $ {transactions
                    .filter((transaction) => transaction.transaction_type === "withdrawal" && transaction.status === "pending")
                    .reduce((total, transaction) => total + transaction.amount, 0)
                    .toLocaleString()}{" "}
                  total
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <MeetingCard />
      </div>
      {/* Loan Management */}
      <DepositsWithdrawalsGraph transactions={transactions} />
      <LoanGraph transactions={transactions} />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loan Management</CardTitle>
          <CardDescription>Review and manage loan requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading transactions...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : loanTransactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanTransactions.map((loan) => {
                  const customer = customers.find((c) => c.user_id === loan.user_id);

                  return (
                    <TableRow key={loan.id}>
                      <TableCell>{customer ? customer.name : "Unknown"}</TableCell>
                      <TableCell>{new Date(loan.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>${loan.amount.toLocaleString()}</TableCell>
                      <TableCell>{loan.status}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedLoan({ loan, customer })}
                            >
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Review Loan Request</DialogTitle>
                            </DialogHeader>
                            {selectedLoan?.customer ? (
                              <div className="space-y-4">
                                <p>
                                  <strong>Customer Name:</strong>{" "}
                                  {selectedLoan.customer.name}
                                </p>
                                <p>
                                  <strong>Salary:</strong> ${selectedLoan.customer.salary.toLocaleString()}
                                </p>
                                <p>
                                  <strong>Saving Balance:</strong>{" "}
                                  ${selectedLoan.customer.saving_balance.toLocaleString()}
                                </p>
                                <p>
                                  <strong>Government Bureau:</strong>{" "}
                                  {selectedLoan.customer.gov_bureau}
                                </p>
                                <p>
                                  <strong>Duration:</strong> {calculateLoanDurationInMonths(selectedLoan.customer.created_at)} months
                                </p>
                                <p>
                                  <strong>Request Date:</strong>{" "}
                                  {new Date(selectedLoan.loan.created_at).toLocaleDateString()}
                                </p>

                                {/* View Transaction History Button */}
                                <Button
                                  variant="link"
                                  onClick={() => handleViewTransactions(selectedLoan.customer.user_id)}
                                >
                                  View Transaction History
                                </Button>
                              </div>
                            ) : (
                              <p className="text-red-500">Customer data not available</p>
                            )}
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={async () => {
                                  try {
                                    await processTransaction(selectedLoan.loan.id, "recommend-rejection ");
                                  } catch (error) {
                                    console.error(error.message);
                                  }
                                }}
                              >
                                Recommend Rejection
                              </Button>
                              <Button
                                onClick={async () => {
                                  try {
                                    await processTransaction(selectedLoan.loan.id, "recommend-approval", token);
                                  } catch (error) {
                                    console.error(error.message);
                                  }
                                }}
                              >
                                Recommend Approval
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p>No loan transactions available</p>
          )}
        </CardContent>
      </Card>

      {/* Transaction History Modal */}
      <Dialog open={showTransactionHistory} onOpenChange={setShowTransactionHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {selectedUserId ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions
                    .filter((transaction) => transaction.user_id === selectedUserId)
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                        <TableCell>{transaction.transaction_type}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <p>No transactions available.</p>
            )}
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransactionHistory(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
