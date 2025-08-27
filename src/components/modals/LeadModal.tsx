"use client";
import React, { useState, useCallback, useMemo, Suspense, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HomeCity } from "@/api/@types/header-footer";
import { CourseDTO } from "@/api/@types/course-type";
import { getColleges } from "@/api/list/getColleges";
import { getCourses } from "@/api/list/getCourses";
import { getCities } from "@/api/list/getCities";
import { toast } from "sonner";
import LeadForm from "../forms/LeadForm";
import { CollegeDTO } from "@/api/@types/college-list";
import Link from "next/link";
import { 
  LuGraduationCap, 
  LuMapPin, 
  LuBuilding2, 
  LuUsers,
  LuCheck,
  LuX
} from "react-icons/lu";

// Enhanced types for better type safety
interface LeadModalProps {
  headerTitle?: React.ReactNode | string;
  triggerText?: React.ReactNode | string;
  btnTxt?: string;
  btnColor?: string;
  btnWidth?: string;
  btnMinWidth?: string;
  btnPadding?: string;
  btnHeight?: string;
  btnVariant?:
    | "default"
    | "link"
    | "ghost"
    | "destructive"
    | "outline"
    | "secondary"
    | null;
  brochureUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

// Enhanced header component with better visual hierarchy
const EnhancedHeader: React.FC = () => (
  <div className="flex flex-col gap-3 sm:gap-4">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <Link
        href="/"
        prefetch
        className="flex items-center justify-center sm:justify-start gap-2 text-primary-main p-2 sm:p-3 rounded-full font-bold hover:bg-primary-1 transition-colors duration-200 w-fit mx-auto sm:mx-0"
      >
        <LuGraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-base">CollegePucho</span>
      </Link>
      <div className="flex items-center justify-center sm:justify-end gap-2">
        <div className="w-2 h-2 bg-success-main rounded-full animate-pulse" />
        <span className="text-xs text-success-main font-medium">Live Support</span>
      </div>
    </div>
    
    <div className="text-center space-y-2 px-2">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary leading-tight">
        Tell us about your preferences
      </h2>
      <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed">
        We'll guide you to the perfect college and course match
      </p>
    </div>

    {/* Feature highlights */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-2 sm:mt-4 px-2">
      <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-text-secondary">
        <LuCheck className="w-3 h-3 sm:w-4 sm:h-4 text-success-main flex-shrink-0" />
        <span className="text-center sm:text-left">Free Consultation</span>
      </div>
      <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-text-secondary">
        <LuCheck className="w-3 h-3 sm:w-4 sm:h-4 text-success-main flex-shrink-0" />
        <span className="text-center sm:text-left">Expert Guidance</span>
      </div>
      <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-text-secondary">
        <LuCheck className="w-3 h-3 sm:w-4 sm:h-4 text-success-main flex-shrink-0" />
        <span className="text-center sm:text-left">No Hidden Costs</span>
      </div>
    </div>
  </div>
);

// Loading skeleton component
const LeadFormSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-10 bg-gray-200 rounded-xl w-full" />
        </div>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-64" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-10 bg-gray-200 rounded-xl w-full" />
        </div>
      ))}
    </div>
    <div className="h-10 bg-gray-200 rounded-xl w-full md:w-auto" />
  </div>
);

// Success state component
const SuccessState: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="text-center py-12 space-y-6">
    <div className="mx-auto w-16 h-16 bg-success-1 rounded-full flex items-center justify-center">
      <LuCheck className="w-8 h-8 text-success-main" />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-bold text-success-main">
        Thank you! Your request has been submitted.
      </h3>
      <p className="text-text-secondary">
        Our expert team will contact you within 24 hours to provide personalized guidance.
      </p>
    </div>
    
    <div className="bg-gray-1 rounded-xl p-4 space-y-2">
      <p className="text-sm font-medium text-text-primary">What happens next?</p>
      <ul className="text-xs text-text-secondary space-y-1 text-left">
        <li>• We'll analyze your preferences and requirements</li>
        <li>• Our experts will shortlist the best colleges for you</li>
        <li>• You'll receive a detailed consultation call</li>
        <li>• Get personalized recommendations and guidance</li>
      </ul>
    </div>

    <Button
      onClick={onClose}
      variant="outline"
      className="w-full md:w-auto"
    >
      Close
    </Button>
  </div>
);

const LeadModal: React.FC<LeadModalProps> = ({
  headerTitle,
  triggerText = "Get Started",
  btnTxt,
  btnColor,
  btnWidth,
  btnMinWidth,
  btnPadding,
  btnHeight = "h-11",
  btnVariant = "default",
  brochureUrl,
  className = "",
  size = "lg",
}) => {
  // State management with data fetching
  const [clgData, setClgData] = useState<CollegeDTO[]>([]);
  const [courseData, setCourseData] = useState<CourseDTO[]>([]);
  const [cityData, setCityData] = useState<HomeCity[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Simple data fetching without loading states
  const fetchData = useCallback(async () => {
    try {
      console.log("LeadModal: Starting data fetch...");
      
      // Test cities API directly from browser
      console.log("LeadModal: Testing cities API directly...");
      try {
        const directResponse = await fetch('https://api.collegepucho.com/cities');
        console.log("Direct cities API response status:", directResponse.status);
        if (directResponse.ok) {
          const directData = await directResponse.json();
          console.log("Direct cities API data:", directData.slice(0, 3));
          console.log("Direct cities count:", directData.length);
        }
      } catch (directError) {
        console.error("Direct cities API test failed:", directError);
      }
      
      // Test cities API specifically
      console.log("LeadModal: Testing cities API...");
      try {
        const citiesTest = await getCities();
        console.log("✅ Cities API test successful:", citiesTest);
        console.log("Cities count:", citiesTest.length);
        console.log("Sample city:", citiesTest[0]);
      } catch (cityError) {
        console.error("❌ Cities API test failed:", cityError);
      }
      
      const [colleges, courses, cities] = await Promise.allSettled([
        getColleges({ limit: 500, page: 1 }),
        getCourses(),
        getCities(),
      ]);

      console.log("LeadModal: All API responses:", { colleges, courses, cities });

      // Update state with whatever data we get
      if (colleges.status === "fulfilled" && colleges.value?.colleges) {
        setClgData(colleges.value.colleges);
        console.log("Colleges loaded:", colleges.value.colleges.length);
      }
      if (courses.status === "fulfilled" && courses.value?.courses) {
        setCourseData(courses.value.courses);
        console.log("Courses loaded:", courses.value.courses.length);
      }
      if (cities.status === "fulfilled" && cities.value) {
        console.log("Cities API response:", cities.value);
        console.log("Cities type:", typeof cities.value);
        console.log("Cities is array:", Array.isArray(cities.value));
        setCityData(cities.value);
        console.log("Cities loaded:", cities.value.length);
      } else if (cities.status === "rejected") {
        console.error("Cities API rejected:", cities.reason);
      }
      
    } catch (error) {
      console.error("LeadModal: Data fetch error:", error);
      // Don't show errors to user, just log them
    }
  }, []);

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  // Enhanced form submission handler
  const handleFormSubmitSuccess = useCallback((formData: any) => {
    setIsFormSubmitted(true);
    toast.success("Form Submitted Successfully!", {
      description: "We'll contact you within 24 hours.",
    });
    
    // Auto-close after delay
    setTimeout(() => {
      setIsOpen(false);
    }, 5000);
  }, []);

  // Enhanced modal open/close handler
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    
    if (!open) {
      // Reset form state when closing
      if (isFormSubmitted) {
        setIsFormSubmitted(false);
      }
    }
  }, [isFormSubmitted]);

  // Memoized size classes
  const sizeClasses = useMemo(() => {
    switch (size) {
      case "sm": return "max-w-md";
      case "md": return "max-w-lg";
      case "lg": return "max-w-2xl";
      case "xl": return "max-w-4xl";
      default: return "max-w-2xl";
    }
  }, [size]);

  // Memoized button styles
  const buttonStyles = useMemo(() => ({
    backgroundColor: btnColor,
    color: btnTxt,
    width: btnWidth,
    minWidth: btnMinWidth,
    padding: btnPadding,
  }), [btnColor, btnTxt, btnWidth, btnMinWidth, btnPadding]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={btnVariant}
          style={buttonStyles}
          className={`w-full md:w-auto ${btnHeight} px-6 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
        >
          {triggerText}
        </Button>
      </DialogTrigger>
      
      <DialogContent
        className={`${sizeClasses} max-h-[95vh] overflow-hidden rounded-2xl border-0 shadow-2xl`}
        aria-label="Lead Generation Form"
        aria-describedby="lead-form-description"
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close modal"
        >
          <LuX className="w-5 h-5 text-text-secondary" />
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          <DialogHeader className="mb-4 sm:mb-6">
            <DialogTitle asChild>
              {headerTitle || <EnhancedHeader />}
            </DialogTitle>
            <DialogDescription id="lead-form-description" className="sr-only">
              Lead generation form for college and course guidance
            </DialogDescription>
          </DialogHeader>

          {/* Content states */}
          <Suspense fallback={<LeadFormSkeleton />}>
            {isFormSubmitted ? (
              <SuccessState onClose={() => setIsOpen(false)} />
            ) : (
              <LeadForm
                collegeData={clgData}
                courseData={courseData}
                cityData={cityData}
                brochureUrl={brochureUrl}
                onFormSubmitSuccess={handleFormSubmitSuccess}
              />
            )}
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadModal;
