import React, { useMemo } from "react";
import { HomeCollege } from "@/api/@types/home-datatype";
import Image from "next/image";
import { trimText } from "../utils/utils";
import Link from "next/link";
import { FaRankingStar } from "react-icons/fa6";
import { GiBookshelf } from "react-icons/gi";
import { FaCalendarAlt, FaStar } from "react-icons/fa";

const SkeletonLoader = () => (
  <div className="bg-gray-300 h-72 rounded-2xl animate-pulse" />
);

const HomeCollegeCard: React.FC<{ college?: HomeCollege; isLoading: boolean }> =
  React.memo(({ college, isLoading }) => {
    if (isLoading || !college) {
      return <SkeletonLoader />;
    }

    const {
      kapp_rating,
      course_count,
      NIRF_ranking,
      college_name,
      city_name,
      logo_img,
      nacc_grade,
      college_id,
      slug,
      state_name,
      founded_year,
    } = college;

    // Additional safety check for required properties
    if (!college_id || !college_name) {
      return <SkeletonLoader />;
    }
    const renderCollegeStats = useMemo(
      () => (
        <div className="border-dashed border-t border-[#DFE3E8] p-4 grid grid-cols-2 gap-4 content-normal">
          {[
            {
              // label: "Rating",
              value: kapp_rating,
              icon: <FaStar className="text-secondary-dark w-12" />,
            },
            {
              // label: "No of courses",
              icon: <GiBookshelf className="text-secondary-dark w-12" />,
              value: course_count ? `${course_count}+` : "-",
            },
            {
              // label: "Ranking",
              icon: <FaRankingStar className="text-secondary-dark w-12" />,
              value: NIRF_ranking ? `#${NIRF_ranking} NIRF` : null,
            },
            {
              // label: "Ranking",
              icon: <FaCalendarAlt className="text-secondary-dark w-12" />,
              value: founded_year ? `${founded_year}` : null,
            },
          ]
            .filter(
              ({ value }) => value != null && value !== 0 && value !== "0"
            )
            .map(({ value, icon }) => (
              <div key={value} className="text-center">
                <p className={`flex items-center text-gray-9  font-medium `}>
                  {icon && icon}
                  {value}
                </p>
              </div>
            ))}
        </div>
      ),
      [kapp_rating, course_count, NIRF_ranking]
    );

    return (
      <div className="bg-white rounded-2xl">
        <div className="flex justify-center flex-col px-4 py-3">
          <Image
            src={
              logo_img ||
              "https://d28xcrw70jd98d.cloudfront.net/allCollegeLogo/defaultLogo1.webp"
            }
            width={70}
            height={70}
            alt={college_name || "College Logo"}
            className="aspect-square rounded-xl object-cover p-1.5 bg-white"
          />
          <Link
            href={`/colleges/${(slug || `college-${college_id}`).replace(/-\d+$/, "")}-${college_id}`}
            className="font-semibold text-md mt-2"
          >
            {trimText(college_name, 46)}
          </Link>
          <p className="text-sm text-[#637381]">
            {city_name || "Unknown City"}, {state_name || "Unknown State"}
          </p>
          <div className="flex items-center gap-4 pt-3 pb-2">
            <p className="px-3 py-0.5 bg-black text-white font-semibold text-center rounded-xl">
              UGC
            </p>
            {nacc_grade && nacc_grade.trim() !== "" && (
              <p className="px-3 py-0.5 bg-black text-white text-center font-semibold rounded-xl min-w-14">
                {nacc_grade}
              </p>
            )}
          </div>
        </div>
        {renderCollegeStats}
      </div>
    );
  });

export default HomeCollegeCard;
