import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthStore from "@/store/authStore";
import useUserStore from "@/store/useUserStore";

const EditUserDialog = ({ isOpen, onClose, user, onUserUpdate }) => {
    const { editUser } = useUserStore((state) => state); // Using editUser from the user store
    const [formData, setFormData] = useState({ username: "", role: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = useAuthStore((state) => state.token); // Accessing the token from the auth store

    // Effect to set the initial form data when a user is selected for editing
    useEffect(() => {
        if (user) {
            setFormData({ username: user.username, role: user.role });
        }
    }, [user]);

    // Handle the form submit to update the user
    const handleSubmit = async () => {
        if (!token) {
            console.error("User not authenticated.");
            return;
        }

        setIsSubmitting(true);
        try {
            await editUser(user.id, formData); // Edit user using the store function
            onUserUpdate(); // Callback to refresh the list after update
            onClose(); // Close the dialog
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        label="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <Input
                        label="Role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                    <div className="flex justify-end space-x-4 mt-4">
                        <Button variant="secondary" onClick={onClose} className="w-32">
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleSubmit}
                            className="w-32 bg-blue-600 text-white hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Updating..." : "Update User"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditUserDialog;
