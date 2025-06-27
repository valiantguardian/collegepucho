"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Define the interface for testimonial data
interface Testimonial {
  image: string;
  name: string;
  review: string;
}

const testimonialData: Testimonial[] = [
  {
    image: "/thumb.webp",
    name: "Amit Sharma",
    review:
      "collegepucho.com has been a lifesaver for me. I was able to find the perfect college match for my career goals. Highly recommend!",
  },
  {
    image: "/thumb.webp",
    name: "Priya Patel",
    review:
      "I'm impressed by the range of colleges available on collegepucho.com. It made finding the right college a breeze.",
  },
  {
    image: "/thumb.webp",
    name: "Vikram Singh",
    review:
      "collegepucho.com helped me streamline my college search process. I'm grateful for their guidance and support.",
  },
  {
    image: "/thumb.webp",
    name: "Sneha Gupta",
    review:
      "collegepucho.com helped me streamline my college search process. I'm grateful for their guidance and support.",
  },
  {
    image: "/thumb.webp",
    name: "Ravi Kumar",
    review:
      "collegepucho.com is a game-changer for college aspirants. It's a one-stop solution for all your college search needs.",
  },
  {
    image: "/thumb.webp",
    name: "Anjali Desai",
    review:
      "Using collegepucho.com was a wise decision. I found my dream college with ease, thanks to their comprehensive database.",
  },
  {
    image: "/thumb.webp",
    name: "Karan Mehta",
    review:
      "My experience with collegepucho.com was fantastic. The platform is user-friendly, and the support team is very helpful.",
  },
  {
    image: "/thumb.webp",
    name: "Nisha Yadav",
    review:
      "I highly recommend collegepucho.com to anyone looking for colleges in India. It's a reliable and efficient platform.",
  },
  {
    image: "/thumb.webp",
    name: "Arjun Reddy",
    review:
      "collegepucho.com has been a lifesaver for me. I was able to find the perfect college match for my career goals. Highly recommend!",
  },
  {
    image: "/thumb.webp",
    name: "Meera Joshi",
    review:
      "My experience with collegepucho.com was fantastic. The platform is user-friendly, and the support team is very helpful.",
  },
  {
    image: "/thumb.webp",
    name: "Siddharth Nair",
    review:
      "I found collegepucho.com extremely helpful in my college search. The information provided is accurate and up-to-date.",
  },
  {
    image: "/thumb.webp",
    name: "Pooja Malhotra",
    review:
      "collegepucho.com made it easy for me to explore different colleges and courses. I'm thankful for their platform.",
  },
  {
    image: "/thumb.webp",
    name: "Aditya Rana",
    review:
      "I recommend collegepucho.com to all college aspirants. It's a great resource for finding the right college.",
  },
  {
    image: "/thumb.webp",
    name: "Riya Saxena",
    review:
      "My college search became much simpler with collegepucho.com. I'm happy with the results I got from the platform.",
  },
  {
    image: "/thumb.webp",
    name: "Manish Thakur",
    review:
      "collegepucho.com helped me discover colleges I hadn't considered before. It broadened my options and helped me make a better decision.",
  },
  {
    image: "/thumb.webp",
    name: "Kavita Bhatt",
    review:
      "I highly recommend collegepucho.com to anyone looking for colleges in India. It's a reliable and efficient platform.",
  },
  {
    image: "/thumb.webp",
    name: "Rohit Aggarwal",
    review:
      "I'm grateful for collegepucho.com's support in my college search. The platform is easy to use and provides valuable information.",
  },
  {
    image: "/thumb.webp",
    name: "Ananya Mishra",
    review:
      "collegepucho.com exceeded my expectations. I found the perfect college match with their help.",
  },
  {
    image: "/thumb.webp",
    name: "Suresh Iyer",
    review:
      "I recommend collegepucho.com to anyone looking for colleges. It's a comprehensive platform with accurate information.",
  },
  {
    image: "/thumb.webp",
    name: "Divya Kulkarni",
    review:
      "My experience with collegepucho.com was excellent. I found all the information I needed for my college search.",
  },
  {
    image: "/thumb.webp",
    name: "Vijay Chauhan",
    review:
      "collegepucho.com is a must-visit for anyone exploring college options. It's a reliable and informative platform.",
  },
  {
    image: "/thumb.webp",
    name: "Tanya Roy",
    review:
      "I'm impressed by collegepucho.com's database of colleges. It made my college search much easier.",
  },
];

const StarRating = () => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className="w-3.5 h-3.5 text-[#37E2D5] transition-transform duration-300 transform group-hover:scale-110"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="group bg-[#1A1A8F] rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-main/10 border border-transparent hover:border-primary-main/20">
    <div className="flex items-center gap-3 mb-3">
      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#37E2D5] group-hover:border-[#37E2D5]/80 transition-colors duration-300">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <h4 className="text-white font-medium text-sm group-hover:text-[#37E2D5] transition-colors duration-300">
          {testimonial.name}
        </h4>
        <StarRating />
      </div>
    </div>
    <p className="text-gray-300 text-sm leading-relaxed mt-3 line-clamp-4 group-hover:text-white transition-colors duration-300">
      {testimonial.review}
    </p>
  </div>
);

const Testimonials = () => {
  const firstColumnRef = useRef<HTMLDivElement>(null);
  const secondColumnRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    const firstColumn = firstColumnRef.current;
    const secondColumn = secondColumnRef.current;

    if (!firstColumn || !secondColumn) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const scrollAmount = e.deltaY;
      const firstColumnMax = firstColumn.scrollHeight - firstColumn.clientHeight;
      const secondColumnMax = secondColumn.scrollHeight - secondColumn.clientHeight;

      // Calculate new scroll positions
      const newFirstScroll = Math.min(Math.max(0, firstColumn.scrollTop + scrollAmount), firstColumnMax);
      const newSecondScroll = secondColumnMax - newFirstScroll;

      // Apply scroll positions
      firstColumn.scrollTop = newFirstScroll;
      secondColumn.scrollTop = newSecondScroll;
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      
      if (touchStartRef.current === null) return;
      
      const deltaY = touchStartRef.current - e.touches[0].clientY;
      touchStartRef.current = e.touches[0].clientY;
      
      const firstColumnMax = firstColumn.scrollHeight - firstColumn.clientHeight;
      const secondColumnMax = secondColumn.scrollHeight - secondColumn.clientHeight;

      // Calculate new scroll positions
      const newFirstScroll = Math.min(Math.max(0, firstColumn.scrollTop + deltaY), firstColumnMax);
      const newSecondScroll = secondColumnMax - newFirstScroll;

      // Apply scroll positions
      firstColumn.scrollTop = newFirstScroll;
      secondColumn.scrollTop = newSecondScroll;
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
    };

    // Add event listeners to both columns
    [firstColumn, secondColumn].forEach(column => {
      column.addEventListener('wheel', handleWheel, { passive: false });
      column.addEventListener('touchstart', handleTouchStart, { passive: true });
      column.addEventListener('touchmove', handleTouchMove, { passive: false });
      column.addEventListener('touchend', handleTouchEnd);
    });

    return () => {
      [firstColumn, secondColumn].forEach(column => {
        column.removeEventListener('wheel', handleWheel);
        column.removeEventListener('touchstart', handleTouchStart);
        column.removeEventListener('touchmove', handleTouchMove);
        column.removeEventListener('touchend', handleTouchEnd);
      });
    };
  }, []);

  return (
    <section className="relative py-6 bg-[#0B0B45] overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-main/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#37E2D5]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-main/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side - Text Content */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 text-center lg:text-left">
            <div className="max-w-xl mx-auto lg:mx-0">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">What Our Students</span>
                <span className="block mt-2 bg-gradient-to-r from-[#37E2D5] to-[#2B4EFF] bg-clip-text text-transparent">Are Saying</span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-10">
                Verified student & alumni reviews – so you get the full picture. Our platform has helped thousands of students make informed decisions about their education journey.
              </p>
              
              {/* Stats Cards */}
              <div className="inline-flex items-center gap-6 bg-[#1A1A8F]/30 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-[#37E2D5] to-[#2B4EFF] bg-clip-text text-transparent text-4xl lg:text-5xl font-bold mb-2">
                    5000+
                  </div>
                  <div className="text-gray-300 text-sm">Happy Students</div>
                </div>
                <div className="w-px h-16 bg-white/10"></div>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-[#37E2D5] to-[#2B4EFF] bg-clip-text text-transparent text-4xl lg:text-5xl font-bold mb-2">
                    4.8
                  </div>
                  <div className="text-gray-300 text-sm">Average Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Testimonials Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Column */}
            <div 
              ref={firstColumnRef}
              className="space-y-4 h-[480px] sm:h-[640px] overflow-hidden testimonial-scroll pr-2 relative touch-none"
            >
              {[...testimonialData].map((testimonial, index) => (
                <TestimonialCard key={`col1-${index}`} testimonial={testimonial} />
              ))}
            </div>

            {/* Second Column */}
            <div
              ref={secondColumnRef}
              className="space-y-4 h-[480px] sm:h-[640px] overflow-hidden testimonial-scroll pl-2 hidden sm:block relative touch-none"
            >
              {[...testimonialData].map((testimonial, index) => (
                <TestimonialCard key={`col2-${index}`} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;