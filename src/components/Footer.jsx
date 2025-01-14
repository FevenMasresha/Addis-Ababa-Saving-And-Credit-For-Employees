import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Footer() {

    return (
        <footer id="contact" className="bg-gray-800 text-white p-10">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Column 1: Company Name */}
                <div>
                    <h3 className="text-lg font-bold mb-4">AA-SCAE</h3>
                    <p className="text-sm text-gray-400">
                        Addis Ababa Saving And Credit Association
                    </p>
                </div>

                {/* Column 2: Products */}
                <div>
                    <h3 className="text-lg font-bold mb-4">PRODUCTS</h3>
                    <ul className="text-sm space-y-2">
                        <li>
                            <a href="#" className="hover:text-gray-300">
                                Saving
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-gray-300">
                                Loan Request
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-gray-300">

                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-gray-300">
                                Easy Withdrawal                            </a>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Contact */}
                <div>
                    <h3 className="text-lg font-bold mb-4">CONTACT</h3>
                    <ul className="text-sm space-y-2">
                        <li>
                            <span className="flex items-center">
                                <span className="mr-2">📍</span>Addis Ababa,Arada sub city worda 1
                            </span>
                        </li>
                        <li>
                            <span className="flex items-center">
                                <span className="mr-2">📧</span> negusushi@gmail.com
                            </span>
                        </li>
                        <li>
                            <span className="flex items-center">
                                <span className="mr-2">📞</span> 0911391034
                            </span>
                        </li>
                        <li>
                            <span className="flex items-center">
                                <span className="mr-2">🏢</span> Arada building floor 11
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Follow Us */}
                <div>
                    <h3 className="text-lg font-bold mb-4">FOLLOW US</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700">
                            F
                        </a>
                        <a href="#" className="bg-red-600 p-2 rounded-full hover:bg-red-700">
                            G
                        </a>
                        <a href="#" className="bg-pink-500 p-2 rounded-full hover:bg-pink-600">
                            I
                        </a>
                        <a href="#" className="bg-blue-500 p-2 rounded-full hover:bg-blue-600">
                            L
                        </a>
                        <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-gray-800">
                            D
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
                © 2023 Your Company. All rights reserved.
            </div>
        </footer>
    );
}

