import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import axios from 'axios';
import useAuthStore from '@/store/authStore';
import { toast } from 'react-toastify';

export default function SendRequest() {
    const [requestType, setRequestType] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [receipt, setReceipt] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { token } = useAuthStore((state) => state);
    const [loading, setLoading] = useState(false);
    const sucess_toast = (message) => toast.success(message)
    const error_toast = (message) => toast.error(message)

    const handleFileChange = (e) => {
        if (e.target.files) {
            setReceipt(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!amount || !requestType) {
            // setErrorMessage('Please fill in all required fields');
            error_toast('Please fill in all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('amount', amount);
        if (requestType === 'apply-loan' || requestType === 'withdrawal') {
            formData.append('reason', reason);
        }
        if ((requestType === 'loan' || requestType === 'deposit') && receipt) {
            formData.append('receipt', receipt);
        }

        let endpoint = '';
        switch (requestType) {
            case 'loan':
                endpoint = 'http://localhost:8000/api/loan';
                break;
            case 'withdrawal':
                endpoint = 'http://localhost:8000/api/withdraw';
                break;
            case 'deposit':
                endpoint = 'http://localhost:8000/api/deposit';
                break;
            case 'applyloan':
                endpoint = 'http://localhost:8000/api/apply-loan';
                break;
            default:
                // setErrorMessage('Invalid request type');
                error_toast("Invalid request type");
                return;
        }

        try {
            setLoading(true);
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            sucess_toast('Request submitted successfully')
            setIsSuccessDialogOpen(true);
        } catch (error) {
            // setErrorMessage(error.response?.data?.message || 'Failed to submit request');
            error_toast(error.response?.data?.message || 'Failed to submit request');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Send New Request</CardTitle>
                <CardDescription>Submit a new request for loan, withdrawal, or deposit.</CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Send Request</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Submit a Request</DialogTitle>
                            <DialogDescription>
                                Fill out the form below to submit a new request. Click submit when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Request Type</Label>
                                    <Select value={requestType} onValueChange={setRequestType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select request type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="loan">Loan Repayment</SelectItem>
                                            <SelectItem value="applyloan">Loan Request</SelectItem>
                                            <SelectItem value="withdrawal">Withdrawal</SelectItem>
                                            <SelectItem value="deposit">Deposit</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        id="amount"
                                        required
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        type="number"
                                        placeholder="Enter amount"
                                    />
                                </div>
                                {requestType === 'withdrawal' && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="reason">Reason for Withdrawal</Label>
                                        <Textarea
                                            id="reason"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Enter reason for withdrawal"
                                        />
                                    </div>
                                )}

                                {requestType === 'applyloan' && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="reason">Reason for Loan</Label>
                                        <Textarea
                                            id="reason"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Enter reason for loan"
                                        />
                                    </div>
                                )}
                                {(requestType === 'loan' || requestType === 'deposit') && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="receipt">Upload Deposit Receipt</Label>
                                        <Input
                                            id="receipt"
                                            required
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*,.pdf"
                                        />
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit">
                                    {loading ? "Sending..." : "Send Request"}

                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
