"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, MapPin } from "lucide-react";
import useMeetingStore from "@/store/useMeetingStore";
import useAuthStore from "@/store/authStore";

export default function ViewMeeting() {
    const { meetings, fetchMeetings, clearMeetings } = useMeetingStore();
    const token = useAuthStore((state) => state.token);
    const [loading, setLoading] = useState(true);

    // Fetch meetings on component mount
    useEffect(() => {
        if (token) {
            clearMeetings();
            fetchMeetings(token).finally(() => setLoading(false));
        }
    }, [token, fetchMeetings]);

    if (loading) {
        return <p>Loading meetings...</p>;
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Meeting Management</CardTitle>
                <CardDescription>Meetings for your role</CardDescription>
            </CardHeader>
            <CardContent>
                {meetings.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Attendees</TableHead>
                                <TableHead>Agenda</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {meetings.map((meeting) => (
                                <TableRow key={meeting.id}>
                                    <TableCell className="font-medium">{meeting.title}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {meeting.date}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {meeting.time}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {meeting.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {Array.isArray(meeting.attendees)
                                            ? meeting.attendees.join(", ")
                                            : meeting.attendees}
                                    </TableCell>
                                    <TableCell>{meeting.agenda}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p>No meetings available.</p>
                )}
            </CardContent>
        </Card>
    );
}
