import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface Testimonial {
    id: number;
    name: string;
    location: string;
    rating: number;
    text: string;
    avatar: string;
}

interface Room {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
}

interface Amenity {
    id: number;
    name: string;
    description: string;
    icon: string;
}

interface GalleryImage {
    id: number;
    title: string;
    image: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Sarah Mitchell",
        location: "New York, USA",
        rating: 5,
        text: "An absolutely unforgettable experience. The attention to detail and personalized service made our anniversary celebration truly magical.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
        id: 2,
        name: "James Anderson",
        location: "London, UK",
        rating: 5,
        text: "From the moment we arrived, we were treated like royalty. The spa treatments were divine and the rooms are simply stunning.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
        id: 3,
        name: "Emma Thompson",
        location: "Sydney, Australia",
        rating: 5,
        text: "The perfect escape from the everyday. Impeccable design, world-class dining, and a level of comfort beyond compare.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
];

const rooms: Room[] = [
    {
        id: 1,
        name: "Deluxe King Suite",
        description: "Spacious elegance with panoramic views, featuring a king-size bed with premium linens and a marble ensuite bathroom.",
        price: "$450",
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
    },
    {
        id: 2,
        name: "Ocean View Room",
        description: "Wake to breathtaking ocean vistas in this serene retreat, complete with a private balcony and contemporary furnishings.",
        price: "$380",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    },
    {
        id: 3,
        name: "Garden Pavilion",
        description: "A tranquil sanctuary surrounded by lush landscaping, featuring an outdoor soaking tub and private garden access.",
        price: "$520",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
    },
    {
        id: 4,
        name: "Presidential Suite",
        description: "The pinnacle of luxury living with separate living and dining areas, butler service, and exclusive amenities.",
        price: "$850",
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
    },
];

const amenities: Amenity[] = [
    {
        id: 1,
        name: "Serenity Spa",
        description: "Rejuvenating treatments and holistic therapies in our award-winning spa",
        icon: "spa",
    },
    {
        id: 2,
        name: "Infinity Pool",
        description: "A stunning outdoor pool with panoramic views and poolside service",
        icon: "pool",
    },
    {
        id: 3,
        name: "Fine Dining",
        description: "Culinary excellence featuring locally sourced ingredients and world-class chefs",
        icon: "restaurant",
    },
    {
        id: 4,
        name: "Fitness Center",
        description: "State-of-the-art equipment and personal training services",
        icon: "fitness",
    },
    {
        id: 5,
        name: "Concierge",
        description: "Personalized assistance for all your travel and leisure needs",
        icon: "concierge",
    },
    {
        id: 6,
        name: "Private Beach",
        description: "Exclusive beach access with sun loungers and water activities",
        icon: "beach",
    },
];

const galleryImages: GalleryImage[] = [
    { id: 1, title: "Hotel Exterior", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop" },
    { id: 2, title: "Lobby", image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=400&fit=crop" },
    { id: 3, title: "Pool Area", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop" },
    { id: 4, title: "Restaurant", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop" },
    { id: 5, title: "Spa Treatment", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop" },
    { id: 6, title: "Beach Sunset", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop" },
];

const AmenityIcon = ({ type }: { type: string }) => {
    const icons: Record<string, JSX.Element> = {
        spa: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
                <circle cx="9" cy="9" r="1" fill="currentColor" />
                <circle cx="15" cy="9" r="1" fill="currentColor" />
            </svg>
        ),
        pool: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 12h20M2 12c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3zM8 12c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3zM14 12c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3z" strokeLinecap="round" />
            </svg>
        ),
        restaurant: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        fitness: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6.5 6.5a2 2 0 013 0l8.5 8.5a2 2 0 01-3 3l-8.5-8.5a2 2 0 010-3z" />
                <path d="M3 3l4 4M21 21l-4-4M17 17l-2-2M7 7l-2-2" strokeLinecap="round" />
            </svg>
        ),
        concierge: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2a5 5 0 015 5c0 4-5 11-5 11s-5-7-5-11a5 5 0 015-5z" />
                <circle cx="12" cy="9" r="2.5" />
            </svg>
        ),
        beach: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                <circle cx="8" cy="14" r="1" fill="currentColor" />
                <circle cx="16" cy="10" r="1" fill="currentColor" />
                <circle cx="12" cy="15" r="1" fill="currentColor" />
            </svg>
        ),
    };

    return icons[type] || null;
};

const useScrollAnimation = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
};

const AnimatedSection = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
};

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-[#C9A962]' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

export default function Welcome() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: '',
        roomType: '',
        message: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Head title="StayEase Hotel | Where Comfort Meets Elegance">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
            </Head>

            <div className="font-sans antialiased">
                <style>{`
                    html {
                        scroll-behavior: smooth;
                    }
                    body {
                        font-family: 'Inter', sans-serif;
                        background-color: #FDFCF9;
                        color: #2D2D2D;
                    }
                    .font-serif {
                        font-family: 'Cormorant Garamond', serif;
                    }
                    .text-gold {
                        color: #C9A962;
                    }
                    .bg-cream {
                        background-color: #FDFCF9;
                    }
                    .bg-cream-dark {
                        background-color: #F5F0E8;
                    }
                    .bg-charcoal {
                        background-color: #2D2D2D;
                    }
                    .border-gold {
                        border-color: #C9A962;
                    }
                    ::-webkit-scrollbar {
                        width: 8px;
                    }
                    ::-webkit-scrollbar-track {
                        background: #F5F0E8;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #C9A962;
                        border-radius: 4px;
                    }
                `}</style>

                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFCF9]/95 backdrop-blur-sm border-b border-[#E8E2D9]">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <div className="flex items-center justify-between h-20">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-serif font-semibold text-charcoal">StayEase</span>
                                <span className="text-2xl font-serif text-gold">Hotel</span>
                            </div>

                            <div className="hidden md:flex items-center gap-10">
                                {['About', 'Rooms', 'Amenities', 'Gallery', 'Testimonials', 'Contact'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => scrollToSection(item.toLowerCase())}
                                        className="text-sm tracking-wide text-[#5C5C5C] hover:text-[#C9A962] transition-colors duration-300"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => scrollToSection('contact')}
                                className="px-6 py-2.5 bg-[#2D2D2D] text-white text-sm tracking-wider rounded-full hover:bg-[#C9A962] transition-all duration-300"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&h=1080&fit=crop)',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-[#2D2D2D]/40 via-[#2D2D2D]/20 to-[#2D2D2D]/60" />
                    </div>

                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                        <div className="mb-6 flex items-center justify-center gap-3">
                            <div className="w-12 h-[1px] bg-[#C9A962]" />
                            <span className="text-[#C9A962] text-sm tracking-[0.3em] uppercase">Welcome to</span>
                            <div className="w-12 h-[1px] bg-[#C9A962]" />
                        </div>

                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-light mb-6 leading-tight">
                            StayEase <span className="text-[#C9A962]">Hotel</span>
                        </h1>

                        <p className="text-white/90 text-lg md:text-xl tracking-wide mb-10 font-light">
                            Where Comfort Meets Elegance
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => scrollToSection('contact')}
                                className="px-10 py-4 bg-[#C9A962] text-white text-sm tracking-[0.2em] rounded-full hover:bg-white hover:text-[#2D2D2D] transition-all duration-300"
                            >
                                Book Your Stay
                            </button>
                            <button
                                onClick={() => scrollToSection('about')}
                                className="px-10 py-4 border border-white/50 text-white text-sm tracking-[0.2em] rounded-full hover:bg-white hover:text-[#2D2D2D] transition-all duration-300"
                            >
                                Discover More
                            </button>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-24 lg:py-32 bg-cream">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <AnimatedSection>
                                <div className="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=1000&fit=crop"
                                        alt="Hotel Interior"
                                        className="w-full h-[500px] object-cover rounded-lg shadow-xl"
                                    />
                                    <div className="absolute -bottom-8 -right-8 bg-[#C9A962] text-white p-8 rounded-lg shadow-xl hidden md:block">
                                        <p className="font-serif text-4xl font-light">25+</p>
                                        <p className="text-sm tracking-wider mt-1">Years of Excellence</p>
                                    </div>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={200}>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="w-12 h-[1px] bg-[#C9A962]" />
                                    <span className="text-[#C9A962] text-sm tracking-[0.2em] uppercase">Our Story</span>
                                </div>

                                <h2 className="font-serif text-4xl lg:text-5xl text-[#2D2D2D] mb-8 leading-tight">
                                    A Legacy of <span className="text-gold">Refined</span> Hospitality
                                </h2>

                                <p className="text-[#5C5C5C] leading-relaxed mb-6">
                                    Nestled in the heart of a breathtaking coastal paradise, StayEase Hotel has been the epitome of luxury accommodation since 1998. Our commitment to excellence has earned us recognition as one of the world's premier boutique hotels.
                                </p>

                                <p className="text-[#5C5C5C] leading-relaxed mb-8">
                                    Every corner of our hotel reflects a harmonious blend of contemporary elegance and timeless sophistication. From the meticulously curated artwork adorning our walls to the hand-selected fabrics in each room, we have crafted an environment where luxury is not just experienced, but felt in every moment.
                                </p>

                                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[#E8E2D9]">
                                    <div>
                                        <p className="font-serif text-3xl text-[#C9A962]">98</p>
                                        <p className="text-sm text-[#5C5C5C] mt-1">Guest Rooms</p>
                                    </div>
                                    <div>
                                        <p className="font-serif text-3xl text-[#C9A962]">12</p>
                                        <p className="text-sm text-[#5C5C5C] mt-1">Suites</p>
                                    </div>
                                    <div>
                                        <p className="font-serif text-3xl text-[#C9A962]">5</p>
                                        <p className="text-sm text-[#5C5C5C] mt-1">Restaurants</p>
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Rooms & Suites Section */}
                <section id="rooms" className="py-24 lg:py-32 bg-[#F5F0E8]">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <AnimatedSection>
                            <div className="text-center mb-16">
                                <div className="mb-4 flex items-center justify-center gap-3">
                                    <div className="w-12 h-[1px] bg-[#C9A962]" />
                                    <span className="text-[#C9A962] text-sm tracking-[0.2em] uppercase">Accommodations</span>
                                    <div className="w-12 h-[1px] bg-[#C9A962]" />
                                </div>
                                <h2 className="font-serif text-4xl lg:text-5xl text-[#2D2D2D]">
                                    Rooms & <span className="text-gold">Suites</span>
                                </h2>
                            </div>
                        </AnimatedSection>

                        <div className="grid md:grid-cols-2 gap-8">
                            {rooms.map((room, index) => (
                                <AnimatedSection key={room.id} delay={index * 150}>
                                    <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                                        <div className="relative overflow-hidden h-72">
                                            <img
                                                src={room.image}
                                                alt={room.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                                                <span className="font-serif text-xl text-[#C9A962]">{room.price}</span>
                                                <span className="text-xs text-[#5C5C5C]">/night</span>
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <h3 className="font-serif text-2xl text-[#2D2D2D] mb-3 group-hover:text-[#C9A962] transition-colors duration-300">
                                                {room.name}
                                            </h3>
                                            <p className="text-[#5C5C5C] leading-relaxed mb-6">
                                                {room.description}
                                            </p>
                                            <button className="inline-flex items-center gap-2 text-[#C9A962] text-sm tracking-wider hover:gap-4 transition-all duration-300">
                                                View Details
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Amenities Section */}
                <section id="amenities" className="py-24 lg:py-32 bg-cream">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <AnimatedSection>
                            <div className="text-center mb-16">
                                <div className="mb-4 flex items-center justify-center gap-3">
                                    <div className="w-12 h-[1px] bg-[#C9A962]" />
                                    <span className="text-[#C9A962] text-sm tracking-[0.2em] uppercase">Features</span>
                                    <div className="w-12 h-[1px] bg-[#C9A962]" />
                                </div>
                                <h2 className="font-serif text-4xl lg:text-5xl text-[#2D2D2D]">
                                    World-Class <span className="text-gold">Amenities</span>
                                </h2>
                            </div>
                        </AnimatedSection>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            {amenities.map((amenity, index) => (
                                <AnimatedSection key={amenity.id} delay={index * 100}>
                                    <div className="group bg-white rounded-xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-500">
                                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#C9A962] group-hover:bg-[#C9A962] group-hover:text-white transition-all duration-300">
                                            <AmenityIcon type={amenity.icon} />
                                        </div>
                                        <h3 className="font-serif text-xl text-[#2D2D2D] mb-3 group-hover:text-[#C9A962] transition-colors duration-300">
                                            {amenity.name}
                                        </h3>
                                        <p className="text-sm text-[#5C5C5C] leading-relaxed">
                                            {amenity.description}
                                        </p>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section id="gallery" className="py-24 lg:py-32 bg-[#F5F0E8]">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <AnimatedSection>
                            <div className="text-center mb-16">
                                <div className="mb-4 flex items-center justify-center gap-3">
                                    <div className="w-12 h-[1px] bg-[#C9A962]" />
                                    <span className="text-[#C9A962] text-sm tracking-[0.2em] uppercase">Visual Journey</span>
                                    <div className="w-12 h-[1px] bg-[#C9A962]" />
                                </div>
                                <h2 className="font-serif text-4xl lg:text-5xl text-[#2D2D2D]">
                                    Our <span className="text-gold">Gallery</span>
                                </h2>
                            </div>
                        </AnimatedSection>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {galleryImages.map((image, index) => (
                                <AnimatedSection key={image.id} delay={index * 100}>
                                    <div className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer">
                                        <img
                                            src={image.image}
                                            alt={image.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-[#2D2D2D]/0 group-hover:bg-[#2D2D2D]/50 transition-all duration-300 flex items-center justify-center">
                                            <span className="text-white font-serif text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                {image.title}
                                            </span>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-24 lg:py-32 bg-cream">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <AnimatedSection>
                            <div className="text-center mb-16">
                                <div className="mb-4 flex items-center justify-center gap-3">
                                    <div className="w-12 h-[1px] bg-[#C9A962]" />
                                    <span className="text-[#C9A962] text-sm tracking-[0.2em] uppercase">Testimonials</span>
                                    <div className="w-12 h-[1px] bg-[#C9A962]" />
                                </div>
                                <h2 className="font-serif text-4xl lg:text-5xl text-[#2D2D2D]">
                                    Guest <span className="text-gold">Experiences</span>
                                </h2>
                            </div>
                        </AnimatedSection>

                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <AnimatedSection key={testimonial.id} delay={index * 150}>
                                    <div className="bg-white rounded-xl p-8 shadow-lg relative">
                                        <div className="absolute -top-4 left-8">
                                            <svg className="w-8 h-8 text-[#C9A962]" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                            </svg>
                                        </div>
                                        <div className="pt-6">
                                            <StarRating rating={testimonial.rating} />
                                            <p className="text-[#5C5C5C] leading-relaxed mt-6 mb-6 italic">
                                                "{testimonial.text}"
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={testimonial.avatar}
                                                    alt={testimonial.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-[#2D2D2D]">{testimonial.name}</p>
                                                    <p className="text-sm text-[#5C5C5C]">{testimonial.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Location Section */}
                <section id="location" className="py-24 lg:py-32 bg-[#F5F0E8]">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <AnimatedSection>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="w-12 h-[1px] bg-[#C9A962]" />
                                    <span className="text-[#C9A962] text-sm tracking-[0.2em] uppercase">Find Us</span>
                                </div>
                                <h2 className="font-serif text-4xl lg:text-5xl text-[#2D2D2D] mb-8">
                                    Our <span className="text-gold">Location</span>
                                </h2>
                                <p className="text-[#5C5C5C] leading-relaxed mb-8">
                                    Ideally situated along the pristine coastline, StayEase Hotel offers easy access to the region's most beautiful beaches, cultural attractions, and natural wonders.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#C9A962]/10 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-[#C9A962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#2D2D2D]">Address</p>
                                            <p className="text-[#5C5C5C]">123 Coastal Boulevard, Paradise Bay<br />Maldives 20077</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#C9A962]/10 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-[#C9A962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#2D2D2D]">Phone</p>
                                            <p className="text-[#5C5C5C]">+960 123 4567</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#C9A962]/10 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-[#C9A962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#2D2D2D]">Email</p>
                                            <p className="text-[#5C5C5C]">reservations@stayease.com</p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={200}>
                                <div className="bg-white rounded-xl overflow-hidden shadow-xl h-[400px] lg:h-[500px]">
                                    <div className="w-full h-full bg-[#E8E2D9] flex items-center justify-center">
                                        <div className="text-center">
                                            <svg className="w-16 h-16 mx-auto text-[#C9A962] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                            <p className="text-[#5C5C5C]">Interactive Map</p>
                                            <p className="text-sm text-[#5C5C5C]">123 Coastal Boulevard</p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Contact / Booking Section */}
                <section id="contact" className="py-24 lg:py-32 bg-charcoal">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <div className="grid lg:grid-cols-2 gap-16">
                            <AnimatedSection>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="w-12 h-[1px] bg-[#C9A962]" />
                                    <span className="text-[#C9A962] text-sm tracking-[0.2em] uppercase">Reservations</span>
                                </div>
                                <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6">
                                    Book Your <span className="text-[#C9A962]">Stay</span>
                                </h2>
                                <p className="text-white/70 leading-relaxed mb-8">
                                    Begin your journey to relaxation and luxury. Fill out the form and our dedicated team will craft a personalized experience just for you.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#C9A962]/10 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-[#C9A962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-white/50 text-sm">24/7 Support</p>
                                            <p className="text-white">+960 123 4567</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#C9A962]/10 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-[#C9A962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-white/50 text-sm">Email Us</p>
                                            <p className="text-white">reservations@stayease.com</p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={200}>
                                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-2xl">
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm text-[#5C5C5C] mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-[#F5F0E8] rounded-lg border border-transparent focus:border-[#C9A962] focus:outline-none transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[#5C5C5C] mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-[#F5F0E8] rounded-lg border border-transparent focus:border-[#C9A962] focus:outline-none transition-colors"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm text-[#5C5C5C] mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-[#F5F0E8] rounded-lg border border-transparent focus:border-[#C9A962] focus:outline-none transition-colors"
                                                placeholder="+1 234 567 890"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[#5C5C5C] mb-2">Room Type</label>
                                            <select
                                                name="roomType"
                                                value={formData.roomType}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-[#F5F0E8] rounded-lg border border-transparent focus:border-[#C9A962] focus:outline-none transition-colors"
                                            >
                                                <option value="">Select a room</option>
                                                <option value="deluxe">Deluxe King Suite</option>
                                                <option value="ocean">Ocean View Room</option>
                                                <option value="garden">Garden Pavilion</option>
                                                <option value="presidential">Presidential Suite</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm text-[#5C5C5C] mb-2">Check In</label>
                                            <input
                                                type="date"
                                                name="checkIn"
                                                value={formData.checkIn}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-[#F5F0E8] rounded-lg border border-transparent focus:border-[#C9A962] focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[#5C5C5C] mb-2">Check Out</label>
                                            <input
                                                type="date"
                                                name="checkOut"
                                                value={formData.checkOut}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-[#F5F0E8] rounded-lg border border-transparent focus:border-[#C9A962] focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[#5C5C5C] mb-2">Guests</label>
                                            <input
                                                type="number"
                                                name="guests"
                                                value={formData.guests}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-[#F5F0E8] rounded-lg border border-transparent focus:border-[#C9A962] focus:outline-none transition-colors"
                                                placeholder="2"
                                                min="1"
                                                max="10"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm text-[#5C5C5C] mb-2">Special Requests</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-3 bg-[#F5F0E8] rounded-lg border border-transparent focus:border-[#C9A962] focus:outline-none transition-colors resize-none"
                                            placeholder="Any special requirements or requests..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-[#C9A962] text-white text-sm tracking-[0.2em] rounded-full hover:bg-[#2D2D2D] transition-all duration-300"
                                    >
                                        Request Reservation
                                    </button>
                                </form>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#1a1a1a] py-16">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <div className="grid md:grid-cols-4 gap-12 mb-12">
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-2xl font-serif font-semibold text-white">StayEase</span>
                                    <span className="text-2xl font-serif text-[#C9A962]">Hotel</span>
                                </div>
                                <p className="text-white/60 leading-relaxed max-w-md">
                                    Experience the pinnacle of luxury hospitality where every detail is crafted to perfection. Your journey to elegance begins here.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-4">Quick Links</h4>
                                <ul className="space-y-2">
                                    {['About', 'Rooms', 'Dining', 'Spa', 'Contact'].map((item) => (
                                        <li key={item}>
                                            <button
                                                onClick={() => scrollToSection(item.toLowerCase())}
                                                className="text-white/60 hover:text-[#C9A962] transition-colors text-sm"
                                            >
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-4">Connect</h4>
                                <div className="flex gap-4">
                                    {['facebook', 'instagram', 'twitter'].map((social) => (
                                        <a
                                            key={social}
                                            href="#"
                                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A962] transition-colors"
                                        >
                                            <span className="sr-only">{social}</span>
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-white/40 text-sm">
                                © 2024 StayEase Hotel. All rights reserved.
                            </p>
                            <div className="flex gap-6">
                                <a href="#" className="text-white/40 hover:text-[#C9A962] text-sm transition-colors">Privacy Policy</a>
                                <a href="#" className="text-white/40 hover:text-[#C9A962] text-sm transition-colors">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}