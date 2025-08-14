"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GreExamDTO } from "@/api/@types/exam-type";
import { getExamSilos } from "@/api/individual/getExamsById";

interface ExamData {
  data: GreExamDTO;
}

const navItems = [
  { silo: "info", label: "Info", path: "" },
  { silo: "highlight", label: "Highlights", path: "/highlight" },
  { silo: "application_process", label: "Application Process", path: "/application-process" },
  { silo: "cutoff", label: "Cut-Off", path: "/cutoff" },
  { silo: "eligibility", label: "Eligibility", path: "/eligibility" },
  { silo: "admit_card", label: "Admit Card", path: "/admit-card" },
  { silo: "pattern", label: "Exam Pattern", path: "/pattern" },
  { silo: "syllabus", label: "Syllabus", path: "/syllabus" },
  { silo: "result", label: "Results", path: "/result" },
  { silo: "fees", label: "Fees", path: "/fees" },
];

const ExamNav: React.FC<ExamData> = ({ data }) => {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const { examInformation, distinctSilos, examContent } = data;
  const [availableSilos, setAvailableSilos] = useState<{ silos: string }[]>([]);

  // Fetch available silos when component mounts
  useEffect(() => {
    const fetchSilos = async () => {
      if (examInformation?.exam_id) {
        try {
          const silos = await getExamSilos(examInformation.exam_id);
          setAvailableSilos(silos);
        } catch (error) {
          console.error("Error fetching exam silos:", error);
          // Use distinctSilos as fallback if available
          if (distinctSilos && distinctSilos.length > 0) {
            setAvailableSilos(distinctSilos);
          }
        }
      }
    };

    fetchSilos();
  }, [examInformation?.exam_id, distinctSilos]);

  const orderedNavItems = useMemo(() => {
    // Use availableSilos if we have them, otherwise fallback to distinctSilos
    const silosToUse = availableSilos.length > 0 ? availableSilos : distinctSilos;
    
    if (silosToUse && silosToUse.length > 0) {
      const silosSet = new Set(silosToUse.map((s) => s.silos));
      return navItems.filter((item) => silosSet.has(item.silo));
    }
    
    // If no silos available, show all nav items as fallback
    return navItems;
  }, [availableSilos, distinctSilos]);

  if (!examInformation || !examInformation.exam_id) return null;

  const baseSlug = (examInformation.exam_name || "default-exam")
    .replace(/\s+/g, "-")
    .toLowerCase();
  const basePath = `/exams/${baseSlug}-${examInformation.exam_id}`;

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
  }, [pathname, orderedNavItems]);

  return (
    <nav className="bg-white text-[#637381] border border-[#DFE3E8] shadow-sm font-light">
      <div
        ref={navRef}
        className="container-body flex items-center justify-normal gap-2 md:gap-4 overflow-x-auto no-scroll-bar whitespace-nowrap"
      >
        {orderedNavItems.map(({ label, path }, idx) => {
          const fullPath = `${basePath}${path}`;
          const isActive = pathname === fullPath;

          return (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-[#919EAB]">•</span>}
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
      </div>
    </nav>
  );
};

export default ExamNav;