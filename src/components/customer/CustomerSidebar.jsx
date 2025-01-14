import React from 'react'
import { LayoutDashboard, Send, Eye, FileText, MessageSquare, Calendar, Key } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import Sidebar from '../reusable/Sidebar'
import useAuthStore from '@/store/authStore'

const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/customer' },
    { name: 'Send Request', icon: Send, href: '/customer/send-request' },
    { name: 'Send Feedback', icon: MessageSquare, href: '/customer/send-feedback' },
    { name: 'Transactions', icon: Calendar, href: '/customer/my-transactions' },
    { name: 'View Meeting Dates', icon: Calendar, href: '/customer/view-meeting' },
]

export default function CustomerSidebar() {
    const { user } = useAuthStore();

    const profile = {
        name: `${user?.fname || ""} ${user?.lname || ""}`.trim() || "Default Name",
        email: user?.username || "user",
        image: user?.profile_picture || "https://via.placeholder.com/40", // Use the profile image from auth or fallback to placeholder
    };

    return (
        <Sidebar
            profile={profile}
            panelTitle="Customer Panel"
            sidebarItems={sidebarItems}
        />
    );
}