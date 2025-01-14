'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"

export default function ViewLoanRequests() {
    const [loanRequests, setLoanRequests] = useState([
        { id: 1, applicant: "John Doe", amount: 5000, purpose: "Home Renovation", creditScore: 720, income: 50000, status: "Pending" },
        { id: 2, applicant: "Jane Smith", amount: 10000, purpose: "Business Expansion", creditScore: 680, income: 70000, status: "Pending" },
        { id: 3, applicant: "Bob Johnson", amount: 3000, purpose: "Education", creditScore: 750, income: 45000, status: "Pending" },
    ])

    const LoanRequestDialog = ({ request }) => {
        const [decision, setDecision] = useState('')
        const [comments, setComments] = useState('')

        const handleSubmit = (e) => {
            e.preventDefault()
            console.log(`Loan request ${request.id} ${decision} with comments: ${comments}`)
            // Here you would update the loan request status
            setLoanRequests(prevRequests =>
                prevRequests.map(req =>
                    req.id === request.id ? { ...req, status: decision } : req
                )
            )
        }

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Review</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Review Loan Request</DialogTitle>
                        <DialogDescription>
                            Review the loan request details and make a decision.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="applicant" className="text-right">
                                    Applicant
                                </Label>
                                <Input id="applicant" value={request.applicant} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">
                                    Amount
                                </Label>
                                <Input id="amount" value={`$${request.amount}`} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="purpose" className="text-right">
                                    Purpose
                                </Label>
                                <Input id="purpose" value={request.purpose} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="creditScore" className="text-right">
                                    Credit Score
                                </Label>
                                <Input id="creditScore" value={request.creditScore} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="income" className="text-right">
                                    Income
                                </Label>
                                <Input id="income" value={`$${request.income}`} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="decision" className="text-right">
                                    Decision
                                </Label>
                                <select
                                    id="decision"
                                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={decision}
                                    onChange={(e) => setDecision(e.target.value)}
                                    required
                                >
                                    <option value="">Select decision</option>
                                    <option value="Approved">Approve</option>
                                    <option value="Rejected">Reject</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="comments" className="text-right">
                                    Comments
                                </Label>
                                <textarea
                                    id="comments"
                                    className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter your comments here"
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Submit Decision</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Loan Requests</CardTitle>
                <CardDescription>Review and process loan applications.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Credit Score</TableHead>
                            <TableHead>Income</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loanRequests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>{request.applicant}</TableCell>
                                <TableCell>${request.amount}</TableCell>
                                <TableCell>{request.purpose}</TableCell>
                                <TableCell>{request.creditScore}</TableCell>
                                <TableCell>${request.income}</TableCell>
                                <TableCell>{request.status}</TableCell>
                                <TableCell>
                                    <LoanRequestDialog request={request} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}