
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, ArrowUpFromLine, DollarSign, FileText } from 'lucide-react';
import useTransactionStore from '@/store/useTransactionStore';
import useAuthStore from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import ProcessTransactionDialog from './ProcessTransactionDialog';
import DepositsWithdrawalsGraph from './DepositeWithdrawLIne';

export default function pendingTransactions() {
    return (

        <div>

        </div>

    )
};