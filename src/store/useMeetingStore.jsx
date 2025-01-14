import { create } from 'zustand';
import axios from 'axios';

const useMeetingStore = create((set) => ({
    meetings: [],
    fetchMeetings: async (token) => {
        try {
            const response = await axios.get('http://localhost:8000/api/meetings', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            set({ meetings: response.data });

        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
    },

    addMeeting: async (newMeeting, token) => {
        try {
            const response = await axios.post(
                'http://localhost:8000/api/meetings',
                newMeeting,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );
            set((state) => ({
                meetings: [...state.meetings, response.data],
            }));
        } catch (error) {
            console.error('Error adding meeting:', error);
        }
    },
    // Clear all meetings
    clearMeetings: () => set({ meetings: [] }),
}));

export default useMeetingStore;
