import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Image, Printer } from 'lucide-react'

export function TransactionReceipt({ transaction, action, notes }) {
    const handlePrint = () => {
        window.print()
    }

    const showReceiptImage = ['deposit', 'loan repayment'].includes(transaction.transaction_type.toLowerCase())

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Transaction Receipt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {showReceiptImage && transaction.receipt_url && (
                    <div className="w-full aspect-square relative mb-4">
                        <Image
                            src={transaction.receipt_url}
                            alt="Transaction Receipt"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="font-semibold">Transaction ID:</span>
                    <span>{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Customer ID:</span>
                    <span>{transaction.user_id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Type:</span>
                    <span>{transaction.transaction_type}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Amount:</span>
                    <span className={transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Date:</span>
                    <span>
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Status:</span>
                    <span className={action === 'approve' ? 'text-green-500' : 'text-red-500'}>
                        {action === 'approve' ? 'Approved' : 'Rejected'}
                    </span>
                </div>
                {notes && (
                    <div className="pt-4">
                        <span className="font-semibold">Notes:</span>
                        <p className="mt-1 text-sm">{notes}</p>
                    </div>
                )}
                <div className="pt-6">
                    <Button onClick={handlePrint} className="w-full">
                        <Printer className="mr-2 h-4 w-4" /> Print Receipt
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

