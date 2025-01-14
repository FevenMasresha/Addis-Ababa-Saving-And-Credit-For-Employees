"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Printer, Check, X, Loader2 } from "lucide-react";
import useTransactionStore from "@/store/useTransactionStore";
import useCustomerStore from "@/store/useCustomerStore";

export default function TransactionProcessingDialog({
    isOpen,
    onClose,
    onError,
    onSuccess,
    transaction,
    token,
}) {
    const [notes, setNotes] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedAction, setProcessedAction] = useState(null);
    const [processingAction, setProcessingAction] = useState(null); // Track the specific action being processed

    const { processTransaction } = useTransactionStore();
    const { customers, fetchCustomers, } = useCustomerStore();

    useEffect(() => {
        fetchCustomers();
        if (transaction) {
            setNotes("");
            setProcessedAction(null);
        }
    }, [transaction, customers]);
    const customerName = Array.isArray(customers)
        ? customers.find((customer) => customer.user_id === transaction?.user_id)
            ? `${customers.find((customer) => customer.user_id === transaction?.user_id)?.fname} ${customers.find((customer) => customer.user_id === transaction?.user_id)?.lname}`
            : "Customer not found"
        : "Loading...";

    const handleProcess = async (action) => {
        setProcessingAction(action); // Set the action being processed

        try {
            // Call the store method to process the transaction
            await processTransaction(transaction.id, action, token);
            onSuccess();
            setProcessedAction(action);
            // setSuccessMessage(`Transaction has been ${action === "approve" ? "approved" : "rejected"}`);
        } catch (error) {
            onError();
            // setErrorMessage("An error occurred while processing the transaction.");
            console.error("Transaction processing error:", error);
        } finally {
            setProcessingAction(null);
        }
    };

    const showReceiptImage = ["deposit", "loan repayment"].includes(
        transaction?.transaction_type?.toLowerCase()
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => open ? null : onClose()}>
            <DialogContent className="sm:max-w-[550px] p-6">
                <DialogHeader>
                    <DialogTitle>Review Transaction</DialogTitle>
                    <DialogDescription>
                        Review the transaction details and add any necessary notes before processing.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customer" className="text-right">
                            Customer
                        </Label>
                        <Input
                            id="customer"
                            value={customerName}
                            className="col-span-3"
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Type
                        </Label>
                        <Input
                            id="type"
                            value={transaction?.transaction_type || ""}
                            className="col-span-3"
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            value={`$${Math.abs(transaction?.amount || 0).toFixed(2)}`}
                            className="col-span-3"
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Reason" className="text-right">
                            Reason
                        </Label>
                        <Input
                            id="Reason"
                            value={transaction?.reason || " "}
                            className="col-span-3"
                            readOnly
                        />
                    </div>
                    {showReceiptImage && transaction?.receipt_url && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="Reason" className="text-right">
                                receipt
                            </Label>
                            <img
                                src={transaction.receipt_url}
                                alt="Transaction Receipt"
                                className="w-[400px] h-[300px] col-span-3 object-contain rounded-md"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose} disabled={!!processingAction}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleProcess("reject")}
                        variant="destructive"
                        disabled={processingAction === "reject"} // Disable only if "reject" is being processed
                    >
                        {processingAction === "reject" ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <X className="mr-2 h-4 w-4" />
                        )}
                        Reject
                    </Button>
                    <Button
                        onClick={() => handleProcess("approve")}
                        disabled={processingAction === "approve"} // Disable only if "approve" is being processed
                    >
                        {processingAction === "approve" ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Check className="mr-2 h-4 w-4" />
                        )}
                        Approve
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
