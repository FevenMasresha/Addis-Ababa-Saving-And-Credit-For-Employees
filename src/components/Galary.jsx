import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import conference from '../assets/conference.jpg';
import meeting from '../assets/meeting.jpg';
import empowering from '../assets/empowering.jpg';
import workshop from '../assets/workshop.jpg';

// Custom Arrow Components
const NextArrow = ({ onClick }) => (
    <div
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
        onClick={onClick}
    >
        →
    </div>
);

const PrevArrow = ({ onClick }) => (
    <div
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
        onClick={onClick}
    >
        ←
    </div>
);

export default function GalleryPage() {
    const images = [
        {
            src: conference,
            caption: "Community Event 2023",
        },
        {
            src: meeting,
            caption: "Members Meeting",
        },
        {
            src: workshop,
            caption: "Savings and Credit Workshop",
        },
        {
            src: empowering,
            caption: "Empowering Members",
        },
    ];

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        draggable: true, // Enables dragging with a mouse
        autoplay: true, // Enables auto-sliding
        autoplaySpeed: 3000, // Auto-slide every 3 seconds
        pauseOnHover: true, // Pause auto-slide on hover
        responsive: [
            {
                breakpoint: 768, // Adjust for tablets
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480, // Adjust for mobile
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="container mx-auto py-16 px-6">
            <h2 className="text-3xl font-bold text-center ml-8 mb-8">Gallery</h2>
            <div className="relative">
                <Slider {...sliderSettings}>
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            {/* Image */}
                            <img
                                src={image.src}
                                alt={image.caption}
                                className="rounded p-6 shadow-lg w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Hover Caption */}
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white text-lg font-semibold">{image.caption}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

