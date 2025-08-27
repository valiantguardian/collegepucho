import Share from "@/components/miscellaneous/Share";
import LeadModal from "@/components/modals/LeadModal";
import { Button } from "@/components/ui/button";
import { trimText } from "@/components/utils/utils";
import Image from "next/image";
import React from "react";
import { GrCatalog } from "react-icons/gr";
import { RiCustomerService2Fill } from "react-icons/ri";
import { AiFillHeart } from "react-icons/ai";

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
  } = data;
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
      <div className="relative z-20 flex flex-col justify-between w-full min-h-[180px] md:min-h-[240px] p-6">
        {/* Top section: logo, location, name, subtitle */}
        <div className="px-4 md:px-10 pt-6 pb-2 flex flex-row items-start gap-4">
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
          <div className="flex flex-col justify-center">
            <span className="text-xs md:text-sm text-[#B0BEC5] font-medium mb-2">
              {city && state ? `${city}, ${state}` : location}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-1">
              {trimText(college_name, 58)}
            </h1>
            <span className="text-base md:text-lg font-semibold text-white/80">
              Courses, Admission 2024, Cutoff, Ranking, Placement, Reviews
            </span>
          </div>
        </div>
        {/* Bottom bar: actions and enquire */}
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between px-4 md:px-10 pb-3 z-30">
          {/* Action buttons */}
          <div className="flex flex-row items-center gap-2 md:gap-6 space-responsive-xs">
            <Button
              variant="ghost"
              className="px-0 bg-transparent text-xs md:text-[15px] font-medium flex items-center gap-1 hover:bg-transparent"
              style={{ color: actionBlue }}
            >
              <svg width="20" height="20" fill="none" stroke={actionBlue} strokeWidth="2" viewBox="0 0 24 24" className="mr-1"><path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M21 3l-7.87 7.87M3 21l7.87-7.87"/></svg>
              Compare
            </Button>
            <LeadModal
              btnVariant="ghost"
              brochureUrl={college_brochure}
              triggerText={
                <span className="flex items-center gap-2 text-xs md:text-[15px] font-medium" style={{ color: actionBlue }}>
                  <GrCatalog color={actionBlue} /> Brochure
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
          <div className="flex flex-row items-center">
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
