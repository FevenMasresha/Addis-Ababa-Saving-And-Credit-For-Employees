

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card"; // Assuming you are using custom components like Card
import { PiggyBank, Users, DollarSign, Shield } from "lucide-react"; // Icons for visual appeal
import { Header } from "./HomeHeader";

export default function ServicesPage() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []); return (
        <>
            <div className="container mx-auto py-16 px-6  bg-gray-200">
                <Header isScrolled={isScrolled} />
                <h2 className="text-3xl font-bold text-center my-12">Our Services</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Loan Services */}
                    <Card>
                        <CardContent className="text-center">
                            <Users className="h-12 w-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Loan Applications</h3>
                            <p className="text-muted-foreground">
                                Apply for personal or business loans. Get quick approval and flexible terms.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Savings Plans */}
                    <Card>
                        <CardContent className="text-center">
                            <PiggyBank className="h-12 w-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Savings Plans</h3>
                            <p className="text-muted-foreground">
                                Choose from a variety of savings plans to suit your financial goals. Enjoy high returns on your savings.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Investment Opportunities */}
                    <Card>
                        <CardContent className="text-center">
                            <DollarSign className="h-12 w-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Investment Opportunities</h3>
                            <p className="text-muted-foreground">
                                Invest in secure and profitable opportunities designed for our members.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Member Benefits */}
                    <Card>
                        <CardContent className="text-center">
                            <Shield className="h-12 w-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Member Benefits</h3>
                            <p className="text-muted-foreground">
                                Enjoy exclusive benefits like lower loan rates, higher savings interest, and more.
                            </p>
                        </CardContent>
                    </Card>
                </div>
                {/* Contact Section */}
                <section className="mt-16 text-center">
                    <h3 className="text-2xl font-bold mb-4">Interested in Our Services?</h3>
                    <p className="mb-8">Get in touch with us today to learn more about how we can help you reach your financial goals.</p>

                </section>

            </div>
            <footer id="contact" className="bg-gray-800 text-white p-10">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Company Name */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">COMPANY NAME</h3>
                        <p className="text-sm text-gray-400">
                            Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>
                    </div>

                    {/* Column 2: Products */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">PRODUCTS</h3>
                        <ul className="text-sm space-y-2">
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    MDBootstrap
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    MDWordPress
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    BrandFlow
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    Bootstrap Angular
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">CONTACT</h3>
                        <ul className="text-sm space-y-2">
                            <li>
                                <span className="flex items-center">
                                    <span className="mr-2">📍</span> New York, NY 10012, US
                                </span>
                            </li>
                            <li>
                                <span className="flex items-center">
                                    <span className="mr-2">📧</span> info@gmail.com
                                </span>
                            </li>
                            <li>
                                <span className="flex items-center">
                                    <span className="mr-2">📞</span> +01 234 567 88
                                </span>
                            </li>
                            <li>
                                <span className="flex items-center">
                                    <span className="mr-2">📠</span> +01 234 567 89
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
        </>
    );
}
