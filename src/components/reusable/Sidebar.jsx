import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ChevronLeft, Lock, ChevronDown } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";
import { LogOut, Settings, Key, User, EyeOff, Eye } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Sidebar = ({ profile, panelTitle, sidebarItems }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeItem, setActiveItem] = useState(sidebarItems[0]?.name);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, clearAuthData } = useAuthStore();
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [current_Password, setCurrentPassword] = useState('');
    const [new_Password, setNewPassword] = useState('');
    const [confirm_Password, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(profile.image);

    const sucees_toast = (message) => toast.success(message);
    const error_toast = (message) => toast.error(message);

    const navigate = useNavigate();

    useEffect(() => {
        // Update local state when the user profile changes
        if (user?.profile_picture) {
            setProfileImage(user.profile_picture);
        }
    }, [user]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsExpanded(true); // Expand when width >= 768px
            } else {
                setIsExpanded(false); // Collapse when width < 768px
            }
        };

        // Attach resize event listener
        window.addEventListener("resize", handleResize);

        // Check initial window size
        handleResize();

        // Cleanup on unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const handleLogout = async () => {
        const token = localStorage.getItem('auth_token');
        try {
            const response = await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            localStorage.removeItem('auth_token');
            clearAuthData();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();

        setError(null);
        setSuccess(null);

        if (new_Password !== confirm_Password) {
            setError("New password and confirmation don't match.");
            return;
        }
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    current_password: current_Password,
                    new_password: new_Password,
                    new_password_confirmation: confirm_Password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setIsPasswordDialogOpen(false);
                sucees_toast("Password changed successfully");
            } else {
                error_toast(data.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Error during password change:', error);
            error_toast('An error occurred while changing the password.');
        } finally {
            setLoading(false);
        }
    };

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch('http://localhost:8000/api/profile', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                    // Update the profile image URL in the state
                    setProfileImage(data.profile_picture); // Update UI state with the new image

                    // Optionally, refetch the user's profile data here to ensure all fields are up to date
                    // Assuming there's an endpoint like `/api/user` to fetch the profile data:
                    const profileResponse = await fetch('http://localhost:8000/api/user', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        },
                    });

                    const profileData = await profileResponse.json();
                    if (profileResponse.ok) {
                        // Update profile data in state (e.g., setProfile)
                        setProfileImage(profileData.profile_picture); // Ensure you update profile or user state
                        sucees_toast("Profile picture updated successfully!");
                    } else {
                        error_toast(profileData.message || 'Error fetching updated profile data');
                    }
                } else {
                    error_toast(data.message || 'Error uploading image');
                }
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                error_toast('Error uploading profile picture');
            }
        }
    };

    const handleDeleteProfilePicture = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/profile', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setProfileImage(null);
                sucees_toast('Profile picture deleted successfully!');
            } else {
                error_toast(data.message || 'Error deleting profile picture');
            }
        } catch (error) {
            console.error('Error deleting profile picture:', error);
            error_toast('Error deleting profile picture');
        }
    };

    return (
        <aside
            className={`flex flex-col bg-gray-800 text-white h-screen transition-all duration-300 ${isExpanded ? "w-64" : "w-20"}`}
        >
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-3 px-4 py-6 bg-gray-900 border-b border-gray-700">
                <label htmlFor="profile-picture">
                    <img
                        src={profileImage || "/default-profile.png"}
                        alt="Profile"
                        className={`rounded-full cursor-pointer transition-all duration-300 ${isExpanded ? "w-16 h-16" : "w-12 h-12"}`}
                    />
                    <input
                        type="file"
                        id="profile-picture"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                    />
                </label>
                {isExpanded && (
                    <div className="text-center">

                        {/* <h2 className="text-sm font-semibold text-gray-200">{profile.name}</h2> */}
                        <p className="text-xs text-gray-400">{profile.email}</p>
                    </div>
                )}
            </div>

            {/* Header with toggle button */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
                {isExpanded && (
                    <span className="text-lg font-semibold text-gray-200">{panelTitle}</span>
                )}
                <button
                    className="text-gray-400 hover:text-gray-200 p-2"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Account Settings Dropdown */}
            <div className="mt-4 px-4">
                <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center gap-3 h-12 px-4 cursor-pointer ${isExpanded ? "justify-start" : "justify-center"} hover:bg-gray-700 text-gray-300`}
                >
                    <ChevronDown className="h-5 w-5" />
                    {isExpanded && <span className="text-sm">Account Settings</span>}
                </div>

                {isDropdownOpen && (
                    <div className="bg-gray-700 mt-2 rounded-md">
                        <div
                            onClick={() => setIsPasswordDialogOpen(true)}
                            className={`flex items-center gap-3 h-12 px-4 cursor-pointer ${isExpanded ? "justify-start" : "justify-center"} hover:bg-gray-600 text-gray-300`}
                        >
                            <Lock className="h-5 w-5" />
                            {isExpanded && <span className="text-sm">Change Password</span>}
                        </div>
                        {profileImage && (
                            <div

                                onClick={handleDeleteProfilePicture}
                                className={`flex items-center gap-3 h-12 px-4 cursor-pointer ${isExpanded ? "justify-start" : "justify-center"} hover:bg-gray-600 text-gray-300`}
                            >
                                <User className="h-5 w-5" />
                                Delete Profile
                            </div>
                        )}
                        <div
                            onClick={handleLogout}
                            className={`flex items-center gap-3 h-12 px-4 cursor-pointer ${isExpanded ? "justify-start" : "justify-center"} hover:bg-gray-600 text-gray-300`}
                        >
                            <LogOut className="h-5 w-5" />
                            {isExpanded && <span className="text-sm">Log Out</span>}
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation items */}
            <nav className="flex-1 mt-4">
                {sidebarItems.map((item) => (
                    <Link key={item.name} to={item.href} className="block">
                        <div
                            onClick={() => setActiveItem(item.name)}
                            className={`flex items-center gap-3 h-12 px-4 cursor-pointer ${activeItem === item.name
                                ? "bg-gray-700 text-white"
                                : "hover:bg-gray-700 text-gray-300"
                                } ${isExpanded ? "justify-start" : "justify-center"}`}
                        >
                            <item.icon className="h-5 w-5" />
                            {isExpanded && <span className="text-sm">{item.name}</span>}
                        </div>
                    </Link>
                ))}
            </nav>

            <Dialog.Root open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-6 w-full max-w-md">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Change Password</Dialog.Title>
                        <Dialog.Description className="mt-2 text-sm text-gray-500">
                            Enter your current password and a new password below.
                        </Dialog.Description>
                        <form onSubmit={handleChangePassword} className="mt-4">
                            {/* Current Password */}
                            <div className="mb-4 relative">
                                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                                    Current Password
                                </label>
                                <Input
                                    type={showCurrentPassword ? "text" : "password"}
                                    id="current-password"
                                    value={current_Password}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your current password"
                                    required
                                />
                                {/* Eye Icon */}
                                {showCurrentPassword ? (
                                    <EyeOff
                                        className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer"
                                        onClick={() => setShowCurrentPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer"
                                        onClick={() => setShowCurrentPassword(true)}
                                    />
                                )}
                            </div>

                            {/* New Password */}
                            <div className="mb-4 relative">
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    id="new-password"
                                    value={new_Password}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your new password"
                                    required
                                />
                                {/* Eye Icon */}
                                {showNewPassword ? (
                                    <EyeOff
                                        className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer"
                                        onClick={() => setShowNewPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer"
                                        onClick={() => setShowNewPassword(true)}
                                    />
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-6 relative">
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm-password"
                                    value={confirm_Password}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Confirm your new password"
                                    required
                                />
                                {/* Eye Icon */}
                                {showConfirmPassword ? (
                                    <EyeOff
                                        className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer"
                                        onClick={() => setShowConfirmPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer"
                                        onClick={() => setShowConfirmPassword(true)}
                                    />
                                )}
                            </div>

                            {/* Error or Success Messages */}
                            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                            {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

                            {/* Buttons */}
                            <div className="flex justify-between items-center">
                                <Button
                                    type="button"
                                    onClick={() => setIsPasswordDialogOpen(false)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-gray-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {loading ? "Changing..." : "Change Password"}
                                </Button>
                            </div>
                        </form>


                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </aside>
    );
};

export default Sidebar;
