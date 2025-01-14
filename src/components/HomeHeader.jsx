import { Link } from "react-router-dom"; // Updated import
import { Button } from "@/components/ui/button";
import logo from '../assets/logo.png';

export function Header({ isScrolled }) {
    const scrollToFooter = () => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${isScrolled ? "bg-blue-900 shadow" : "bg-transparent"
                }`}
        >
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                {/* Logo and Title */}
                <div className="flex items-center space-x-4">
                    <Link to="/">
                        <img src={logo} alt="AA-SCAE Logo" className="rounded-full h-14 w-14" />
                    </Link>
                    <Link
                        to="/"
                        className={`text-2xl font-bold ${isScrolled ? "text-white" : "text-white"}`}
                    >
                        AA-SCAE
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex space-x-6 text-white">
                    <Link
                        to="/about"
                        className={`text-2xl font-bold hover:underline ${isScrolled ? "text-white" : "text-white"}`}
                    >
                        About
                    </Link>
                    <Link
                        onClick={scrollToFooter}
                        className={`text-2xl font-bold hover:underline ${isScrolled ? "text-white" : "text-white"}`}
                    >
                        Contact Us
                    </Link>
                    <Link
                        to="/services"
                        className={`text-2xl font-bold hover:underline ${isScrolled ? "text-white" : "text-white"}`}
                    >
                        Services
                    </Link>
                </nav>

                {/* Right Section - Login Button */}
                <div className="space-x-2 flex items-center">
                    <Button variant="outline" asChild>
                        <Link to="/login">Log In</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
