"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useTransactionStore from "@/store/useTransactionStore"; // Import your store
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";

export default function LoanReviewDialog({ request }) {
    const [decision, setDecision] = useState("");
    const [loading, setLoading] = useState(false); // To manage local loading state
    const [error, setError] = useState(""); // For local error messages
    const { processTransaction } = useTransactionStore(); // Access the store action
    const token = useAuthStore((state) => state.token);
    const successToast = (message) => toast.success(message);
    const errorToast = (message) => toast.error(message);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await processTransaction(request.id, decision.toLowerCase().replace(" ", "-"), token);
            successToast(`Loan request ${request.id} processed successfully with decision: ${decision}`);
            console.log(`Loan request ${request.id} processed successfully with decision: ${decision}`);
        } catch (err) {
            console.error(err.message);
            errorToast(err.message || "An error occurred while processing the transaction.");
            setError(err.message || "An error occurred while processing the transaction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Review
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Review Loan Request</DialogTitle>
                    <DialogDescription>
                        Review the details and provide a decision.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label>Applicant</Label>
                            <Input value={request.applicant} readOnly />
                        </div>
                        <div>
                            <Label>Amount</Label>
                            <Input value={`$${request.amount}`} readOnly />
                        </div>
                        <div>
                            <Label>Purpose</Label>
                            <Input value={request.reason} readOnly />
                        </div>
                        <div>
                            <Label>Decision</Label>
                            <select
                                value={decision}
                                onChange={(e) => setDecision(e.target.value)}
                                className="w-full p-2 border"
                                required
                            >
                                <option value="">Select</option>
                                <option value="approve">Approve</option>
                                <option value="reject">Reject</option>
                            </select>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Processing..." : "Submit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
