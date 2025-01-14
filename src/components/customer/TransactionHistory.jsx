import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, Printer } from "lucide-react"; // Assuming you are using lucide icons
import useAuthStore from "@/store/authStore";
import useCustomerStore from "@/store/useCustomerStore";
import useTransactionStore from "@/store/useTransactionStore";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';

export default function Transaction() {
    const [selectedReceipt, setSelectedReceipt] = useState(null); // To track the selected receipt
    const [processedAction, setProcessedAction] = useState(null); // To track approval/rejection
    const [notes, setNotes] = useState(""); // To display any notes
    // const token = useAuthStore((state) => state.token);
    const LIMIT = 5;
    const { customers, fetchCustomers } = useCustomerStore();
    const [customerName, setCustomerName] = useState(null);
    const { transactions, fetchTransactions, loading, error } = useTransactionStore();
    const { user, token } = useAuthStore();

    // Filter state
    const [filters, setFilters] = useState({
        transaction_type: 'all', // Match backend naming
        status: 'all',
        amount_min: '',
        search: '',
        user_id: user.id,
        amount_max: '',
        page: 1, // Pagination
        perPage: 5,
    });

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
        }
    }, [token, filters, fetchTransactions]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
            user_id: user.id,
            page: 1, // Reset to the first page when filters change
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

    useEffect(() => {
        if (selectedReceipt?.user_id) {
            if (customers.length === 0) {
                fetchCustomers();
            } else {
                const customer = customers.find((customer) => customer.user_id === selectedReceipt.user_id);
                if (customer) {
                    setCustomerName(`${customer.fname} ${customer.lname}`);
                }
            }
        }
    }, [selectedReceipt, customers, fetchCustomers]);

    const handleDialogOpen = (transaction) => {
        setSelectedReceipt(transaction);
        setProcessedAction(transaction.status === "approved" ? "approve" : "reject");
        setNotes(transaction.notes || "");
    };

    const handleDialogClose = () => {
        setSelectedReceipt(null); // Close the dialog
    };

    const handlePrint = () => {
        window.print(); // Print the receipt
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <>
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Receipt</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{transaction.transaction_type}</TableCell>
                                        <TableCell
                                            className={
                                                transaction.amount < 0
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }
                                        >
                                            ${Math.abs(transaction.amount)}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(transaction.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell>{transaction.status}</TableCell>
                                        <TableCell>
                                            {transaction.status === "approved" ? (
                                                <Button
                                                    onClick={() => handleDialogOpen(transaction)} // Open dialog when clicked
                                                >
                                                    View Receipt
                                                </Button>
                                            ) : (
                                                <span className="text-gray-500">No Receipt</span>
                                            )}
                                        </TableCell>
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
                    </>
                </CardContent >

            </Card >

            {/* Transaction Receipt Dialog */}
            {
                selectedReceipt && (
                    <Dialog open={!!selectedReceipt} onClose={handleDialogClose}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Transaction Receipt</DialogTitle>
                                <DialogDescription>
                                    Transaction has been{" "}
                                    {processedAction === "approve" ? "approved" : "rejected"}. You can print this
                                    receipt for your records.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="font-semibold">Transaction ID:</span>
                                    <span>{selectedReceipt.id}</span>
                                    <span className="font-semibold">Customer :</span>
                                    <span>{customerName || "Loading..."}</span>
                                    <span className="font-semibold">Type:</span>
                                    <span>{selectedReceipt.transaction_type}</span>
                                    <span className="font-semibold">Amount:</span>
                                    <span
                                        className={selectedReceipt.amount < 0 ? "text-red-500" : "text-green-500"}
                                    >
                                        ${Math.abs(selectedReceipt.amount).toFixed(2)}
                                    </span>
                                    <span className="font-semibold">Date:</span>
                                    <span>
                                        {new Date(selectedReceipt.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    <span className="font-semibold">Status:</span>
                                    <span
                                        className={
                                            processedAction === "approve" ? "text-green-500" : "text-red-500"
                                        }
                                    >
                                        {processedAction === "approve" ? "Approved" : "Rejected"}
                                    </span>
                                </div>
                                {notes && (
                                    <div>
                                        <span className="font-semibold">Notes:</span>
                                        <p className="mt-1 text-sm">{notes}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <Button variant="outline" onClick={handleDialogClose}>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Transactions
                                </Button>
                                <Button onClick={handlePrint}>
                                    <Printer className="mr-2 h-4 w-4" /> Print Receipt
                                </Button>
                            </div>
                        </DialogContent >
                    </Dialog>
                )
            }
        </>
    );
}
