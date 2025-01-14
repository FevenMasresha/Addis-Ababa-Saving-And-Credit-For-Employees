import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useTransactionStore from "@/store/useTransactionStore";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";

// Ensure Chart.js components are registered
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const ViewReport = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [chartData, setChartData] = useState(null);
    const { transactions, fetchTransactions, loading } = useTransactionStore();
    const { token } = useAuthStore();
    const [reportDateRange, setReportDateRange] = useState("");
    const [generatedReportData, setGeneratedReportData] = useState(null); // Store the generated report data

    const successToast = (message) => toast.success(message);
    const errorToast = (message) => toast.error(message);

    // Fetch the transactions and set the current month's data on initial load
    useEffect(() => {
        fetchTransactions(token);

        // Get the current month's start and end dates
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setStartDate(firstDayOfMonth);
        setEndDate(lastDayOfMonth);
    }, [fetchTransactions, token]);

    // Generate chart data based on transactions
    const generateChartData = (transactions, startDate, endDate) => {
        const deposits = transactions.filter(
            (txn) => txn.transaction_type === "deposit" && new Date(txn.created_at) >= startDate && new Date(txn.created_at) <= endDate
        );
        const withdrawals = transactions.filter(
            (txn) => txn.transaction_type === "withdrawal" && new Date(txn.created_at) >= startDate && new Date(txn.created_at) <= endDate
        );
        const loanApplications = transactions.filter(
            (txn) => txn.transaction_type === "loan" && new Date(txn.created_at) >= startDate && new Date(txn.created_at) <= endDate
        );
        const loanRepayments = transactions.filter(
            (txn) => txn.transaction_type === "loan repayment" && new Date(txn.created_at) >= startDate && new Date(txn.created_at) <= endDate
        );

        return {
            depositsWithdrawals: {
                labels: ["Deposits", "Withdrawals"],
                datasets: [
                    {
                        label: "Amount",
                        data: [
                            deposits.reduce((sum, txn) => sum + parseFloat(txn.amount), 0),
                            withdrawals.reduce((sum, txn) => sum + parseFloat(-txn.amount), 0),
                        ],
                        backgroundColor: ["#4caf50", "#f44336"], // Green, Red
                    },
                ],
            },
            loans: {
                labels: ["Loan Applications", "Loan Repayments"],
                datasets: [
                    {
                        label: "Count",
                        data: [loanApplications.length, loanRepayments.length],
                        backgroundColor: ["#ff9800", "#2196f3"], // Orange, Blue
                    },
                ],
            },
        };
    };

    // Set initial chart data (current month's data) on load
    useEffect(() => {
        if (transactions.length > 0 && startDate && endDate) {
            const initialData = generateChartData(transactions, startDate, endDate);
            setChartData(initialData);
            setReportDateRange(`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
        }
    }, [transactions, startDate, endDate]);

    // Handle report generation for custom date ranges
    const handleGenerateReport = () => {
        if (!startDate || !endDate) {
            errorToast("Please select both start and end dates.");
            return;
        }

        const newReportData = generateChartData(transactions, startDate, endDate);
        setGeneratedReportData(newReportData);
        successToast("Report generated successfully!");
        setReportDateRange(`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
        setIsModalOpen(false);
    };

    return (
        <Card className="mx-auto mt-10">
            <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Visualize key metrics with charts.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Button onClick={() => setIsModalOpen(true)}>Generate Report</Button>

                    {reportDateRange && (
                        <div className="text-center">
                            <p className="text-sm font-semibold text-gray-600">
                                Showing report for: <span className="text-blue-600">{reportDateRange}</span>
                            </p>
                        </div>
                    )}

                    {/* Show the default chart (current month's data) or the generated report */}
                    {(generatedReportData || chartData) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            {/* Deposits and Withdrawals */}
                            <Card className="flex flex-col items-center p-4">
                                <h2 className="text-lg font-bold">Deposits & Withdrawals</h2>
                                <Bar data={generatedReportData?.depositsWithdrawals || chartData.depositsWithdrawals} width={150} height={150} />
                            </Card>

                            {/* Loan Applications and Repayments */}
                            <Card className="flex flex-col items-center p-4">
                                <h2 className="text-lg font-bold">Loans</h2>
                                <Pie data={generatedReportData?.loans || chartData.loans} width={150} height={150} />
                            </Card>
                        </div>
                    ) : (
                        <div className="text-center mt-4">No transaction available</div>
                    )}
                </div>
            </CardContent>

            {/* Report Generation Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Generate Report</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Start Date</Label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                placeholderText="Select start date"
                                className="p-2 border rounded"
                            />
                        </div>
                        <div>
                            <Label>End Date</Label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                placeholderText="Select end date"
                                className="p-2 border rounded"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleGenerateReport} disabled={!startDate || !endDate || loading}>
                            {loading ? "Generating..." : "Generate Report"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default ViewReport;
