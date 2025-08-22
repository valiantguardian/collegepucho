"use client";
import { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { MdOutlineSearch } from "react-icons/md";
import { Input } from "@/components/ui/input";
import SearchModal from "@/components/modals/SearchModal";
import { Button } from "@/components/ui/button";

interface ImageType {
  src: string;
  alt: string;
}

const IMAGES: ImageType[] = [
  { src: "/hero.webp", alt: "Hero background image 1" },
  { src: "/hero2.webp", alt: "Hero background image 2" },
  { src: "/hero.webp", alt: "Hero background image 3" },
  { src: "/hero2.webp", alt: "Hero background image 4" },
] as const;

const AUTO_ROTATE_INTERVAL = 5000;

const CarouselItem = memo(
  ({
    image,
    isActive,
    onLoad,
  }: {
    image: ImageType;
    isActive: boolean;
    onLoad: () => void;
  }) => (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${
        isActive ? "opacity-75" : "opacity-0"
      }`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        quality={75}
        priority={isActive}
        className="object-cover"
        sizes="100vw"
        onLoad={onLoad}
      />
    </div>
  )
);
CarouselItem.displayName = "CarouselItem";

const NavButton = memo(
  ({
    direction,
    onClick,
    ariaLabel,
  }: {
    direction: "prev" | "next";
    onClick: () => void;
    ariaLabel: string;
  }) => (
    <button
      onClick={onClick}
      className={`absolute ${
        direction === "prev" ? "left-4" : "right-4"
      } top-1/2 -translate-y-1/2 z-[3]
              bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary-1 hidden md:block`}
      aria-label={ariaLabel}
    >
      {direction === "prev" ? (
        <ChevronLeft size={24} />
      ) : (
        <ChevronRight size={24} />
      )}
    </button>
  )
);
NavButton.displayName = "NavButton";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? IMAGES.length - 1 : prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  }, []);

  useEffect(() => {
    const nextIndex = (currentIndex + 1) % IMAGES.length;
    new window.Image().src = IMAGES[nextIndex].src;
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown as EventListener);
    return () =>
      window.removeEventListener("keydown", handleKeyDown as EventListener);
  }, [goToPrevious, goToNext]);

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {!loadedImages[0] && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse">
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary-1 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}

      {IMAGES.map((image, index) => (
        <CarouselItem
          key={image.src + index}
          image={image}
          isActive={index === currentIndex}
          onLoad={() => handleImageLoad(index)}
        />
      ))}

      <div className="absolute inset-0 z-[1] bg-[#141a218e]" />

      <div className="absolute inset-0 z-[2] flex items-center justify-center text-center flex-col px-4 md:px-8 lg:px-16">
        <p className="text-gray-1 text-base sm:text-lg font-medium leading-tight md:leading-veryWide max-w-4xl">
          Instant guidance, real reviews, smart suggestions - everything you
          need to make the right choice
        </p>
        <h1 className="text-gray-1 text-lg sm:text-xl md:text-3xl lg:text-7xl leading-veryWide font-bold max-w-5xl mb-4">
          Find Your Perfect{" "}
          <span className="text-primary-light">College & Course</span>{" "}
          <span className="text-gray-5 text-lg sm:text-xl md:text-3xl lg:text-6xl">
            Backed by{" "}
          </span>
          <span className="text-secondary-main text-lg sm:text-xl md:text-3xl lg:text-6xl">
            AI & Real Insights
          </span>
        </h1>
        <SearchModal
          trigger={
            <div className="relative cursor-pointer">
              <MdOutlineSearch className="absolute w-5 h-5 text-white transform -translate-y-1/2 left-3 top-1/2 z-10" />
              <Input
                type="text"
                placeholder="Search colleges, exams, courses, articles..."
                className="pl-10 rounded-xl bg-white/30 cursor-pointer sm:w-80 sm:h-10 placeholder:text-gray-1"
                readOnly
              />
            </div>
          }
        />
        <Button className="rounded-xl bg-tertiary-main text-white mt-8 mb-2">
          Start Exploring <ArrowRightIcon className="w-4 h-4" />
        </Button>
        <Link href="/psychometric-test">
          <Button 
            variant="link" 
            className="text-gray-1 underline hover:text-primary-light transition-colors"
          >
            Try Psychometric Test
          </Button>
        </Link>
      </div>

      <NavButton
        direction="prev"
        onClick={goToPrevious}
        ariaLabel="Previous slide"
      />
      <NavButton direction="next" onClick={goToNext} ariaLabel="Next slide" />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[3] flex gap-2">
        {IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-4"
                : "bg-white/50 hover:bg-white/80 w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
