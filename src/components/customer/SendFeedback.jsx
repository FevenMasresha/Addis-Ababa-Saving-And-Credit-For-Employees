import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import useAuthStore from "@/store/authStore";
import useFeedbackStore from '@/store/useFeedbackStore';
import { MessageSquareText } from 'lucide-react';

export default function SendFeedback() {
    const [feedbackText, setFeedbackText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { feedbacks, fetchFeedbacks } = useFeedbackStore();
    const token = useAuthStore((state) => state.token); // Get the auth token from Zustand store
    const { user } = useAuthStore();

    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks]);


    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit

        setLoading(true); // Start loading
        setError(null); // Clear previous errors
        setSuccess(null); // Clear previous success messages

        try {
            const response = await axios.post('http://localhost:8000/api/feedback', {
                message: feedbackText,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                }
            });
            console.log('Feedback submitted successfully:', response.data);
            setFeedbackText('');
            setSuccess('Feedback submitted successfully!');

            setTimeout(() => {
                setDialogOpen(false); // Close the dialog after the success message is shown
                fetchFeedbacks(); // Fetch updated feedback list
            }, 2000);
        } catch (error) {
            console.error('Error submitting feedback:', error.response ? error.response.data : error.message);
            setError('Error submitting feedback. Please try again later.'); // Set error message
        } finally {
            setLoading(false); // Stop loading
        }
    };


    const filteredAndSortedFeedbacks = feedbacks
        .filter((feedback) => feedback.user_id === user?.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by most recent first

    return (
        <Card>
            <CardHeader>
                <CardTitle>Send Feedback</CardTitle>
                <CardDescription>We value your opinion. Please share your thoughts with us.</CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setDialogOpen(true)}>Send Feedback</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Send Feedback</DialogTitle>
                            <DialogDescription>
                                We value your opinion. Please share your thoughts with us.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="feedbackText" className="text-right">
                                        Your Feedback
                                    </Label>
                                    <Textarea
                                        id="feedbackText"
                                        className="col-span-3"
                                        placeholder="Please provide your feedback here"
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        required

                                    />

                                </div>
                            </div>
                            {loading && <p>Submitting feedback...</p>}
                            {success && <p className="text-green-500">{success}</p>}
                            {error && <p className="text-red-500">{error}</p>}
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    Submit Feedback
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>

            {/* Display Associated Feedbacks */}
            <CardContent>
                <CardDescription>Your previously submitted feedbacks and responses:</CardDescription>
                {filteredAndSortedFeedbacks.length > 0 ? (
                    <div className="space-y-4">
                        {filteredAndSortedFeedbacks.map((feedback) => (
                            <div
                                key={feedback.id}
                                className="border rounded-lg shadow-md p-4 bg-white hover:bg-gray-50 transition duration-300"
                            >
                                <div className="flex items-start space-x-3">
                                    <MessageSquareText className="text-blue-600 h-6 w-6" />
                                    <p className="text-gray-800">
                                        <span className="font-medium text-blue-700">Message:</span> {feedback.message}
                                    </p>
                                </div>
                                {feedback.response && (
                                    <div className="mt-3 pl-9 border-l-2 border-blue-500">
                                        <p className="text-gray-700">
                                            <span className="font-medium text-blue-600">Response:</span> {feedback.response}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-gray-500 text-lg">No feedback submitted yet.</p>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
