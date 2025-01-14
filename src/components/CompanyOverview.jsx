import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import { Header } from "./HomeHeader";
import about from '../assets/about.jpg';

export default function AssociationOverview() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > -1);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <>
            <div className="container mx-auto py-16 px-6">
                <Header isScrolled={isScrolled} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Section */}
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold my-9">Addis Ababa SAving And Credit  Association</h2>
                        <p className="text-gray-600 mb-6">
                            The Addis Ababa Saving and Credit Association for Employees (AA-SCAE) is a financial institution established in 2003 EC] to serve the saving and credit needs of employees in Addis Ababa. Since it’s founding the Addis Ababa Savings and Credit Association (AA S&CA) has been a beacon of financial empowerment for government employees in Addis Ababa. Operating as a non-profit organization, the AA S&CA prioritizes member well-being over maximizing profits. This commitment is reflected in the interest rate that is 7.5 percent for borrowers. In its years, the AA S&CA saw a staggering increase in membership, enrolling about 302 government employees. This surge can be attributed to two key factors. Firstly, the AA S&CA offered its member service in the dire time of high inflation rate in Ethiopia. Secondly, the Association addressed a critical need by introducing salary-deduction savings accounts with interest rates consistently 7.5 percent. This allowed members to grow their savings significantly. Additionally, the AA S&CA offered microloans with a remarkable repayment rate, featuring interest rates significantly lower than traditional lenders, making them a viable option for essential needs.                    </p>
                        <p className="text-gray-600 mb-6">
                            we have emerged from a growing recognition of the need for affordable financial services, access to savings opportunities, or loan options for employees. A group of dedicated individuals, employees themselves at that time that were only 20 in number, envisioned an organization that could empower employees by providing a safe place to save, offering competitive loan rates and fostering financial literacy. Over the years, the AA S&CA has experienced a steady growth and increasing membership]. This growth can be attributed to [commitment to member service, adaptation to changing needs.                    </p>
                    </div>

                    {/* Right Section */}
                    <div className="space-y-6  py-16">
                        <div className="relative">
                            <img
                                src={about}
                                alt="CreditSave Community"
                                className="rounded shadow-lg"
                            />
                            <p className="text-gray-500 mt-4 text-sm">
                                Empowering members with financial solutions tailored to their needs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vision, Mission, Core Values */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Vision */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">VISION</h3>
                        <p className="text-gray-600">
                            To become the leading savings and credit association, inspiring financial empowerment and fostering sustainable growth within our community.
                        </p>
                    </div>

                    {/* Mission */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">MISSION</h3>
                        <p className="text-gray-600">
                            Our mission is to promote financial well-being and economic empowerment for government employees in Addis Ababa specifically Addis Ababa city administration and for others. This mission is guided by the vision of becoming a reliable employee-focused financial institution in Addis Ababa. AA-SCAE offers services to its members, including Savings Accounts with Regular savings accounts and fixed deposit account also Loan Products salary-deduction loans, emergency loans, and product purchase loans.                    </p>
                    </div>

                    {/* Core Values */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">CORE VALUES</h3>
                        <p className="text-gray-600">
                            Transparency, integrity, and community focus guide everything we do to meet the diverse needs of our members.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
