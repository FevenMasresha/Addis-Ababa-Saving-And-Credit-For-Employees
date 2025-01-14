import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    setAuthData: (user, token) => {
        localStorage.setItem('user', JSON.stringify(user));  // Save user data to localStorage
        localStorage.setItem('token', token);  // Save token to localStorage
        localStorage.setItem('role', user.role);  // Save user role to localStorage
        set({ user, token, role: user.role });
    },
    setUserProfilePicture: (profile_picture) =>
        set((state) => {
            const updatedUser = { ...state.user, profile_picture };
            localStorage.setItem('user', JSON.stringify(updatedUser));  // Save updated user to localStorage
            return { user: updatedUser };
        }),
    setBalances: (savingBalance, loanBalance) => set({ savingBalance, loanBalance }),
    clearAuthData: () => {
        localStorage.removeItem('user');  // Clear user data from localStorage
        localStorage.removeItem('token');  // Clear token from localStorage
        localStorage.removeItem('role');  // Clear user role from localStorage
        set({ user: null, token: null, role: null });
    },
}));

export default useAuthStore;
