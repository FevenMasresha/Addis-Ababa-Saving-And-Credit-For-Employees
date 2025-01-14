import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
export function Header({ title }) {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/'); // Navigate to the home page
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            <div className="flex items-center">
                <img
                    src={logo}
                    alt="Association Logo"
                    className="w-12 h-12 cursor-pointer rounded-full " // Adjust the size as needed
                    onClick={handleLogoClick} // Handle click to navigate
                />
            </div>
        </header>
    );
}
