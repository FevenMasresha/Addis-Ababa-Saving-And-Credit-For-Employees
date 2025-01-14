import React from 'react'
import { LayoutDashboard, Calendar, MessageSquare, ArrowDownToLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { useState } from "react";
import {
    Menu,
    ChevronLeft,
} from "lucide-react";
import Sidebar from '../reusable/Sidebar';
import useAuthStore from '@/store/authStore';

const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/loan-committee' },
    { name: 'View Feedback', icon: MessageSquare, href: '/loan-committee/view-feedback' },
    { name: 'View Meeting Dates', icon: Calendar, href: '/loan-committee/view-meeting' },
    { icon: ArrowDownToLine, name: 'Transaction History', href: '/loan-committee/view-transactions' },

]

export default function LoanCommiteeSidebar() {
    const { user } = useAuthStore();

    const profile = {
        name: `${user?.fname || ""} ${user?.lname || ""}`.trim() || "Default Name",
        email: user?.username || "user",
        image: user?.profile_picture || "https://via.placeholder.com/40", // Use the profile image from auth or fallback to placeholder
    };

    return (
        <Sidebar
            profile={profile}
            panelTitle="Loan Committee Panel"
            sidebarItems={sidebarItems}
        />
    );
}