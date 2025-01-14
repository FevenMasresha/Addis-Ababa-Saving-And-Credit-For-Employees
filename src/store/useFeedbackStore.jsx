import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const useFeedbackStore = create((set) => ({
    feedbacks: [],
    loading: false,
    error: null,

    // Fetch all feedbacks from the server
    fetchFeedbacks: async () => {
        const { token } = useAuthStore.getState();
        if (!token) {
            set({ error: "User not authenticated" });
            return;
        }

        set({ loading: true, error: null }); // Start loading

        try {
            const response = await axios.get('http://localhost:8000/api/feedbacks', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ feedbacks: response.data.feedbacks, loading: false }); // Store feedbacks
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false }); // Handle error
        }
    },

    // Respond to a specific feedback
    respondToFeedback: async (feedbackId, response) => {
        const { token } = useAuthStore.getState();
        if (!token) {
            set({ error: "User not authenticated" });
            return;
        }

        set({ loading: true, error: null }); // Start loading

        try {
            // Send response to the backend
            const res = await axios.put(
                `http://localhost:8000/api/feedback/${feedbackId}/respond`,
                { response },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Optimistically update the feedback state
            set((state) => {
                const updatedFeedbacks = state.feedbacks.map((feedback) =>
                    feedback.id === feedbackId
                        ? { ...feedback, response: res.data.response } // Update the response
                        : feedback
                );
                return { feedbacks: updatedFeedbacks, loading: false }; // Update the state with the new feedback data
            });

        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false }); // Handle error
        }
    },

    // Optional: Action to clear feedbacks when needed
    clearFeedbacks: () => set({ feedbacks: [] }),
}));

export default useFeedbackStore;
