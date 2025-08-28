import Share from "@/components/miscellaneous/Share";
import LeadModal from "@/components/modals/LeadModal";
import BrochureModal from "@/components/modals/BrochureModal";
import CompareComingSoonModal from "@/components/modals/CompareComingSoonModal";
import { Button } from "@/components/ui/button";
import { trimText } from "@/components/utils/utils";
import Image from "next/image";
import React from "react";
import { GrCatalog } from "react-icons/gr";
import { RiCustomerService2Fill } from "react-icons/ri";
import { AiFillHeart } from "react-icons/ai";
import { BiGitCompare } from "react-icons/bi";

const actionBlue = "#1DA1F2";

const CollegeHead = ({
  data,
}: {
  data: {
    college_name: string;
    college_logo?: string;
    city?: string;
    state?: string;
    title?: string;
    location?: string;
    college_brochure?: string;
    banner_img?: string;
    logo_img?: string;
    articleTitle?: string;
    articleContent?: string;
  };
}) => {
  const {
    banner_img,
    logo_img,
    college_name,
    college_brochure,
    city,
    state,
    location,
    title,
    articleTitle,
    articleContent,
  } = data;
  
  // Use article title/content if available, otherwise fallback to college name/title
  const displayTitle = articleTitle || title || college_name;
  const displaySubtitle = articleContent || "Courses, Admission 2024, Cutoff, Ranking, Placement, Reviews";
  
  const bannerImage =
    banner_img ||
    "https://d28xcrw70jd98d.cloudfront.net/test_folder/unifallback.webp";
  const logoImage =
    logo_img ||
    "https://d28xcrw70jd98d.cloudfront.net/allCollegeLogo/defaultLogo2.webp";

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background image */}
      <Image
        src={bannerImage}
        alt="college background"
        fill
        className="object-cover object-center z-0"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1a227e7a]/80 z-10" />
      {/* Main content */}
      <div className="relative z-20 flex flex-col justify-between w-full min-h-[180px] md:min-h-[240px] p-4 md:p-6">
        {/* Top section: logo, location, name, subtitle */}
        <div className="px-2 md:px-10 pt-4 md:pt-6 pb-2 flex flex-col md:flex-row items-start gap-3 md:gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src={logoImage}
              alt={college_name}
              className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-full border-4 border-white bg-white shadow-lg"
              height={80}
              width={80}
              aria-label="college logo"
            />
          </div>
          {/* Info */}
          <div className="flex flex-col justify-center flex-1">
            <span className="text-xs md:text-sm text-[#B0BEC5] font-medium mb-2 text-center md:text-left">
              {city && state ? `${city}, ${state}` : location}
            </span>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-loose mb-1 text-center md:text-left">
              {trimText(displayTitle, 58)}
            </h1>
            <span className="text-sm md:text-base lg:text-lg font-semibold text-white/80 text-center md:text-left">
              {displaySubtitle}
            </span>
          </div>
        </div>
        {/* Bottom bar: actions and enquire */}
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between px-2 md:px-10 pb-3 z-30 gap-3 md:gap-0">
          {/* Action buttons */}
          <div className="flex flex-row items-center justify-center md:justify-start gap-2 md:gap-6 w-full md:w-auto">
            <CompareComingSoonModal
              btnVariant="ghost"
              className="px-0 bg-transparent text-xs md:text-[15px] font-medium flex items-center gap-1 hover:bg-transparent text-[#1DA1F2]"
              triggerText={
                <span className="flex items-center gap-2 text-xs md:text-[15px] font-medium" style={{ color: actionBlue }}>
                  <BiGitCompare color={actionBlue} /> Compare
                </span>
              }
            />
            <BrochureModal
              brochureUrl={college_brochure}
              collegeName={college_name}
              btnVariant="ghost"
              triggerText={
                <span className="flex items-center gap-2 text-xs md:text-[15px] font-medium" style={{ color: actionBlue }}>
                  Brochure
                </span>
              }
            />
            {/* Favorite placeholder */}
            <Button
              variant="ghost"
              className="px-0 bg-transparent text-xs md:text-[15px] font-medium flex items-center gap-1 hover:bg-transparent"
              style={{ color: actionBlue }}
            >
              <AiFillHeart className="text-lg mr-1" color={actionBlue} /> Favorite
            </Button>
            <div className="ml-1 text-[#1DA1F2]">
              <Share />
            </div>
          </div>
          {/* Enquire button */}
          <div className="flex flex-row items-center justify-center md:justify-end w-full md:w-auto">
            <LeadModal
              triggerText={
                <span className="flex items-center gap-2 text-base md:text-lg font-semibold">
                  <span>Enquire</span>
                  <RiCustomerService2Fill className="text-xl" />
                </span>
              }
              btnVariant="default"
              btnColor="#FFA940"
              btnTxt="#fff"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeHead;
