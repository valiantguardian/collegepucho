"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button } from "../ui/button";
import { LuMessageSquareOff, LuShieldCheck, LuMapPin, LuBuilding2, LuGraduationCap, LuUser, LuMail, LuPhone } from "react-icons/lu";
import { CourseDTO } from "@/api/@types/course-type";
import { HomeCity } from "@/api/@types/header-footer";
import { toast } from "sonner";
import { getCurrentLocation } from "../utils/utils";
import DropdownFilter from "../miscellaneous/DropdownFilter";
import { CollegeDTO } from "@/api/@types/college-list";

// Enhanced form data type with better validation
interface LeadFormData {
  name: string;
  email: string;
  mobile_no: string;
  course_group_id: number | null;
  college_id: number | null;
  city_id: number | null;
  response_url: string;
  location: string;
  preferred_city: number | null;
  not_sure: boolean;
}

interface LeadFormProps {
  collegeData: CollegeDTO[];
  courseData: CourseDTO[];
  cityData: HomeCity[];
  brochureUrl?: string;
  onFormSubmitSuccess?: (formData: LeadFormData) => void;
}

// Enhanced validation rules with proper typing
interface ValidationRule {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

const VALIDATION_RULES: Record<keyof Pick<LeadFormData, 'name' | 'email' | 'mobile_no'>, ValidationRule> = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  mobile_no: {
    required: true,
    minLength: 10,
    maxLength: 15,
  },
};

const LeadForm: React.FC<LeadFormProps> = ({
  collegeData,
  courseData,
  cityData,
  brochureUrl,
  onFormSubmitSuccess,
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    mobile_no: "",
    course_group_id: null,
    college_id: null,
    city_id: null,
    not_sure: false,
    response_url: typeof window !== "undefined" ? window.location.href : "",
    location: "",
    preferred_city: null,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof LeadFormData, boolean>>>({});

  // Memoized options for better performance
  const courseOptions = useMemo(() => 
    courseData.map((course) => ({
      value: String(course.course_group_id),
      label: course.full_name || course.course_name || course.name || "",
    })), [courseData]
  );

  const collegeOptions = useMemo(() => 
    collegeData.map((college) => ({
      value: String(college.college_id),
      label: college.college_name || "",
    })), [collegeData]
  );

  const cityOptions = useMemo(() => 
    cityData.map((city) => ({
      value: String(city.city_id),
      label: city.name || "",
    })), [cityData]
  );

  // Enhanced location fetching with better error handling
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        setFormData((prev) => ({
          ...prev,
          location: `${latitude}, ${longitude}`,
        }));
      } catch (error) {
        setFormData((prev) => ({
          ...prev,
          location: "Location not available",
        }));
      }
    };
    fetchLocation();
  }, []);

  // Enhanced form field handling with validation
  const handleChange = useCallback((key: keyof LeadFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    
    // Mark field as touched
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, [errors]);

  // Enhanced validation with detailed error messages
  const validateField = useCallback((key: keyof LeadFormData, value: unknown): string | undefined => {
    const rules = VALIDATION_RULES[key as keyof typeof VALIDATION_RULES];
    if (!rules) return undefined;

    if (rules.required && !value) {
      return `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
    }

    if (typeof value === "string") {
      if (rules.minLength && value.length < rules.minLength) {
        return `${key.charAt(0).toUpperCase() + key.slice(1)} must be at least ${rules.minLength} characters.`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `${key.charAt(0).toUpperCase() + key.slice(1)} must be less than ${rules.maxLength} characters.`;
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        if (key === "email") return "Please enter a valid email address.";
        if (key === "name") return "Name can only contain letters and spaces.";
        return `Please enter a valid ${key}.`;
      }
    }

    return undefined;
  }, []);

  // Enhanced form validation
  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    
    // Validate required fields
    const requiredFields: (keyof LeadFormData)[] = [
      "name",
      "email", 
      "mobile_no",
      "course_group_id",
      "college_id",
      "city_id",
    ];

    requiredFields.forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // Enhanced brochure download with better UX
  const handleBrochureDownload = useCallback(() => {
    if (brochureUrl) {
      try {
        const newWindow = window.open(brochureUrl, "_blank");
        if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
          window.location.href = brochureUrl;
        }
        toast.success("Brochure Download", {
          description: "Your brochure is being downloaded.",
        });
      } catch (error) {
        toast.error("Download Failed", {
          description: "Unable to download brochure. Please try again.",
        });
      }
    }
  }, [brochureUrl]);

  // Enhanced form submission with better error handling
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) {
        toast.error("Validation Error", {
          description: "Please fix the errors in the form.",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await fetch("/api/post/lead-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to submit form");
        }

        toast.success("Form Submitted Successfully!", {
          description: "We'll contact you within 24 hours.",
        });

        // Reset form data
        const resetData = {
          name: "",
          email: "",
          mobile_no: "",
          course_group_id: null,
          college_id: null,
          city_id: null,
          not_sure: false,
          response_url: typeof window !== "undefined" ? window.location.href : "",
          location: formData.location,
          preferred_city: null,
        };
        setFormData(resetData);
        setErrors({});
        setTouched({});
        
        onFormSubmitSuccess?.(formData);
        handleBrochureDownload();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Submission failed";
        toast.error("Submission Error", {
          description: errorMessage,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, onFormSubmitSuccess, handleBrochureDownload]
  );

  // Enhanced field blur handler for better UX
  const handleBlur = useCallback((key: keyof LeadFormData) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const error = validateField(key, formData[key]);
    if (error) {
      setErrors((prev) => ({ ...prev, [key]: error }));
    }
  }, [formData, validateField]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl">
      <form onSubmit={handleSubmit} autoComplete="off" noValidate className="flex flex-col overflow-y-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh]  pb-8 ">
        <div className="flex-1 space-y-4 sm:space-y-6  px-2">
          
          {/* Course and College Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <LuGraduationCap className="w-4 h-4 text-primary-main" />
                Course
              </label>
              <DropdownFilter
                options={courseOptions}
                selected={formData.course_group_id ? String(formData.course_group_id) : null}
                placeholder="Select a course"
                searchable={true}
                onSelect={(value) => handleChange("course_group_id", value ? Number(value) : null)}
                className="bg-gray-1 text-text-primary border-gray-3 hover:border-primary-main focus:border-primary-main transition-colors duration-200 w-full"
              />
              {touched.course_group_id && errors.course_group_id && (
                <span className="text-error-main text-xs flex items-center gap-1">
                  <span className="w-1 h-1 bg-error-main rounded-full" />
                  {errors.course_group_id}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <LuBuilding2 className="w-4 h-4 text-primary-main" />
                College
              </label>
              <DropdownFilter
                options={collegeOptions}
                selected={formData.college_id ? String(formData.college_id) : null}
                placeholder="Select a college"
                searchable={true}
                onSelect={(value) => handleChange("college_id", value ? Number(value) : null)}
                className="bg-gray-1 text-text-primary border-gray-3 hover:border-primary-main focus:border-primary-main transition-colors duration-200 w-full"
              />
              {touched.college_id && errors.college_id && (
                <span className="text-error-main text-xs flex items-center gap-1">
                  <span className="w-1 h-1 bg-error-main rounded-full" />
                  {errors.college_id}
                </span>
              )}
            </div>
          </div>

          {/* City Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <LuMapPin className="w-4 h-4 text-primary-main" />
                Current City
              </label>
              <DropdownFilter
                options={cityOptions}
                selected={formData.city_id ? String(formData.city_id) : null}
                placeholder="Select your city"
                searchable={true}
                onSelect={(value) => handleChange("city_id", value ? Number(value) : null)}
                className="bg-gray-1 text-text-primary border-gray-3 hover:border-primary-main focus:border-primary-main transition-colors duration-200 w-full"
              />
              {touched.city_id && errors.city_id && (
                <span className="text-error-main text-xs flex items-center gap-1">
                  <span className="w-1 h-1 bg-error-main rounded-full" />
                  {errors.city_id}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <LuMapPin className="w-4 h-4 text-secondary-main" />
                Preferred City
              </label>
              <DropdownFilter
                options={cityOptions}
                selected={formData.preferred_city ? String(formData.preferred_city) : null}
                placeholder="Select your preferred city"
                searchable={true}
                onSelect={(value) => handleChange("preferred_city", value ? Number(value) : null)}
                className="bg-gray-1 text-text-primary border-gray-3 hover:border-secondary-main focus:border-secondary-main transition-colors duration-200 w-full"
              />
            </div>
          </div>

          {/* Not Sure Checkbox */}
          <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-1 rounded-xl border border-gray-2">
            <input
              type="checkbox"
              id="not_sure"
              checked={formData.not_sure}
              onChange={(e) => handleChange("not_sure", e.target.checked)}
              className="h-4 w-4 sm:h-5 sm:w-5 border-gray-3 rounded text-primary-main focus:ring-primary-main focus:ring-2 transition-all duration-200 mt-0.5 sm:mt-0"
              aria-label="Not sure about course, college, and city"
            />
            <label htmlFor="not_sure" className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              I'm still figuring out my course, college, and city preferences. 
              <span className="text-primary-main font-medium"> Our experts will guide you!</span>
            </label>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <LuUser className="w-4 h-4 text-primary-main" />
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                className="w-full h-10 sm:h-11 border border-gray-3 rounded-xl px-3 sm:px-4 text-text-primary bg-gray-1 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                disabled={isSubmitting}
                aria-describedby={touched.name && errors.name ? "name-error" : undefined}
              />
              {touched.name && errors.name && (
                <span id="name-error" className="text-error-main text-xs flex items-center gap-1">
                  <span className="w-1 h-1 bg-error-main rounded-full" />
                  {errors.name}
                </span>
              )}
            </div>

            <div className="space-y-2 relative">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <LuPhone className="w-4 h-4 text-primary-main" />
                Mobile Number
              </label>
              <div className="relative w-full">
                <PhoneInput
                  country="in"
                  value={formData.mobile_no}
                  onChange={(value) => handleChange("mobile_no", value)}
                  onBlur={() => handleBlur("mobile_no")}
                  inputProps={{ 
                    required: true, 
                    disabled: isSubmitting,
                    "aria-describedby": touched.mobile_no && errors.mobile_no ? "mobile-error" : undefined
                  }}
                  inputStyle={{
                    border: "1px solid #D0D5DD",
                    borderRadius: "12px",
                    width: "100%",
                    height: "40px",
                    padding: "8px 8px 8px 50px",
                    backgroundColor: "#F9FAFB",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                  }}
                  containerStyle={{
                    width: "100%",
                  }}
                />
                <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-success-main text-white text-xs italic px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 z-10">
                  <LuShieldCheck size={10} className="sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">Secure</span>
                </span>
              </div>
              {touched.mobile_no && errors.mobile_no && (
                <span id="mobile-error" className="text-error-main text-xs flex items-center gap-1">
                  <span className="w-1 h-1 bg-error-main rounded-full" />
                  {errors.mobile_no}
                </span>
              )}
            </div>

            <div className="space-y-2 relative md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <LuMail className="w-4 h-4 text-primary-main" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className="w-full h-10 sm:h-11 border border-gray-3 rounded-xl px-3 sm:px-4 text-text-primary bg-gray-1 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                disabled={isSubmitting}
                aria-describedby={touched.email && errors.email ? "email-error" : undefined}
              />
              <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-secondary-main text-white text-xs italic px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                <LuMessageSquareOff size={10} className="sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">No Spam</span>
              </span>
              {touched.email && errors.email && (
                <span id="email-error" className="text-error-main text-xs flex items-center gap-1">
                  <span className="w-1 h-1 bg-error-main rounded-full" />
                  {errors.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button - Fixed positioning */}
        <div className="flex-shrink-0 flex justify-end pt-4 sm:pt-6 pb-4 sm:pb-6 border-t border-gray-2 mt-auto">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-primary-main hover:bg-primary-4 text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Submitting...</span>
                <span className="sm:hidden">Submitting</span>
              </div>
            ) : (
              "Get Expert Guidance"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;