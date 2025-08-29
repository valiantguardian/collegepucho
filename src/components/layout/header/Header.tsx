"use client";
import React, { useEffect, useState, useCallback, JSX, useMemo } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { getNavData } from "@/api/list/getNavData";
import { OverStreamSectionProps, HomeCity } from "@/api/@types/header-footer";
import { useIsMobile } from "@/components/utils/useMobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  FaUniversity,
  FaBusinessTime,
  FaUserMd,
  FaPalette,
  FaBars,
  FaEllipsisH,
  FaUser,
  FaChevronDown,
  FaChevronRight,
  FaArrowLeft,
} from "react-icons/fa";
import SearchModal from "@/components/modals/SearchModal";
import LeadModal from "@/components/modals/LeadModal";
import { DialogTitle } from "@/components/ui/dialog";
import { formatName } from "@/components/utils/utils";
import clsx from "clsx";

const streamNames: Record<number, { name: string; icon: JSX.Element }> = {
  1000002: { name: "Engineering", icon: <FaUniversity /> },
  1000001: { name: "Management", icon: <FaBusinessTime /> },
  1000003: { name: "Medical", icon: <FaUserMd /> },
  1000004: { name: "Design", icon: <FaPalette /> },
};

const navOptions = ["colleges", "collegesByCity", "exams"] as const;
type NavOption = (typeof navOptions)[number];

const Header: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [overStreamData, setOverStreamData] = useState<
    OverStreamSectionProps[]
  >([]);
  const [citiesData, setCitiesData] = useState<HomeCity[]>([]);
  const [examsByStream, setExamsByStream] = useState<
    Record<number, { exam_id: number; slug: string; exam_name: string }[]>
  >({});
  const [generalExams, setGeneralExams] = useState<
    { exam_id: number; slug: string; exam_name: string }[]
  >([]);
  const [hoveredOption, setHoveredOption] = useState<NavOption>("colleges");
  const [currentStream, setCurrentStream] = useState<number | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const [activeStream, setActiveStream] = useState<number | null>(null);
  const [activeSubSection, setActiveSubSection] = useState<NavOption | null>(
    null
  );
  const [showMoreStreams, setShowMoreStreams] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State for mobile Sheet
  const isMobile = useIsMobile();
  const [activeMoreStream, setActiveMoreStream] =
    useState<OverStreamSectionProps | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Calculate dropdown positioning based on screen size
  const getDropdownPosition = useCallback(() => {
    if (windowWidth < 640) return "left-0"; // Small screens
    if (windowWidth < 1024) return "left-0"; // Medium screens
    return "left-0"; // Large screens
  }, [windowWidth]);

  // Calculate dropdown width based on screen size
  const getDropdownWidth = useCallback(() => {
    if (windowWidth < 640) return "w-[90vw] max-w-[400px]"; // Small screens
    if (windowWidth < 768) return "w-[500px]"; // Medium screens
    if (windowWidth < 1024) return "w-[600px]"; // Large screens
    if (windowWidth < 1280) return "w-[700px]"; // XL screens
    return "w-[800px]"; // 2XL screens
  }, [windowWidth]);

  // Ensure we're on the client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const additionalStreams = useMemo(() => {
    const mainStreamIds = Object.values(streamNames).map(({ name }) => {
      // Use the hardcoded IDs since we know they're correct
      const streamId = Object.keys(streamNames).find(
        (key) => streamNames[Number(key)].name === name
      );
      return Number(streamId);
    });
    return (overStreamData || []).filter((stream) => {
      // Check if this stream's ID is not in mainStreamIds
      const isNotMainStream = !mainStreamIds.includes(stream.stream_id);
      return isNotMainStream;
    });
  }, [overStreamData]);

  const fetchNavData = useCallback(async () => {
    setLoading(true);
    try {
      const navData = await getNavData();
      if (navData) {
        const { over_stream_section, cities_section, exams_section } = navData;
        setOverStreamData(over_stream_section || []);
        setCitiesData((cities_section || []).slice(0, 10));

        // Set general exams as fallback
        const generalExamsData = (exams_section || []).map((exam) => ({
          exam_id: exam.exam_id,
          slug: exam.slug ?? "",
          exam_name: exam.exam_name,
        }));
        setGeneralExams(generalExamsData);

        const examsData = (over_stream_section || []).reduce((acc, stream) => {
          if (stream.exams && stream.exams.length > 0) {
            acc[stream.stream_id] = stream.exams.map((exam) => ({
              exam_id: exam.exam_id,
              slug: exam.slug ?? "",
              exam_name: exam.exam_name,
            }));
          }
          return acc;
        }, {} as Record<number, { exam_id: number; slug: string; exam_name: string }[]>);

        setExamsByStream(examsData);
      }
    } catch (error) {
      console.error("Error loading stream data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNavData();
  }, [fetchNavData]);

  // Debug effect to see what data we have
  useEffect(() => {
    console.log("Header state:", {
      overStreamData: overStreamData.length,
      examsByStream: Object.keys(examsByStream).length,
      generalExams: generalExams.length,
      hoveredOption,
      currentStream,
    });
  }, [
    overStreamData,
    examsByStream,
    generalExams,
    hoveredOption,
    currentStream,
  ]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      setScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setScrolling(false), 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Function to close navbar (Sheet on mobile)
  const closeNavbar = useCallback(() => {
    setIsSheetOpen(false); // Close mobile Sheet
    setActiveSubSection(null); // Reset subsection to collapse mobile menu
    setActiveStream(null); // Reset active stream
    setShowMoreStreams(false); // Reset more streams
  }, []);

  const renderOptions = (
    type: NavOption,
    streamId: number | null,
    streamName?: string
  ) => {
    if (!streamId || !streamName) return null;
    const stream = (overStreamData || []).find((s) => s.stream_id === streamId);
    if (!stream) return null;

    switch (type) {
      case "colleges":
        return (
          <div>
            {stream.colleges.map((college) => (
              <Link
                key={college.college_id}
                href={`/colleges/${college.slug.replace(/-\d+$/, "")}-${
                  college.college_id
                }`}
                className="text-sm block text-[#4B5563] py-[10px] hover:text-[#4F46E5]"
                onClick={closeNavbar}
              >
                {college.college_name} ({college.city_name})
              </Link>
            ))}
          </div>
        );
      case "collegesByCity":
        return (
          <div>
            {(citiesData || []).map((city) => (
              <Link
                key={city.city_id}
                href={`/college/${formatName(streamName)}-colleges-in-${
                  city.city_id
                }`}
                className="text-sm block text-[#4B5563] py-[10px] hover:text-[#4F46E5]"
                onClick={closeNavbar}
              >
                {streamName} Colleges in {city.city_name}
              </Link>
            ))}
          </div>
        );
      case "exams":
        const streamExams = examsByStream[streamId];
        const examsToShow =
          streamExams && streamExams.length > 0 ? streamExams : generalExams;

        if (!examsToShow || examsToShow.length === 0) {
          return (
            <div className="text-sm text-gray-500 py-2">
              No exams available at the moment.
            </div>
          );
        }

        return (
          <div>
            {examsToShow.slice(0, 8).map((exam) => (
              <Link
                key={exam.exam_id}
                href={`/exams/${exam.slug}-${exam.exam_id}`}
                className="text-sm block text-[#4B5563] py-[10px] hover:text-[#4F46E5]"
                onClick={closeNavbar}
              >
                {exam.exam_name}
              </Link>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const getOptionLabel = (option: NavOption, streamName: string) => {
    switch (option) {
      case "colleges":
        return `Top ${streamName} Colleges`;
      case "collegesByCity":
        return `${streamName} Colleges By City`;
      case "exams":
        return `Top ${streamName} Exams`;
      default:
        return option;
    }
  };

  const engineeringCollegesItems = [
    {
      label: "Top Engineering Colleges",
      content: (
        <>
          <div className="font-bold text-sm mb-3">TOP ENGINEERING COLLEGES</div>
          <ul className="space-y-2 text-gray-600 text-sm">
            {(overStreamData || [])
              .find((stream) => stream.stream_id === 1000002)
              ?.colleges.slice(0, 6)
              .map((college) => (
                <li key={college.college_id}>{college.college_name}</li>
              ))}
          </ul>
        </>
      ),
      href: "/college/engineering-colleges",
    },
    {
      label: "Colleges By Location",
      content: (
        <>
          <div className="font-bold text-sm mb-3">COLLEGES BY LOCATION</div>
          <ul className="space-y-2 text-gray-600 text-sm">
            {(citiesData || []).slice(0, 6).map((city) => (
              <li key={city.city_id}>
                Engineering Colleges in {city.city_name}
              </li>
            ))}
          </ul>
        </>
      ),
      href: "/college/engineering-colleges-by-location",
    },
    {
      label: "Engineering Exams",
      content: (
        <>
          <div className="font-bold text-sm mb-3">ENGINEERING EXAMS</div>
          <ul className="space-y-2 text-gray-600 text-sm">
            {(examsByStream[1000002] && examsByStream[1000002].length > 0
              ? examsByStream[1000002]
              : generalExams
            )
              ?.slice(0, 6)
              .map((exam) => (
                <li key={exam.exam_id}>{exam.exam_name}</li>
              ))}
          </ul>
        </>
      ),
      href: "/exams/engineering",
    },
  ];

  const moreStreamsItems = additionalStreams.map((stream) => ({
    label: stream.stream_name,
    content: (
      <>
        <div className="font-bold text-sm mb-3">
          {stream.stream_name.toUpperCase()}
        </div>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li>Top Ranked Colleges</li>
          <li>Popular Courses</li>
          <li>Popular Specializations</li>
          <li>Exams</li>
        </ul>
      </>
    ),
    href: `/college/${stream.stream_name.toLowerCase()}-colleges`,
  }));

  // Initialize activeMoreStream with the first stream
  useEffect(() => {
    if (additionalStreams.length > 0 && !activeMoreStream) {
      setActiveMoreStream(additionalStreams[0]);
    }
  }, [additionalStreams, activeMoreStream]);

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
            <Link
              href="/"
              prefetch
              className="text-primary-main py-1 text-lg sm:text-xl lg:text-2xl font-bold"
            >
              collegepucho
            </Link>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Force mobile layout for small screens
  const shouldShowMobile = isMobile || windowWidth < 768;

  return (
    <>
      {shouldShowMobile ? (
        <div className="mobile-header flex justify-between items-center p-2 sm:p-3 lg:p-4">
          <Link
            href="/"
            prefetch
            className="text-primary-main py-1 text-lg sm:text-xl lg:text-2xl font-bold"
            onClick={closeNavbar}
          >
            collegepucho
          </Link>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button
                className="menu-icon focus:outline-none p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Open navigation menu"
              >
                <FaBars className="text-lg sm:text-xl" />
              </button>
            </SheetTrigger>
            <SheetContent className="p-2 sm:p-4 z-[101] w-[90%] sm:w-[85%] lg:w-[80%]">
              <DialogTitle
                asChild
                className="flex justify-between items-center w-fit mb-4 sm:mb-6"
              >
                <Link
                  href="/"
                  prefetch
                  className="text-primary-main py-1 text-lg sm:text-xl lg:text-2xl font-bold"
                  onClick={closeNavbar}
                >
                  collegepucho
                </Link>
              </DialogTitle>

              <nav className="overflow-y-auto h-full">
                {!activeSubSection ? (
                  <ul className="space-y-1 sm:space-y-2">
                    {Object.entries(streamNames).map(([id, { name, icon }]) => (
                      <li key={id}>
                        <button
                          className="flex items-center justify-between w-full text-gray-700 font-semibold py-3 sm:py-4 hover:text-primary-main rounded-lg hover:bg-gray-50 transition-colors px-2 sm:px-3"
                          onClick={() =>
                            setActiveStream(
                              activeStream === Number(id) ? null : Number(id)
                            )
                          }
                        >
                          <div
                            className={`flex items-center gap-2 sm:gap-3 ${
                              activeStream === Number(id)
                                ? "text-primary-main"
                                : "text-gray-700"
                            }`}
                          >
                            <span className="text-lg sm:text-xl">{icon}</span>
                            <span className="text-sm sm:text-base">{name}</span>
                          </div>
                          <FaChevronDown
                            className={`transition-transform text-sm sm:text-base ${
                              activeStream === Number(id) ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {activeStream === Number(id) && (
                          <ul className="space-y-1 sm:space-y-2 mt-2 ml-4 sm:ml-6 animate-fadeIn">
                            {navOptions.map((option) => (
                              <li key={option}>
                                <button
                                  className="flex justify-between border-b border-gray-200 font-medium text-gray-600 w-full text-left py-2 sm:py-3 hover:text-primary-main hover:bg-gray-50 rounded-lg px-2 sm:px-3 transition-colors"
                                  onClick={() => setActiveSubSection(option)}
                                >
                                  <span className="text-xs sm:text-sm">
                                    {getOptionLabel(option, name)}
                                  </span>
                                  <FaChevronRight className="text-xs sm:text-sm" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                    {additionalStreams.length > 0 && (
                      <li>
                        <button
                          className="flex items-center justify-between w-full text-gray-700 font-semibold py-3 sm:py-4 hover:text-primary-main rounded-lg hover:bg-gray-50 transition-colors px-2 sm:px-3"
                          onClick={() => setShowMoreStreams(!showMoreStreams)}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <FaEllipsisH className="text-lg sm:text-xl" />
                            <span className="text-sm sm:text-base">More</span>
                          </div>
                          <FaChevronDown
                            className={`transition-transform text-sm sm:text-base ${
                              showMoreStreams ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {showMoreStreams && (
                          <ul className="space-y-1 sm:space-y-2 mt-2 ml-4 sm:ml-6 animate-fadeIn">
                            {additionalStreams.map((stream) => (
                              <li key={stream.stream_id}>
                                <button
                                  className="flex justify-between border-b border-gray-200 font-medium text-gray-600 w-full text-left py-2 sm:py-3 hover:text-primary-main hover:bg-gray-50 rounded-lg px-2 sm:px-3 transition-colors"
                                  onClick={() => {
                                    setActiveStream(stream.stream_id);
                                    setActiveSubSection("colleges");
                                  }}
                                >
                                  <span className="text-xs sm:text-sm">
                                    {stream.stream_name}
                                  </span>
                                  <FaChevronRight className="text-xs sm:text-sm" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )}
                  </ul>
                ) : (
                  <div className="animate-slideIn">
                    <div className="flex items-center gap-2 py-3 sm:py-4 text-primary-main px-2 sm:px-3 mb-4">
                      <h3 className="font-semibold uppercase text-xs sm:text-sm">
                        {getOptionLabel(
                          activeSubSection,
                          (overStreamData || []).find(
                            (s) => s.stream_id === activeStream
                          )?.stream_name || "More"
                        )}
                      </h3>
                      <FaArrowLeft
                        className="cursor-pointer text-sm sm:text-base hover:bg-gray-100 p-1 rounded-lg transition-colors"
                        onClick={() => setActiveSubSection(null)}
                      />
                    </div>
                    <div className="px-2 sm:px-3">
                      {renderOptions(
                        activeSubSection,
                        activeStream,
                        (overStreamData || []).find(
                          (s) => s.stream_id === activeStream
                        )?.stream_name || "Unknown"
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-6 sm:mt-8">
                  <SearchModal />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <header className="desktop-header bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
              <Link
                href="/"
                prefetch
                className="text-primary-main py-1 text-lg sm:text-xl lg:text-2xl font-bold"
              >
                collegepucho
              </Link>
              <NavigationMenu className="relative">
                <NavigationMenuList className="flex items-center gap-2">
                  {Object.entries(streamNames).map(([id, { name, icon }]) => (
                    <NavigationMenuItem
                      key={id}
                      onMouseEnter={() => setCurrentStream(Number(id))}
                    >
                      <NavigationMenuTrigger className="gap-2 text-gray-700 px-3 py-2">
                        {icon} {name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="absolute left-0 z-50">
                        <div className="w-full rounded-[20px] bg-white overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                          <div className="flex h-[300px] w-[500px] lg:w-[600px]">
                            <div className="w-1/2 bg-[#FAFBFC] py-6 px-4 lg:px-5">
                              <div className="text-[11px] font-bold text-[#1C1C1C] mb-4 uppercase tracking-wide">
                                Particulars
                              </div>
                              <div className="space-y-1">
                                {navOptions.map((option) => (
                                  <button
                                    key={option}
                                    onMouseEnter={() =>
                                      setHoveredOption(option)
                                    }
                                    className={clsx(
                                      "text-left w-full px-3 py-[10px] rounded-md text-[14px] font-medium transition-all duration-200 flex items-center",
                                      hoveredOption === option
                                        ? "bg-[#EEF2FF] text-[#4F46E5]"
                                        : "text-[#4B5563] hover:bg-gray-50"
                                    )}
                                  >
                                    {getOptionLabel(option, name)}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="w-full py-6 px-4 lg:px-6 flex flex-col">
                              <div className="text-[14px] font-bold text-[#1C1C1C] mb-4 uppercase">
                                {getOptionLabel(hoveredOption, name)}
                              </div>
                              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-[10px]">
                                  {renderOptions(
                                    hoveredOption,
                                    Number(id),
                                    name
                                  )}
                                </div>
                              </div>
                              <Link
                                href={`/college/${name.toLowerCase()}-colleges`}
                                className="mt-4 block w-full bg-[#FF9B26] hover:bg-[#F08C1B] text-white text-[14px] font-semibold py-[10px] px-4 rounded-full text-center transition-colors duration-200"
                              >
                                View all {name} Colleges →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                  {additionalStreams.length > 0 ? (
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-gray-700 px-2 lg:px-3 py-2 text-sm lg:text-base">
                        More
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="absolute left-0 z-50">
                        <div className="w-full rounded-[20px] bg-white overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                          <div className="flex h-[250px] lg:h-[300px] flex-row w-[500px] lg:w-[600px] xl:w-[700px] 2xl:w-[800px]">
                            <div className="w-[30%] lg:w-[28.5%] bg-[#FAFBFC] py-4 lg:py-6 px-3 lg:px-5 flex flex-col">
                              <div className="text-[10px] lg:text-[11px] font-bold text-[#1C1C1C] mb-3 lg:mb-4 uppercase tracking-wide">
                                More Streams
                              </div>
                              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-1">
                                  {additionalStreams.map((stream) => (
                                    <button
                                      key={stream.stream_id}
                                      type="button"
                                      onMouseEnter={() =>
                                        setActiveMoreStream(stream)
                                      }
                                      className={clsx(
                                        "text-left w-full px-2 lg:px-3 py-2 lg:py-[10px] rounded-md text-[12px] lg:text-[14px] font-medium transition-colors duration-200 flex items-center",
                                        activeMoreStream?.stream_id ===
                                          stream.stream_id
                                          ? "bg-[#EEF2FF] text-[#4F46E5]"
                                          : "text-[#4B5563] hover:bg-gray-50"
                                      )}
                                    >
                                      {activeMoreStream?.stream_id ===
                                        stream.stream_id && (
                                        <span className="text-[#4F46E5] mr-2 text-lg leading-none">
                                          •
                                        </span>
                                      )}
                                      {stream.stream_name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="w-[70%] lg:w-[71.5%] py-4 lg:py-6 px-3 lg:px-6 flex flex-col">
                              {activeMoreStream && (
                                <>
                                  <div className="text-[12px] lg:text-[14px] font-bold text-[#1C1C1C] mb-3 lg:mb-4 uppercase">
                                    Top {activeMoreStream.stream_name} Colleges
                                  </div>
                                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="space-y-[8px] lg:space-y-[10px]">
                                      {activeMoreStream.colleges
                                        .slice(0, 8)
                                        .map((college) => (
                                          <Link
                                            key={college.college_id}
                                            href={`/colleges/${college.slug.replace(
                                              /-\d+$/,
                                              ""
                                            )}-${college.college_id}`}
                                            className="text-xs lg:text-sm block text-[#4B5563] py-2 lg:py-[10px] hover:text-[#4F46E5]"
                                            onClick={closeNavbar}
                                          >
                                            {college.college_name} (
                                            {college.city_name})
                                          </Link>
                                        ))}
                                    </div>
                                  </div>
                                  <Link
                                    href={`/college/${formatName(
                                      activeMoreStream.stream_name.toLowerCase()
                                    )}-colleges`}
                                    className="mt-3 lg:mt-4 block w-full bg-[#FF9B26] hover:bg-[#F08C1B] text-white text-[12px] lg:text-[14px] font-semibold py-2 lg:py-[10px] px-3 lg:px-4 rounded-full text-center transition-colors duration-200"
                                    onClick={closeNavbar}
                                  >
                                    View all {activeMoreStream.stream_name}{" "}
                                    Colleges →
                                  </Link>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-gray-700 px-2 lg:px-3 py-2 text-sm lg:text-base">
                        More
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="absolute left-0 z-50">
                        <div className="w-full rounded-[20px] bg-white overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                          <div className="flex h-[250px] lg:h-[300px] items-center justify-center w-[500px] lg:w-[600px] xl:w-[700px] 2xl:w-[800px]">
                            <div className="text-center">
                              {loading ? (
                                <>
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main mx-auto mb-2"></div>
                                  <p className="text-gray-500 text-sm">
                                    Loading additional streams...
                                  </p>
                                </>
                              ) : (
                                <p className="text-gray-500 text-sm">
                                  No additional streams available at the moment.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>

              <div className="flex items-center space-x-2 lg:space-x-4">
                <SearchModal />
                <LeadModal />
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
