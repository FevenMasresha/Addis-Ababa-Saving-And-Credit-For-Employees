import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp } from "lucide-react";
import EditUserDialog from "./EditUserDialog";
import useUserStore from "@/store/useUserStore";

const ViewUser = () => {
    const { users, fetchUsers, deleteUser } = useUserStore((state) => state); // updateUser is now destructured
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showMore, setShowMore] = useState(false); // State to toggle "Show More" functionality
    const [displayedUsers, setDisplayedUsers] = useState([]); // State to store displayed users
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [visibleUsers, setVisibleUsers] = useState(5); // Default to show 5 users at a time

    const loadUsers = useCallback(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    useEffect(() => {
        const sortedUsers = [...users].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setDisplayedUsers(sortedUsers.slice(0, showMore ? sortedUsers.length : 5));
    }, [users, showMore]);

    const toggleShowMore = () => {
        setShowMore((prev) => !prev);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleOpenConfirmDialog = (userId) => {
        setSelectedUser(userId);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteUser(selectedUser);
            setSuccessDialogOpen(true);
        } catch (error) {
            console.error("Failed to delete user:", error);
            setErrorDialogOpen(true);
        } finally {
            setIsDeleting(false);
            setConfirmDialogOpen(false);
        }
    };

    const handleCancelDelete = () => {
        setConfirmDialogOpen(false);
    };

    const handleCloseSuccessDialog = () => {
        setSuccessDialogOpen(false);
    };

    const handleCloseErrorDialog = () => {
        setErrorDialogOpen(false);
    };
    return (
        <div className="space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>View Registered Users</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Success Dialog */}
                    <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                        <DialogContent>
                            <p className="text-sm">User deleted successfully!</p>
                            <Button onClick={handleCloseSuccessDialog} className="mt-4 w-full bg-green-600 text-white hover:bg-green-700">OK</Button>
                        </DialogContent>
                    </Dialog>

                    {/* Error Dialog */}
                    <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
                        <DialogContent>
                            <p className="text-sm">Failed to delete user. Please try again later.</p>
                            <Button onClick={handleCloseErrorDialog} className="mt-4 w-full bg-red-600 text-white hover:bg-red-700">OK</Button>
                        </DialogContent>
                    </Dialog>

                    {/* Confirmation Dialog */}
                    <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                        <DialogContent>
                            <p className="text-sm">Are you sure you want to delete this user?</p>
                            <div className="flex justify-end space-x-4 mt-4">
                                <Button variant="secondary" onClick={handleCancelDelete} className="w-32">Cancel</Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                    className="w-32 bg-red-600 text-white hover:bg-red-700"
                                >
                                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    {/* User Table */}
                    <div className="overflow-x-auto mt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-left">Username</TableHead>
                                    <TableHead className="text-left">Role</TableHead>
                                    <TableHead className="text-left">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.isArray(displayedUsers) && displayedUsers.length > 0 ? (
                                    displayedUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-gray-100">
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleOpenConfirmDialog(user.id)}
                                                >
                                                    Delete
                                                </Button>

                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="3" className="text-center text-gray-500">No users found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Show More / Show Less Button */}
                    <Button onClick={toggleShowMore} className="mt-4 bg-transparent text-blue-600 hover:bg-transparent hover:text-blue-800 flex items-center space-x-2">
                        {showMore ? (
                            <>
                                <span>Show Less</span>
                                <ChevronUp className="h-4 w-4" />
                            </>
                        ) : (
                            <>
                                <span>Show More</span>
                                <ChevronDown className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Edit User Dialog */}
            {selectedUser && (
                <EditUserDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    user={selectedUser}
                    onUserUpdate={() => loadUsers()} // Refresh user list after update
                />
            )}
        </div>
    );
};

export default ViewUser;
