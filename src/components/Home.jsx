import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, PiggyBank, Users, BarChart3, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom"; // Updated import
import { Header } from "./HomeHeader";
import headerImage from '../assets/image.png';
import { useEffect, useState } from "react";
import GalleryPage from "./Galary";
import Footer from "./Footer";

export default function Home() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                {/* Hero Section */}
                <section
                    className="relative bg-cover bg-center h-[600px] text-white"
                    style={{
                        backgroundImage: `url(${headerImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <Header isScrolled={isScrolled} />

                    {/* Content */}
                    <div className="text-blue relative container mx-auto flex flex-col justify-center items-center h-full z-10 text-center">
                        <h1 className="text-4xl font-bold mb-4">Welcome to AA-SCAE</h1>
                        <p className="text-xl mb-8">
                            Empowering your financial future through community savings and credit.
                        </p>
                        <Button size="lg" asChild aria-label="Get started with CreditSave" className="bg-white text-blue-500 hover:bg-gray-200 px-6 py-3 rounded shadow"
                        >
                            <Link to="/login">
                                Get Started <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                    </div>
                </section>
                {/* Features Section */}
                <section className="py-16 bg-muted">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature) => (
                                <FeatureCard
                                    key={feature.title}
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                />
                            ))}
                        </div>
                    </div>
                </section>
                <GalleryPage />

                {/* Testimonial Section */}
                <section className="py-16">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">What Our Members Say</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial) => (
                                <TestimonialCard
                                    key={testimonial.author}
                                    quote={testimonial.quote}
                                    author={testimonial.author}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-primary text-white py-16">
                    <div className="container mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Take Control of Your Finances?
                        </h2>
                        <p className="text-xl mb-8">
                            Join CreditSave today and start your journey towards financial empowerment.
                        </p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />

        </div >
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <Card>
            <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">{icon}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

function TestimonialCard({ quote, author }) {
    return (
        <Card>
            <CardContent className="p-6">
                <p className="italic mb-4">"{quote}"</p>
                <p className="font-semibold text-right">- {author}</p>
            </CardContent>
        </Card>
    );
}

const features = [
    {
        icon: <PiggyBank className="h-12 w-12 text-primary" />,
        title: "Easy Deposits",
        description: "Securely deposit funds into your account with just a few clicks.",
    },
    {
        icon: <Users className="h-12 w-12 text-primary" />,
        title: "Loan Requests",
        description: "Apply for loans and get quick approvals from our management team.",
    },
    {
        icon: <BarChart3 className="h-12 w-12 text-primary" />,
        title: "Financial Details",
        description: "Access details to track your savings and loan history.",
    },
    {
        icon: <MessageSquare className="h-12 w-12 text-primary" />,
        title: "Member Feedback",
        description: "Provide feedback and suggestions to improve our services.",
    },
];

const testimonials = [
    {
        quote:
            "CreditSave has transformed the way I manage my finances. The loan process is smooth, and the community support is incredible.",
        author: "Sarah J.",
    },
    {
        quote:
            "As a manager, I find the reporting tools invaluable. It's never been easier to oversee our association's financial health.",
        author: "Michael T.",
    },
    {
        quote:
            "The user-friendly interface and responsive customer service make CreditSave stand out from other financial platforms.",
        author: "Emily R.",
    },
];
