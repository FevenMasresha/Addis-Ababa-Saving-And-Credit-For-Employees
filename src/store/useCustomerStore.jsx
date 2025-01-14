import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const useCustomerStore = create((set) => ({
    customers: [],
    loading: false,
    error: null,

    // Fetch customers based on filters
    fetchCustomers: async (filters = {}) => {
        const token = useAuthStore.getState().token;

        set({ loading: true, error: null });

        try {
            const cleanedFilters = Object.fromEntries(
                Object.entries(filters).filter(([key, value]) => {
                    if (typeof value === 'string') {
                        return value.trim() !== '' && value !== 'all';
                    }
                    return value !== undefined && value !== null;
                })
            );

            const response = await axios.get('http://localhost:8000/api/customers', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
                params: cleanedFilters,
            });

            // Safely extract the customers array
            const customersData = response.data.data;

            // Ensure the state only updates if the data is an array
            set({
                customers: Array.isArray(customersData) ? customersData : [],
                loading: false,
            });

        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || error.message || 'Failed to fetch customers',
            });
        }
    },

    updateCustomer: async (customerId, updatedData) => {
        try {
            const { token } = useAuthStore.getState();
            if (!token) {
                throw new Error('Authentication token is missing!');
            }

            await axios.put(`http://localhost:8000/api/customers/${customerId}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            set((state) => {
                const updatedCustomers = state.customers.map(customer =>
                    customer.id === customerId ? { ...customer, ...updatedData } : customer
                );
                return { customers: updatedCustomers };
            });
        } catch (error) {
            console.error('Error updating customer:', error.message || error);
            set({
                loading: false,
                error: error.response?.data?.message || error.message || 'Failed to fetch customers',
            });
        }
    },
    deleteCustomer: async (customerId) => {
        try {
            const { token } = useAuthStore.getState();
            if (!token) {
                throw new Error('Authentication token is missing!');
            }

            // Make API request to delete customer
            await axios.delete(`http://localhost:8000/api/customers/${customerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove the customer from the local store
            set((state) => {
                const updatedCustomers = state.customers.filter(customer => customer.id !== customerId);
                return { customers: updatedCustomers };
            });
        } catch (error) {
            console.error('Error deleting customer:', error.message || error);
        }
    },
}));

export default useCustomerStore;
