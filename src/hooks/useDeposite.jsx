import axios from 'axios';
import useAuthStore from './stores/authStore'; // Using your existing store

const useDeposit = () => {
    const { token, user } = useAuthStore((state) => ({
        token: state.token,
        user: state.user,
    })); // Extract token and user from Zustand store

    const deposit = async (amount) => {
        // Check if the user is logged in
        if (!token || !user) {
            alert('You must be logged in to deposit');
            return;
        }

        try {
            // Make the API call to the backend
            const response = await axios.post(
                'http://localhost:8000/api/deposit', // Replace with your actual backend URL
                { amount }, // Payload containing the deposit amount
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add JWT token to Authorization header
                    },
                }
            );

            alert(`Deposit successful. New balance: ${response.data.new_saving_balance}`);
        } catch (error) {
            console.error('Deposit error:', error.response?.data?.message || error.message);
            alert('Failed to deposit: ' + (error.response?.data?.message || error.message));
        }
    };

    return deposit;
};

export default useDeposit;
