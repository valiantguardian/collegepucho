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
  10: { name: "Engineering", icon: <FaUniversity /> },
  21: { name: "Management", icon: <FaBusinessTime /> },
  1: { name: "Medical", icon: <FaUserMd /> },
  4: { name: "Design", icon: <FaPalette /> },
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
  const [activeMoreStream, setActiveMoreStream] = useState<OverStreamSectionProps | null>(null);

  const additionalStreams = useMemo(() => {
    const mainStreamIds = Object.keys(streamNames).map(Number);
    return overStreamData.filter(stream => {
      // Check if this stream's ID is not in mainStreamIds
      const isNotMainStream = !mainStreamIds.includes(stream.stream_id);
      // Also check if this stream's name is not one of the main stream names
      const isNotMainStreamName = !Object.values(streamNames).some(
        ({ name }) => name.toLowerCase() === stream.stream_name.toLowerCase()
      );
      return isNotMainStream && isNotMainStreamName;
    });
  }, [overStreamData]);

  const fetchNavData = useCallback(async () => {
    setLoading(true);
    try {
      const { over_stream_section, cities_section } = await getNavData();
      setOverStreamData(over_stream_section);
      setCitiesData(cities_section.slice(0, 10));
      setExamsByStream(
        over_stream_section.reduce((acc, stream) => {
          acc[stream.stream_id] = stream.exams.map((exam) => ({
            exam_id: exam.exam_id,
            slug: exam.slug ?? "",
            exam_name: exam.exam_name,
          }));
          return acc;
        }, {} as Record<number, { exam_id: number; slug: string; exam_name: string }[]>)
      );
    } catch (error) {
      console.error("Error loading stream data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNavData();
  }, [fetchNavData]);

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

  const renderOptions = (type: NavOption, streamId: number | null, streamName?: string) => {
    if (!streamId || !streamName) return null;
    const stream = overStreamData.find((s) => s.stream_id === streamId);
    if (!stream) return null;

    switch (type) {
      case "colleges":
        return (
          <div>
            {stream.colleges.map((college) => (
              <Link
                key={college.college_id}
                href={`/colleges/${college.slug.replace(/-\d+$/, "")}-${college.college_id}`}
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
            {citiesData.map((city) => (
              <Link
                key={city.city_id}
                href={`/college/${formatName(streamName)}-colleges-in-${city.city_id}`}
                className="text-sm block text-[#4B5563] py-[10px] hover:text-[#4F46E5]"
                onClick={closeNavbar}
              >
                {streamName} Colleges in {city.city_name}
              </Link>
            ))}
          </div>
        );
      case "exams":
        return (
          <div>
            {examsByStream[streamId]?.map((exam) => (
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
            {overStreamData
              .find((stream) => stream.stream_id === 10)
              ?.colleges.slice(0, 6)
              .map((college) => (
                <li key={college.college_id}>{college.college_name}</li>
              ))}
          </ul>
        </>
      ),
      href: "/colleges/engineering-colleges",
    },
    {
      label: "Colleges By Location",
      content: (
        <>
          <div className="font-bold text-sm mb-3">COLLEGES BY LOCATION</div>
          <ul className="space-y-2 text-gray-600 text-sm">
            {citiesData.slice(0, 6).map((city) => (
              <li key={city.city_id}>
                Engineering Colleges in {city.city_name}
              </li>
            ))}
          </ul>
        </>
      ),
      href: "/colleges/engineering-colleges-by-location",
    },
    {
      label: "Engineering Exams",
      content: (
        <>
          <div className="font-bold text-sm mb-3">ENGINEERING EXAMS</div>
          <ul className="space-y-2 text-gray-600 text-sm">
            {examsByStream[10]?.slice(0, 6).map((exam) => (
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
    href: `/colleges/${stream.stream_name.toLowerCase()}-colleges`,
  }));

  // Initialize activeMoreStream with the first stream
  useEffect(() => {
    if (additionalStreams.length > 0 && !activeMoreStream) {
      setActiveMoreStream(additionalStreams[0]);
    }
  }, [additionalStreams, activeMoreStream]);

  return (
    <>
      {isMobile ? (
        <div className="flex justify-between items-center p-2">
          <Link
            href="/"
            prefetch
            className="text-primary-main py-1 text-xl font-bold"
            onClick={closeNavbar}
          >
            collegepucho
          </Link>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button
                className="menu-icon focus:outline-none"
                aria-label="Open navigation menu"
              >
                <FaBars />
              </button>
            </SheetTrigger>
            <SheetContent className="p-2 z-[101] w-[85%]">
              <DialogTitle
                asChild
                className="flex justify-between items-center w-fit"
              >
                <Link
                  href="/"
                  prefetch
                  className="text-primary-main py-1 text-xl font-bold"
                  onClick={closeNavbar}
                >
                  collegepucho
                </Link>
              </DialogTitle>

              <nav className="overflow-y-auto h-full">
                {!activeSubSection ? (
                  <ul className="space-y-2">
                    {Object.entries(streamNames).map(([id, { name, icon }]) => (
                      <li key={id}>
                        <button
                          className="flex items-center justify-between w-full text-gray-700 font-semibold py-3 hover:text-primary-main"
                          onClick={() =>
                            setActiveStream(
                              activeStream === Number(id) ? null : Number(id)
                            )
                          }
                        >
                          <div
                            className={`flex items-center gap-3 ${
                              activeStream === Number(id)
                                ? "text-primary-main"
                                : "text-gray-700"
                            }`}
                          >
                            {icon} {name}
                          </div>
                          <FaChevronDown
                            className={`transition-transform ${
                              activeStream === Number(id) ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {activeStream === Number(id) && (
                          <ul className="space-y-2 mt-2 animate-fadeIn">
                            {navOptions.map((option) => (
                              <li key={option}>
                                <button
                                  className="flex justify-between border-b font-medium text-gray-600 w-full text-left py-2 hover:text-primary-main"
                                  onClick={() => setActiveSubSection(option)}
                                >
                                  {getOptionLabel(option, name)}
                                  <FaChevronRight />
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
                          className="flex items-center justify-between w-full text-gray-700 font-semibold py-3 hover:text-primary-main"
                          onClick={() => setShowMoreStreams(!showMoreStreams)}
                        >
                          <div className="flex items-center gap-3">
                            <FaEllipsisH /> More
                          </div>
                          <FaChevronDown
                            className={`transition-transform ${
                              showMoreStreams ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {showMoreStreams && (
                          <ul className="space-y-2 mt-2 animate-fadeIn">
                            {additionalStreams.map((stream) => (
                              <li key={stream.stream_id}>
                                <button
                                  className="flex justify-between border-b font-medium text-gray-600 w-full text-left py-2 hover:text-primary-main"
                                  onClick={() => {
                                    setActiveStream(stream.stream_id);
                                    setActiveSubSection("colleges");
                                  }}
                                >
                                  {stream.stream_name}
                                  <FaChevronRight />
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
                    <div className="flex items-center gap-2 py-3 text-primary-main px-2">
                      <h3 className="font-semibold uppercase text-sm">
                        {getOptionLabel(
                          activeSubSection,
                          streamNames[activeStream!]?.name || "More"
                        )}
                      </h3>
                      <FaArrowLeft
                        className="cursor-pointer"
                        onClick={() => setActiveSubSection(null)}
                      />
                    </div>
                    <div className="px-2">
                      {renderOptions(
                        activeSubSection,
                        activeStream,
                        streamNames[activeStream!]?.name ||
                          overStreamData.find(
                            (s) => s.stream_id === activeStream
                          )?.stream_name
                      )}
                    </div>
                  </div>
                )}
                <SearchModal />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <div
          className={clsx(
            "sticky top-0 z-50 bg-white border-b transition-shadow duration-200",
            scrolling && "shadow-md"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/"
                prefetch
                className="text-primary-main py-1 text-xl font-bold"
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
                      <NavigationMenuContent className="absolute left-0">
                        <div className="w-full rounded-[20px] bg-white overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                          <div className="flex h-[300px]">
                            <div className="w-[28.5%] bg-[#FAFBFC] py-6 px-5">
                              <div className="text-[11px] font-bold text-[#1C1C1C] mb-4 uppercase tracking-wide">
                                Particulars
                              </div>
                              <div className="space-y-1">
                                {navOptions.map((option) => (
                                  <button
                                    key={option}
                                    onMouseEnter={() => setHoveredOption(option)}
                                    className={clsx(
                                      "text-left w-full px-3 py-[10px] rounded-md text-[14px] font-medium transition-all duration-200 flex items-center",
                                      hoveredOption === option
                                        ? "bg-[#EEF2FF] text-[#4F46E5]"
                                        : "text-[#4B5563] hover:bg-gray-50"
                                    )}
                                  >
                                    {option === hoveredOption && (
                                      <span className="text-[#4F46E5] mr-2 text-lg leading-none">•</span>
                                    )}
                                    {getOptionLabel(option, name)}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="w-[71.5%] py-6 px-6 flex flex-col">
                              <div className="text-[14px] font-bold text-[#1C1C1C] mb-4 uppercase">
                                {getOptionLabel(hoveredOption, name)}
                              </div>
                              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-[10px]">
                                  {renderOptions(hoveredOption, currentStream, name)}
                                </div>
                              </div>
                              <Link
                                href={`/colleges/${name.toLowerCase()}-colleges`}
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
                      <NavigationMenuTrigger className="text-gray-700 px-3 py-2">
                        More
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="absolute left-0">
                        <div className="w-full rounded-[20px] bg-white overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                          <div className="flex h-[300px]">
                            <div className="w-[28.5%] bg-[#FAFBFC] py-6 px-5 flex flex-col">
                              <div className="text-[11px] font-bold text-[#1C1C1C] mb-4 uppercase tracking-wide">
                                More Streams
                              </div>
                              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-1">
                                  {additionalStreams.map((stream) => (
                                    <button
                                      key={stream.stream_id}
                                      type="button"
                                      onMouseEnter={() => setActiveMoreStream(stream)}
                                      className={clsx(
                                        "text-left w-full px-3 py-[10px] rounded-md text-[14px] font-medium transition-colors duration-200 flex items-center",
                                        activeMoreStream?.stream_id === stream.stream_id
                                          ? "bg-[#EEF2FF] text-[#4F46E5]"
                                          : "text-[#4B5563] hover:bg-gray-50"
                                      )}
                                    >
                                      {activeMoreStream?.stream_id === stream.stream_id && (
                                        <span className="text-[#4F46E5] mr-2 text-lg leading-none">•</span>
                                      )}
                                      {stream.stream_name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="w-[71.5%] py-6 px-6 flex flex-col">
                              {activeMoreStream && (
                                <>
                                  <div className="text-[14px] font-bold text-[#1C1C1C] mb-4 uppercase">
                                    Top {activeMoreStream.stream_name} Colleges
                                  </div>
                                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="space-y-[10px]">
                                      {activeMoreStream.colleges.map((college) => (
                                        <Link
                                          key={college.college_id}
                                          href={`/colleges/${college.slug.replace(/-\d+$/, "")}-${college.college_id}`}
                                          className="text-sm block text-[#4B5563] py-[10px] hover:text-[#4F46E5]"
                                          onClick={closeNavbar}
                                        >
                                          {college.college_name} ({college.city_name})
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                  <Link
                                    href={`/colleges/${formatName(activeMoreStream.stream_name.toLowerCase())}-colleges`}
                                    className="mt-4 block w-full bg-[#FF9B26] hover:bg-[#F08C1B] text-white text-[14px] font-semibold py-[10px] px-4 rounded-full text-center transition-colors duration-200"
                                    onClick={closeNavbar}
                                  >
                                    View all {activeMoreStream.stream_name} Colleges →
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
                      <NavigationMenuTrigger className="text-gray-700 px-3 py-2">
                        More
                      </NavigationMenuTrigger>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>

              <div className="flex items-center space-x-4">
                <SearchModal />
                <LeadModal />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
