"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { FileText, CheckCircle, XCircle, DollarSign } from "lucide-react";
import LoanReviewDialog from "./LoanReviewDialog";
import useTransactionStore from "@/store/useTransactionStore";
import useCustomerStore from "@/store/useCustomerStore";
import useAuthStore from "@/store/authStore";
import LoanGraph from "../manager/LoanGraph";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoanRequestDashboard() {
  const [loanRequests, setLoanRequests] = useState([]);
  const { customers, fetchCustomers } = useCustomerStore();
  const { transactions, fetchTransactions, processTransaction, loading, error } = useTransactionStore();
  const token = useAuthStore((state) => state.token);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const sucess_toast = (message) => toast.success(message)
  const error_toast = (message) => toast.error(message)
  const navigate = useNavigate();
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

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



  const getCustomerName = (userId) => {
    const customer = customers.find((customer) => customer.user_id === userId);
    return customer ? `${customer.fname} ${customer.lname}` : "Unknown Customer";
  };
  //get customer fname and lname
  useEffect(() => {
    if (transactions) {

      const enrichedRequests = loanTransactions.map((request) => {
        const customer = customers.find(
          (c) => c.user_id === request.user_id
        );
        return {
          ...request,
          applicant: customer
            ? `${customer.fname} ${customer.lname}`
            : "Unknown",
        };
      });
      setLoanRequests(enrichedRequests);
    }
  }, [transactions, customers]);

  const pendingLoanRequests = loanTransactions.filter(
    (req) => req.status !== "approved" && req.status !== "rejected"
  );

  const prevMonthAmount = loanTransactions.reduce((sum, request) => {
    const requestDate = new Date(request.created_at);
    const prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    if (
      requestDate.getMonth() === prevMonth.getMonth() &&
      requestDate.getFullYear() === prevMonth.getFullYear()
    ) {
      sum += request.amount;
    }
    return sum;
  }, 0);

  // Helper functions for cards
  const approvedLoans = loanTransactions.filter(
    (req) => req.status === "approved"
  ).length;
  const rejectedLoans = loanTransactions.filter(
    (req) => req.status === "rejected"
  ).length;

  const totalLoanAmount = loanTransactions
    .filter((req) => req.status === "approved" && req.amount < 0)
    .reduce((sum, req) => sum - req.amount, 0);

  return (
    <div className="space-y-4">
      {/* Dashboard Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Loan Requests */}
        <Card onClick={() => navigate('view-transactions')}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Loan Requests</CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loanTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              {loanTransactions.length > 0
                ? `+${loanTransactions.filter(
                  (req) =>
                    new Date(req.created_at) >=
                    new Date(new Date().setDate(new Date().getDate() - 7))
                ).length} new this week`
                : "No new requests"}
            </p>
          </CardContent>
        </Card>

        {/* Approved Loans */}
        <Card onClick={() => navigate('view-transactions')}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Approved Loans</CardTitle>
            <CheckCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedLoans}</div>
            <p className="text-xs text-muted-foreground">
              {approvedLoans > 0
                ? `+${approvedLoans} approved`
                : "No approved loans yet"}
            </p>
          </CardContent>
        </Card>

        {/* Rejected Loans */}
        <Card onClick={() => navigate('view-transactions')}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rejected Loans</CardTitle>
            <XCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedLoans}</div>
            <p className="text-xs text-muted-foreground">
              {rejectedLoans > 0
                ? `-${rejectedLoans} rejected`
                : "No rejected loans"}
            </p>
          </CardContent>
        </Card>

        {/* Total Loan Amount */}
        <Card onClick={() => navigate('view-transactions')}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Loan Amount</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalLoanAmount}
            </div>
            <p className="text-xs text-muted-foreground">
              {loanTransactions.length > 0 ? (
                prevMonthAmount > 0 ? (
                  `+${(
                    ((totalLoanAmount - prevMonthAmount) / prevMonthAmount) *
                    100
                  ).toFixed(2)}% from last month`
                ) : (
                  "No previous month data to calculate percentage"
                )
              ) : (
                "No loan amount data"
              )}
            </p>

          </CardContent>
        </Card>

      </div>
      <LoanGraph transactions={transactions} />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loan Management</CardTitle>
          <CardDescription>Review and manage loan requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loanTransactions.length > 0 ? (
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
                      <TableCell>{getCustomerName(loan.user_id)}</TableCell>
                      <TableCell>{new Date(loan.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>${loan.amount.toLocaleString()}</TableCell>
                      <TableCell>{loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              disabled={loan.status === "approved" || loan.status === "rejected"}
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
                                  <strong>Customer Name:</strong> {selectedLoan.customer.name}
                                </p>
                                <p>
                                  <strong>Salary:</strong> ${selectedLoan.customer.salary.toLocaleString()}
                                </p>
                                <p>
                                  <strong>Saving Balance:</strong> ${selectedLoan.customer.saving_balance.toLocaleString()}
                                </p>
                                <p>
                                  <strong>Government Bureau:</strong> {selectedLoan.customer.gov_bureau}
                                </p>
                                <p>
                                  <strong>Duration:</strong> {calculateLoanDurationInMonths(selectedLoan.customer.created_at)} months
                                </p>
                                <p>
                                  <strong>Request Date:</strong> {new Date(selectedLoan.loan.created_at).toLocaleDateString()}
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
                                    await processTransaction(selectedLoan.loan.id, "reject", token);
                                    sucess_toast("loan request rejected successfully");
                                  } catch (error) {
                                    console.error(error.message);
                                    error_toast("error processing request");
                                  }
                                }}
                              >
                                {loading ? "Rejecting" : "Reject"}
                              </Button>
                              <Button
                                onClick={async () => {
                                  try {
                                    await processTransaction(selectedLoan.loan.id, "approve", token);
                                    sucess_toast("loan request approved successfully");
                                  } catch (error) {
                                    error_toast("error processing request");
                                  }
                                }}
                              >
                                {loading ? "Approving" : "Approve"}
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
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Total pending loans: {loanTransactions.filter((loan) => loan.status === "pending").length}
          </p>
        </CardFooter>
      </Card>
      {/* Loan Requests Table */}
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
