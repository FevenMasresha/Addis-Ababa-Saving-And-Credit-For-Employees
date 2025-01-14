"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Users, MapPin, Plus } from "lucide-react";

import useMeetingStore from "@/store/useMeetingStore";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";
export default function MeetingManagement() {
    const { meetings, fetchMeetings, addMeeting, clearMeetings } = useMeetingStore(); // Zustand meeting store
    const token = useAuthStore((state) => state.token); // Zustand auth store
    const successToast = (message) => toast.success(message);
    const errorToast = (message) => toast.error(message);

    const [newMeeting, setNewMeeting] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        attendees: "",
        agenda: "",
    });

    // Fetch meetings when the component mounts
    useEffect(() => {
        if (token) {
            clearMeetings();
            fetchMeetings(token);
        }
    }, [token, fetchMeetings]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMeeting((prev) => ({ ...prev, [name]: value }));
    };
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        setNewMeeting((prev) => {
            const attendeesArray = prev.attendees ? prev.attendees.split(",") : [];

            if (checked) {
                // Add the selected role
                attendeesArray.push(value);
            } else {
                // Remove the unselected role
                const index = attendeesArray.indexOf(value);
                if (index > -1) attendeesArray.splice(index, 1);
            }

            return {
                ...prev,
                attendees: attendeesArray.join(","), // Convert back to a comma-separated string
            };
        });
    };


    const handleAddMeeting = async () => {
        if (newMeeting.title && newMeeting.date && newMeeting.time && newMeeting.location) {
            try {
                await addMeeting(newMeeting, token); // Add meeting using the store
                setNewMeeting({
                    title: "",
                    date: "",
                    time: "",
                    location: "",
                    attendees: "",
                    agenda: "",
                });
                successToast(`${newMeeting.title} has been scheduled for ${newMeeting.date} at ${newMeeting.time}.`);
            } catch (error) {
                errorToast("There was an error scheduling the meeting. Please try again.");
            }
        } else {
            errorToast("Please fill out all required fields before scheduling a meeting.");
        }
    };

    // Helper function to sort meetings by nearest date and time
    const getSortedMeetings = () => {
        return [...meetings].sort((a, b) => {
            const dateTimeA = new Date(`${a.date}T${a.time}`);
            const dateTimeB = new Date(`${b.date}T${b.time}`);
            return dateTimeA - dateTimeB;
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Meeting Management</CardTitle>
                <CardDescription>Schedule and manage meetings</CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="mb-4">
                            <Plus className="mr-2 h-4 w-4" />
                            Schedule New Meeting
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Schedule New Meeting</DialogTitle>
                            <DialogDescription>Enter the details for the new meeting below.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {/* Form Fields */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={newMeeting.title}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">Date</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={newMeeting.date}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="time" className="text-right">Time</Label>
                                <Input
                                    id="time"
                                    name="time"
                                    type="time"
                                    value={newMeeting.time}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="location" className="text-right">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={newMeeting.location}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="attendees" className="text-right">Attendees</Label>
                                <div className="col-span-3 flex flex-wrap gap-4">
                                    {["accountant", "admin", "manager", "customer", "loan-committee"].map((role) => (
                                        <div key={role} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={role}
                                                name="attendees"
                                                value={role}
                                                checked={newMeeting.attendees.includes(role)}
                                                onChange={handleCheckboxChange} // Update handler
                                                className="checkbox-input"
                                            />
                                            <label htmlFor={role} className="text-sm">
                                                {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitalize the first letter */}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="agenda" className="text-right">Agenda</Label>
                                <Textarea
                                    id="agenda"
                                    name="agenda"
                                    value={newMeeting.agenda}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddMeeting}>Schedule Meeting</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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
                        {getSortedMeetings().map((meeting) => (
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
                                <TableCell>{meeting.attendees}</TableCell>
                                <TableCell>{meeting.agenda}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
