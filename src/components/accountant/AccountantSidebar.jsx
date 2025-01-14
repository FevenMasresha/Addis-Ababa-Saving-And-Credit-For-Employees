import React from "react";
import {
    LayoutDashboard,
    Users,
    ArrowDownToLine,
    Eye,
    Calendar,
    MessageSquare,
} from "lucide-react";
import Sidebar from "../reusable/Sidebar";
import useAuthStore from "@/store/authStore";

const accountantSidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/accountant" },
    { name: "Register Customer", icon: Users, href: "/register-customer" },
    { name: "Transaction History", icon: ArrowDownToLine, href: "/transaction-history" },
    { name: "View Report", icon: Eye, href: "/accountant/view-report" },
    { name: "View Customer", icon: Users, href: "/accountant/view-customer" },
    { name: "View Meeting Date", icon: Calendar, href: "/view-meeting" },
    { name: "View Feedback", icon: MessageSquare, href: "/accountant/view-feedback" },
];

const AccountantSidebar = () => {
    const { user } = useAuthStore();

    const profile = {
        name: `${user?.fname || ""} ${user?.lname || ""}`.trim() || "Default Name",
        email: user?.username || "user",
        image: user?.profile_picture || "https://via.placeholder.com/40", // Use the profile image from auth or fallback to placeholder
    };


    return (
        <Sidebar
            profile={profile}
            panelTitle="Accountant Panel"
            sidebarItems={accountantSidebarItems}
        />
    );
};

export default AccountantSidebar;
