"use client";

import React, { useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CollegeInformation } from "@/api/@types/college-info";

interface CollegeData {
  data: CollegeInformation;
  activeTab?: string;
}

const CollegeNav: React.FC<CollegeData> = ({ data, activeTab }) => {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const { college_id, slug, dynamic_fields } = data;

  if (!college_id || !slug || !dynamic_fields) {
    return null;
  }

  const baseSlug = slug.replace(/-\d+$/, "");
  const basePath = `/colleges/${baseSlug}-${college_id}`;

  const navItems = useMemo(() => {
    const df = (dynamic_fields as unknown) as Record<string, unknown>;

    const showInfo = Boolean(df["info"] as boolean);
    const showHighlights = Boolean((df["highlight"] ?? df["highlights"]) as boolean);
    const showCourses = Boolean(df["courses"] as boolean);
    const showFees = Boolean(df["fees"] as boolean);
    const showAdmission = Boolean((df["admission"] as boolean) || (df["admission-process"] as boolean));
    const showCutoffs = Boolean(df["cutoff"] as boolean);
    const showPlacements = Boolean((df["placement"] as boolean) || (df["placement-process"] as boolean));
    const showRankings = Boolean(df["ranking"] as boolean);
    const showScholarship = Boolean(df["scholarship"] as boolean);
    const showFacilities = Boolean((df["facility"] ?? df["facilities"]) as boolean);
    const showFaq = Boolean(df["faq"] as boolean);
    const showNews = Boolean(df["news"] as boolean);

    const items = [
      { label: "Info", path: "", show: showInfo },
      { label: "Highlights", path: "/highlights", show: showHighlights },
      { label: "Courses", path: "/courses", show: showCourses },
      { label: "Fees", path: "/fees", show: showFees },
      { label: "Admission Process", path: "/admission-process", show: showAdmission },
      { label: "Cutoffs", path: "/cutoffs", show: showCutoffs },
      { label: "Placements", path: "/placements", show: showPlacements },
      { label: "Rankings", path: "/rankings", show: showRankings },
      { label: "Scholarship", path: "/scholarship", show: showScholarship },
      { label: "Facilities", path: "/facilities", show: showFacilities },
      { label: "FAQ", path: "/faq", show: showFaq },
      { label: "News", path: "/news", show: showNews },
    ].filter((item) => item.show);

    return items;
  }, [dynamic_fields]);

  const defaultActiveTab = activeTab || navItems[0]?.label;

  // Center the active tab when component mounts or activeTab changes
  useEffect(() => {
    if (navRef.current) {
      const activeElement = navRef.current.querySelector('[aria-current="page"]');
      if (activeElement instanceof HTMLElement) {
        const navWidth = navRef.current.offsetWidth;
        const activeWidth = activeElement.offsetWidth;
        const activeOffset = activeElement.offsetLeft;
        const scrollPosition = activeOffset - (navWidth / 2) + (activeWidth / 2);
        
        navRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [defaultActiveTab, navItems]);

  if (!navItems.length) return null;

  return (

      <nav
        ref={navRef}
        className="md:container-body flex items-center gap-2 md:gap-4 bg-white overflow-x-auto no-scroll-bar text-[#637381] border border-[#DFE3E8] shadow-sm font-light whitespace-nowrap"
      >
        {navItems.map(({ label, path }, idx) => {
          const fullPath = `${basePath}${path}`;
          const isActive = activeTab
            ? label === defaultActiveTab
            : pathname === fullPath || (!pathname.includes(basePath + "/") && idx === 0);

          return (
            <React.Fragment key={label}>
              {idx > 0 && <span className="text-[#919EAB] select-none">•</span>}
              <Link
                href={fullPath}
                aria-current={isActive ? "page" : undefined}
                className={`my-2 px-3 py-1 text-sm md:text-base transition-colors duration-200 rounded-full ${
                  isActive
                    ? "font-semibold bg-primary-1 text-[#1C252E]"
                    : "bg-transparent text-[#637381] hover:text-black hover:bg-primary-1"
                }`}
              >
                {label}
              </Link>
            </React.Fragment>
          );
        })}
      </nav>
 
  );
};

export default CollegeNav;