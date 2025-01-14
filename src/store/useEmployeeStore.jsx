import { create } from 'zustand';
import axios from 'axios';
// import useAuthStore from './authStore';
const useEmployeeStore = create((set) => ({
    employees: [], // Initialize as an empty array
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        perPage: 10,
    },
    fetchEmployees: async (filters = {}, token) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('http://localhost:8000/api/employees', {
                params: {
                    ...filters,
                    page: filters.page || 1,
                    per_page: filters.perPage || 10,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({
                employees: response.data.data || [], // Ensure it's an array
                pagination: {
                    currentPage: response.data.current_page,
                    totalPages: response.data.last_page,
                    perPage: response.data.per_page,
                },
                loading: false,
            });
        } catch (error) {
            set({ loading: false, error: error.response ? error.response.data : 'Error fetching employees' });
            set({ employees: [] }); // Reset employees to an empty array on error
        }
    },

    addEmployee: async (employeeData, token) => {
        set({ loading: true, error: null }); // Set loading state

        try {
            const response = await axios.post('http://localhost:8000/api/employees', employeeData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ employee: response.data.employee, loading: false });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 422) {
                set({ error: error.response.data.errors }); // Set validation errors
            } else {
                set({ error: error.message }); // Set generic error message
            }
            set({ loading: false }); // Set loading false
            throw error; // Re-throw the error for further handling if needed
        }
    },
    updateEmployee: async (id, updatedEmployee, token) => {
        set({ loading: true, error: null }); // Set loading state

        try {
            const response = await axios.put(`http://localhost:8000/api/employees/${id}`, updatedEmployee, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
                employees: state.employees.map((emp) =>
                    emp.id === id ? response.data : emp
                ),
            }));
            return response.data; // Return success response

        } catch (error) {
            if (error.response && error.response.status === 422) {
                set({ error: error.response.data.errors }); // Set validation errors
            } else {
                set({ error: error.message }); // Set generic error message
            }
            set({ loading: false }); // Set loading false
            throw error; // Re-throw the error for further handling if needed
        }
    },
    deleteEmployee: async (id, token) => {
        try {
            await axios.delete(`http://localhost:8000/api/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
                employees: state.employees.filter((emp) => emp.id !== id),
            }));
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    },
}));

export default useEmployeeStore;
