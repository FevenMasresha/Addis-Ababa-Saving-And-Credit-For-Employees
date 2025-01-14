import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import useFeedbackStore from '@/store/useFeedbackStore';
import useAuthStore from '@/store/authStore';

export default function ViewFeedback() {
    const { feedbacks, loading, error, fetchFeedbacks, respondToFeedback } = useFeedbackStore();
    const [responses, setResponses] = useState({});
    const [errors, setErrors] = useState({});
    const { user } = useAuthStore();
    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks]);

    if (loading) return <div>Loading feedback...</div>;
    if (error) return <div>Error: {error}</div>;

    if (!Array.isArray(feedbacks)) {
        return <div>Invalid feedback data</div>;
    }

    const sortedFeedbacks = feedbacks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const handleRespond = async (feedbackId) => {
        const response = responses[feedbackId];

        // Validate the response
        if (!response || response.trim() === "") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [feedbackId]: "Response cannot be empty.",
            }));
            return;
        }

        try {
            // Call the API or store function to submit the response
            await respondToFeedback(feedbackId, response);

            // Clear the response input and errors after a successful submission
            setResponses((prevResponses) => ({
                ...prevResponses,
                [feedbackId]: "",
            }));

            setErrors((prevErrors) => ({
                ...prevErrors,
                [feedbackId]: null,
            }));
        } catch (error) {
            console.error("Error while submitting response:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                [feedbackId]: "Failed to submit the response. Please try again.",
            }));
        }
    };

    // Handle input change for the response of a feedback
    const handleInputChange = (feedbackId, value) => {
        setResponses((prevResponses) => ({
            ...prevResponses,
            [feedbackId]: value, // Update the response for the specific feedback
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Feedback</CardTitle>
                <CardDescription>View and manage customer feedbacks</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Comment</TableHead>
                            <TableHead>Response</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedFeedbacks.length > 0 ? (
                            sortedFeedbacks.map((feedback) => (
                                <TableRow key={feedback.id}>
                                    <TableCell>{feedback.user_id}</TableCell>
                                    <TableCell>{new Date(feedback.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>{feedback.message}</TableCell>

                                    <TableCell>
                                        {feedback.response ? (
                                            <div>{feedback.response}</div>
                                        ) : (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={responses[feedback.id] || ""}
                                                    onChange={(e) => handleInputChange(feedback.id, e.target.value)}
                                                    placeholder="Enter your response"
                                                    className={`p-2 rounded ${errors[feedback.id] ? "border-red-500" : ""}`}
                                                />
                                                {errors[feedback.id] && (
                                                    <p className="text-red-500 text-sm mt-1">{errors[feedback.id]}</p>
                                                )}
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRespond(feedback.id)}
                                            disabled={user?.role !== 'accountant'}  // Disable button if the user is not an accountant
                                        >
                                            Respond

                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center">No feedback available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
