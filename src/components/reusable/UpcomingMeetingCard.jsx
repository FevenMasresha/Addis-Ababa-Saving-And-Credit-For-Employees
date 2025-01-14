import { Calendar } from "lucide-react";
import useMeetingStore from "@/store/useMeetingStore";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MeetingCard = () => {
    const { meetings, loading, fetchMeetings, clearMeetings } = useMeetingStore();
    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            clearMeetings();
            fetchMeetings(token);
        }
    }, [token, fetchMeetings]);

    // Get the current date and time
    const now = new Date();

    // Filter only future meetings
    const futureMeetings = meetings.filter((meeting) => new Date(meeting.date) > now);

    // Get the count of future meetings
    const meetingCount = futureMeetings.length;

    // Find the next meeting based on the soonest date
    const nextMeeting = futureMeetings.length > 0
        ? futureMeetings.sort((a, b) => new Date(a.date) - new Date(b.date))[0]
        : null;

    if (loading) {
        return <p>Loading meetings...</p>;
    }

    return (
        <Card onClick={() => navigate('view-meeting')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{meetingCount}</div>
                <p className="text-xs text-muted-foreground">
                    {nextMeeting ? `Next: ${new Date(nextMeeting.date).toLocaleDateString()}` : "No upcoming meetings"}
                </p>
            </CardContent>
        </Card>
    );
};

export default MeetingCard;
