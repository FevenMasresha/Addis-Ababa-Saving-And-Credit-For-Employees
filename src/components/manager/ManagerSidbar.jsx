import React from 'react';
import { FileText, Calendar, Home, Users, Inbox, ArrowDownToLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useState } from "react";
import { Menu, ChevronLeft } from "lucide-react";
import Sidebar from '../reusable/Sidebar';
import useAuthStore from '@/store/authStore';

const sidebarItems = [
    { icon: Home, name: 'Overview', href: '/manager' },
    { icon: Users, name: 'Employees', href: '/manager/view-employee' },
    { name: "View Customer", icon: Users, href: "/manager/view-customers" },
    { icon: Calendar, name: 'Meetings', href: '/manager/view-meeting' },
    { icon: FileText, name: 'Reports', href: '/manager/view-report' },
    { icon: ArrowDownToLine, name: 'Transaction History', href: '/manager/view-transactions' },
    { icon: Inbox, name: 'Feedback', href: '/manager/view-feedback' },
];

export default function ManagerSidebar() {
    const { user } = useAuthStore(); // Get the user data from the store

    // If user is null, fallback to default or empty profile data
    const profile = {
        name: `${user?.fname || ""} ${user?.lname || ""}`.trim() || "Default Name",
        email: user?.username || "user",
        image: user?.profile_picture || "https://via.placeholder.com/40", // Use the profile image from auth or fallback to placeholder
    };


    return (
        <Sidebar
            profile={profile}
            panelTitle="Manager Panel"
            sidebarItems={sidebarItems}
        />
    );
}
