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
        const month = date.toLocaleString("default", { month: "short" });

        if (!monthlyData[month]) {
            monthlyData[month] = { month, deposits: 0, withdrawals: 0 };
        }
        if (transaction_type === "deposit") {
            monthlyData[month].deposits += numericAmount;
        } else if (transaction_type === "withdrawal") {
            monthlyData[month].withdrawals += numericAmount;
        }
    });

    const monthsOrder = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    return monthsOrder.map((month) => monthlyData[month] || { month, deposits: 0, withdrawals: 0 });
};
export default function DepositsWithdrawalsGraph({ transactions = [] }) {  // Default to an empty array if transactions is undefined
    const validTransactions = transactions.filter(
        (t) => (t.transaction_type === "deposit" || t.transaction_type === "withdrawal") && t.status === "approved"
    );
    const financialData = processTransactions(validTransactions);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Deposits and Withdrawals</CardTitle>
                <CardDescription>
                    Monthly financial activity for the association
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
                                dataKey="deposits"
                                stroke="#4caf50"
                                name="Deposits"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="withdrawals"
                                stroke="#f44336"
                                name="Withdrawals"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
