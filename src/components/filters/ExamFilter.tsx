"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { IoReloadSharp } from "react-icons/io5";
import { useIsMobile } from "../utils/useMobile";

interface FilterOption {
  value: string;
  count: number;
}

interface FilterOptions {
  exam_category: FilterOption[];
  exam_streams: FilterOption[];
  exam_level: FilterOption[];
}

interface ExamFiltersProps {
  onFilterChange: (filters: {
    category: string[];
    streams: string[];
    level: string[];
  }) => void;
  initialFilters: { category: string[]; streams: string[]; level: string[] };
}

const ExamFilters: React.FC<ExamFiltersProps> = React.memo(
  ({ onFilterChange, initialFilters }) => {
    const isMobile = useIsMobile();
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
      exam_category: [],
      exam_streams: [],
      exam_level: [],
    });
    const [selectedFilters, setSelectedFilters] = useState(initialFilters);

    useEffect(() => {
      const fetchFilters = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;

          if (!API_URL || !BEARER_TOKEN)
            throw new Error("Missing API configuration");

          const response = await fetch(`${API_URL}/exams/exam-filters`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) throw new Error("Failed to fetch filters");

          const { status, data } = await response.json();
          if (status === "success") setFilterOptions(data);
        } catch (error) {
          console.error("Failed to fetch filters:", error);
        }
      };

      fetchFilters();
    }, []);

    useEffect(() => {
      onFilterChange(selectedFilters);
    }, [selectedFilters, onFilterChange]);

    const handleFilterChange = useCallback(
      (type: keyof typeof selectedFilters, value: string) => {
        setSelectedFilters((prev) => {
          const updatedValues = prev[type].includes(value)
            ? prev[type].filter((item) => item !== value)
            : [...prev[type], value];
          return { ...prev, [type]: updatedValues };
        });
      },
      []
    );

    const clearAllFilters = useCallback(() => {
      setSelectedFilters({ category: [], streams: [], level: [] });
    }, []);

    const renderFilterSection = (
      title: string,
      options: FilterOption[],
      type: keyof typeof selectedFilters
    ) => (
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-8 mb-3 tracking-tight">{title}</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {options.map((option, idx) => (
            <label key={type + '-' + option.value + '-' + idx} className="flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                id={`${type}-${option.value}`}
                checked={selectedFilters[type].includes(option.value)}
                onChange={() => handleFilterChange(type, option.value)}
                className="h-4 w-4 accent-primary-main border-gray-3 rounded focus:ring-2 focus:ring-primary-main transition-all duration-150"
              />
              <span className="ml-3 text-sm text-gray-6 font-medium">
                {option.value} <span className="text-gray-4 font-normal">({option.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>
    );

    const DesktopFilters = () => (
      <div className="w-72 p-6 h-fit bg-gray-1 rounded-2xl shadow-card1 lg:sticky lg:top-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-8 tracking-tight">Filters</h2>
          <button
            onClick={clearAllFilters}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-2 text-gray-5 hover:bg-primary-1 hover:text-primary-main transition"
            title="Clear All"
          >
            <IoReloadSharp className="w-5 h-5" />
          </button>
        </div>
        {renderFilterSection(
          "Stream-wise",
          filterOptions.exam_streams,
          "streams"
        )}
        {renderFilterSection("Application Mode", filterOptions.exam_category, "category")}
        {renderFilterSection("Examination Mode", filterOptions.exam_level, "level")}
      </div>
    );

    const MobileFilters = () => (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2">
            <FilterIcon className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-4">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-500 hover:underline mb-4"
            >
              Clear All
            </button>
            {renderFilterSection(
              "Category",
              filterOptions.exam_category,
              "category"
            )}
            {renderFilterSection(
              "Streams",
              filterOptions.exam_streams,
              "streams"
            )}
            {renderFilterSection("Level", filterOptions.exam_level, "level")}
          </div>
        </SheetContent>
      </Sheet>
    );

    return isMobile ? <MobileFilters /> : <DesktopFilters />;
  }
);

ExamFilters.displayName = "ExamFilters";

export default ExamFilters;
