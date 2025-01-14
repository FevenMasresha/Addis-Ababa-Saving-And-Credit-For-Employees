import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const useUserStore = create((set) => ({
    users: [],
    setUsers: (newUsers) => set({ users: newUsers }),
    clearUsers: () => set({ users: [] }),

    fetchUsers: async () => {
        const token = useAuthStore.getState().token;

        if (!token) {
            console.error("No token found. User not authenticated.");
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ users: response.data });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    },

    editUser: async (userId, updatedData) => {
        const token = useAuthStore.getState().token;

        if (!token) {
            console.error("No token found. User not authenticated.");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/api/users/${userId}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update the user in the store with the modified data
            set((state) => ({
                users: state.users.map((user) =>
                    user.id === userId ? { ...user, ...updatedData } : user
                ),
            }));

            console.log("User edited successfully:", response.data);
        } catch (error) {
            console.error("Error editing user:", error);
        }
    },

    deleteUser: async (userId) => {
        const token = useAuthStore.getState().token;

        if (!token) {
            console.error("No token found. User not authenticated.");
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:8000/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove the user from the store
            set((state) => ({
                users: state.users.filter((user) => user.id !== userId),
            }));

            console.log("User deleted successfully:", response.data);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    },
}));

export default useUserStore;
