import { Link } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, MessageSquare, Calendar } from 'lucide-react'
import { Menu, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from 'react';
import Sidebar from '../reusable/Sidebar';
import useAuthStore from '@/store/authStore';
const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'View User', icon: Users, href: '/admin/view-user' },
    { name: 'View Log File', icon: FileText, href: '/admin/view-log' },
    { name: 'View Feedback', icon: MessageSquare, href: '/admin/view-feedback' },
    { name: 'View Meeting Date', icon: Calendar, href: '/admin/view-meeting' },
]

export default function AdminSidebar() {
    const { user } = useAuthStore();

    const profile = {
        name: `${user?.fname || ""} ${user?.lname || ""}`.trim() || "Default Name",
        email: user?.username || "user",
        image: user?.profile_picture || "https://via.placeholder.com/40", // Use the profile image from auth or fallback to placeholder
    };


    return (
        <Sidebar
            profile={profile}
            panelTitle="Admin Panel"
            sidebarItems={sidebarItems}
        />
    );
}








