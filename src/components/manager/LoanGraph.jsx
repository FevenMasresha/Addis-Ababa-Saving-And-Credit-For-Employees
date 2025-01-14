"use client";
import {
    Line,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const processTransactions = (transactions) => {
    const monthlyData = {};

    transactions.forEach(({ created_at, transaction_type, amount }) => {
        const numericAmount = parseFloat(amount);
        const date = new Date(created_at);
        const month = date.toLocaleString("default", { month: "short" }); // e.g., 'Jan', 'Feb'

        if (!monthlyData[month]) {
            monthlyData[month] = { month, loanApplications: 0, repayments: 0 };
        }
        if (transaction_type === "loan") {
            monthlyData[month].loanApplications += numericAmount;
        } else if (transaction_type === "loan repayment") {
            monthlyData[month].repayments += numericAmount;
        }
    });

    const monthsOrder = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    return monthsOrder.map((month) => monthlyData[month] || { month, loanApplications: 0, repayments: 0 });
};

export default function LoanGraph({ transactions = [] }) {  // Default to an empty array if transactions is undefined
    // Filter transactions for loan applications and repayments with approved status
    const validTransactions = transactions.filter(
        (t) =>
            (t.transaction_type === "loan" || t.transaction_type === "loan repayment") &&
            t.status === "approved"
    );
    const financialData = processTransactions(validTransactions);
    console.log("Transactions:", transactions);
    console.log("Valid Transactions:", validTransactions);
    console.log("Financial Data:", financialData);


    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Loan Applications and Repayments</CardTitle>
                <CardDescription>
                    Monthly financial activity for loans and repayments
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={financialData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="loanApplications"
                                stroke="#f44336"
                                name="Loan Applications"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="repayments"
                                stroke="#4caf50"
                                name="Repayments"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
