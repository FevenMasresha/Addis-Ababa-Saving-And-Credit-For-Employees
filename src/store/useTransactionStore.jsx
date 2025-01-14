import { create } from 'zustand';
import useAuthStore from './authStore';
import axios from 'axios';

const useTransactionStore = create((set) => ({
    transactions: [],
    loading: false,
    error: null,

    // Action to fetch transactions
    fetchTransactions: async (filters = {}) => {
        const token = useAuthStore.getState().token;

        set({ loading: true, error: null });

        try {
            // Clean up the filters to remove any fields that are empty or have default values
            const cleanedFilters = Object.fromEntries(
                Object.entries(filters).filter(([key, value]) => {
                    if (typeof value === 'string') {
                        return value.trim() !== '' && value !== 'all';
                    }
                    return value !== undefined && value !== null;
                })
            );
            const response = await axios.get('http://localhost:8000/api/transactions', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
                params: cleanedFilters, // Pass the cleaned filters
            });

            set({ transactions: response.data.data, loading: false });
            console.log('Fetched transactions:', response.data.data); // Log for debugging
        } catch (error) {
            console.error('Error fetching transactions:', error);
            set({
                loading: false,
                error: error.response?.data?.message || error.message || 'Failed to fetch transactions',
            });
        }
    },


    // Action to process a transaction
    processTransaction: async (id, action) => {
        const token = useAuthStore.getState().token;

        set({ loading: true, error: null });

        try {
            const response = await axios.post(
                `http://localhost:8000/api/transactions/${id}/process`,
                { action },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );

            const updatedTransaction = response.data.transaction;

            set((state) => ({
                transactions: state.transactions.map((transaction) =>
                    transaction.id === updatedTransaction.id ? updatedTransaction : transaction
                ),
            }));

            console.log('Transaction processed successfully:', updatedTransaction);
        } catch (error) {
            console.error('Error processing transaction:', error);
            set({
                error: error.response?.data?.message || error.message || 'Failed to process transaction',
            });
            throw new Error(error.response?.data?.message || 'Failed to process transaction');
        } finally {
            set({ loading: false });
        }
    },
}));

export default useTransactionStore;
