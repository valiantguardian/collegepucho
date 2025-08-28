"use client";

import { FilterSectionDTO } from "@/api/@types/college-list";
import React, { useState, useCallback, useMemo, memo } from "react";
import debounce from "lodash/debounce";
import {
  IoReloadSharp,
  IoClose,
  IoSearch,
  IoLocation,
  IoSchool,
  IoBusiness,
  IoWallet,
} from "react-icons/io5";

interface CollegeFilterProps {
  filterSection: FilterSectionDTO;
  onFilterChange: (filters: Record<string, string | string[]>) => void;
  isLoading?: boolean;
  selectedFilters: Record<string, string | string[]>;
  isMobile?: boolean;
}

const SkeletonFilterItem = () => (
  <div className="flex items-center space-x-3 animate-pulse my-3">
    <div className="w-4 h-4 bg-gray-200 rounded-md"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
    </div>
  </div>
);

const feeRanges = [
  {
    label: "Below 50K",
    value: "below_50k",
    min: 0,
    max: 50000,
    color: "bg-green-50 text-green-700",
  },
  {
    label: "50K - 1.5L",
    value: "50k_150k",
    min: 50000,
    max: 150000,
    color: "bg-blue-50 text-blue-700",
  },
  {
    label: "1.5L - 3L",
    value: "150k_300k",
    min: 150000,
    max: 300000,
    color: "bg-yellow-50 text-yellow-700",
  },
  {
    label: "3L - 5L",
    value: "300k_500k",
    min: 300000,
    max: 500000,
    color: "bg-orange-50 text-orange-700",
  },
  {
    label: "Above 5L",
    value: "above_500k",
    min: 500000,
    max: Infinity,
    color: "bg-red-50 text-red-700",
  },
];

const CollegeFilter: React.FC<CollegeFilterProps> = memo(
  function CollegeFilter({
    filterSection,
    onFilterChange,
    isLoading = false,
    selectedFilters,
    isMobile = false,
  }) {
    const [searchTerms, setSearchTerms] = useState({
      city: "",
      state: "",
      stream: "",
    });

    const formatForUrl = useCallback(
      (value: string): string => value.toLowerCase().replace(/\s+/g, "-"),
      []
    );

    const handleApiFilterChange = useCallback(
      (filterType: string, value: string, name: string) => {
        const newFilters = {
          ...selectedFilters,
          [filterType]: value === selectedFilters[filterType] ? "" : value,
          [`${filterType}_name`]:
            value === selectedFilters[filterType] ? "" : name,
        };
        onFilterChange(newFilters);
      },
      [selectedFilters, onFilterChange]
    );

    const handleLocalFilterChange = useCallback(
      (filterType: string, value: string) => {
        const currentValues = selectedFilters[filterType] as string[];
        const updatedValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        const newFilters = { ...selectedFilters, [filterType]: updatedValues };
        onFilterChange(newFilters);
      },
      [selectedFilters, onFilterChange]
    );

    const handleClearFilters = useCallback(() => {
      const clearedFilters = {
        city_id: "",
        state_id: "",
        stream_id: "",
        type_of_institute: [],
        fee_range: [],
        city_id_name: "",
        state_id_name: "",
        stream_id_name: "",
      };
      onFilterChange(clearedFilters);
      setSearchTerms({ city: "", state: "", stream: "" });
    }, [onFilterChange]);

    const debouncedSearchChange = useMemo(
      () =>
        debounce((filterType: string, value: string) => {
          setSearchTerms((prev) => ({
            ...prev,
            [filterType]: value.toLowerCase(),
          }));
        }, 300),
      []
    );

    const handleClearSearch = useCallback((filterType: string) => {
      setSearchTerms((prev) => ({
        ...prev,
        [filterType]: "",
      }));
    }, []);

    const areFiltersApplied = useMemo(
      () =>
        selectedFilters.city_id !== "" ||
        selectedFilters.state_id !== "" ||
        selectedFilters.stream_id !== "" ||
        (selectedFilters.type_of_institute as string[]).length > 0 ||
        (selectedFilters.fee_range as string[]).length > 0,
      [selectedFilters]
    );

    const filteredCities = useMemo(
      () =>
        filterSection.city_filter.filter((city) =>
          city.city_name?.toLowerCase().includes(searchTerms.city)
        ),
      [filterSection.city_filter, searchTerms.city]
    );

    const filteredStates = useMemo(
      () =>
        filterSection.state_filter.filter((state) =>
          state.state_name?.toLowerCase().includes(searchTerms.state)
        ),
      [filterSection.state_filter, searchTerms.state]
    );

    const filteredStreams = useMemo(
      () =>
        filterSection.stream_filter.filter((stream) =>
          stream.stream_name?.toLowerCase().includes(searchTerms.stream)
        ),
      [filterSection.stream_filter, searchTerms.stream]
    );

    const FilterSection = ({
      title,
      icon: Icon,
      children,
    }: {
      title: string;
      icon: any;
      children: React.ReactNode;
    }) => (
      <div className="mb-4 sm:mb-6 animate-fadeIn">
        <div className="flex items-center space-x-2 mb-3 sm:mb-4">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-main" />
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
            {title}
          </h3>
        </div>
        {children}
      </div>
    );

    const SearchInput = ({
      placeholder,
      value,
      onChange,
      onClear,
      disabled,
    }: {
      placeholder: string;
      value: string;
      onChange: (value: string) => void;
      onClear: () => void;
      disabled: boolean;
    }) => (
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IoSearch className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-10 py-3 sm:py-2.5 border border-gray-200 rounded-xl text-base sm:text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main transition-all duration-200 bg-gray-50 hover:bg-white"
          disabled={disabled}
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            disabled={disabled}
          >
            <IoClose className="h-4 w-4" />
          </button>
        )}
      </div>
    );

    const FilterOption = ({
      type,
      value,
      label,
      count,
      checked,
      onChange,
    }: {
      type: "radio" | "checkbox";
      value: string;
      label: string;
      count: number;
      checked: boolean;
      onChange: () => void;
    }) => (
      <label
        className={`flex items-center space-x-2 sm:space-x-3 p-3 sm:p-2 rounded-xl transition-all duration-200 cursor-pointer group ${
          checked
            ? "bg-primary-main/5 border border-primary-main/20 shadow-sm"
            : "hover:bg-gray-50 border border-transparent"
        }`}
      >
        <input
          type={type}
          checked={checked}
          onChange={onChange}
          className={`w-5 h-5 sm:w-4 sm:h-4 text-primary-main border-gray-300 rounded focus:ring-primary-main/20 focus:ring-2 transition-all ${
            checked ? "ring-2 ring-primary-main/20" : ""
          }`}
        />
        <div className="flex-1 min-w-0">
          <span
            className={`text-base sm:text-sm font-medium transition-colors ${
              checked
                ? "text-primary-main"
                : "text-gray-700 group-hover:text-primary-main"
            }`}
          >
            {label}
          </span>
          <div
            className={`text-sm sm:text-xs mt-1 sm:mt-0.5 transition-colors ${
              checked ? "text-primary-main/70" : "text-gray-500"
            }`}
          >
            {count} colleges
          </div>
        </div>
        {checked && (
          <div className="w-2 h-2 bg-primary-main rounded-full animate-pulse"></div>
        )}
      </label>
    );

    return (
      <div
        className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${
          isMobile
            ? "w-full max-w-none"
            : "w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
        } ${isMobile ? "" : "sticky top-4"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Filters
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Refine your search
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            disabled={!areFiltersApplied}
            className={`p-2 rounded-full transition-all duration-200 ${
              areFiltersApplied
                ? "text-primary-main hover:bg-primary-main/10 hover:scale-110"
                : "text-gray-400 cursor-not-allowed"
            }`}
            title="Clear all filters"
          >
            <IoReloadSharp className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div
          className={`p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto ${
            isMobile
              ? "max-h-[60vh] filter-mobile-optimized"
              : "max-h-[75vh] lg:max-h-[85vh]"
          } filter-scrollbar`}
        >
          {/* Cities Filter */}
          <FilterSection title="Cities" icon={IoLocation}>
            <SearchInput
              placeholder="Search cities..."
              value={searchTerms.city}
              onChange={(value) => debouncedSearchChange("city", value)}
              onClear={() => handleClearSearch("city")}
              disabled={isLoading}
            />
            <div className="space-y-1 max-h-28 sm:max-h-32 md:max-h-48 overflow-y-auto filter-scrollbar">
              {isLoading || filterSection.city_filter.length === 0
                ? Array.from({ length: isMobile ? 3 : 6 }, (_, index) => (
                    <SkeletonFilterItem key={index} />
                  ))
                : filteredCities.map((city) => (
                    <FilterOption
                      key={city.city_id}
                      type="radio"
                      value={String(city.city_id)}
                      label={city.city_name || ""}
                      count={city.count || 0}
                      checked={selectedFilters.city_id === String(city.city_id)}
                      onChange={() =>
                        handleApiFilterChange(
                          "city_id",
                          String(city.city_id ?? ""),
                          city.city_name ?? ""
                        )
                      }
                    />
                  ))}
            </div>
          </FilterSection>

          {/* States Filter */}
          <FilterSection title="States" icon={IoLocation}>
            <SearchInput
              placeholder="Search states..."
              value={searchTerms.state}
              onChange={(value) => debouncedSearchChange("state", value)}
              onClear={() => handleClearSearch("state")}
              disabled={isLoading}
            />
            <div className="space-y-1 max-h-28 sm:max-h-32 md:max-h-48 overflow-y-auto filter-scrollbar">
              {isLoading || filterSection.state_filter.length === 0
                ? Array.from({ length: isMobile ? 3 : 6 }, (_, index) => (
                    <SkeletonFilterItem key={index} />
                  ))
                : filteredStates.map((state) => (
                    <FilterOption
                      key={state.state_id}
                      type="radio"
                      value={String(state.state_id)}
                      label={state.state_name || ""}
                      count={state.count || 0}
                      checked={
                        selectedFilters.state_id === String(state.state_id)
                      }
                      onChange={() =>
                        handleApiFilterChange(
                          "state_id",
                          String(state.state_id ?? ""),
                          state.state_name ?? ""
                        )
                      }
                    />
                  ))}
            </div>
          </FilterSection>

          {/* Streams Filter */}
          <FilterSection title="Streams" icon={IoSchool}>
            <SearchInput
              placeholder="Search streams..."
              value={searchTerms.stream}
              onChange={(value) => debouncedSearchChange("stream", value)}
              onClear={() => handleClearSearch("stream")}
              disabled={isLoading}
            />
            <div className="space-y-1 max-h-28 sm:max-h-32 md:max-h-48 overflow-y-auto filter-scrollbar">
              {isLoading || filterSection.stream_filter.length === 0
                ? Array.from({ length: isMobile ? 3 : 6 }, (_, index) => (
                    <SkeletonFilterItem key={index} />
                  ))
                : filteredStreams.map((stream) => (
                    <FilterOption
                      key={stream.stream_id}
                      type="radio"
                      value={String(stream.stream_id)}
                      label={stream.stream_name || ""}
                      count={stream.count || 0}
                      checked={
                        selectedFilters.stream_id === String(stream.stream_id)
                      }
                      onChange={() =>
                        handleApiFilterChange(
                          "stream_id",
                          String(stream.stream_id ?? ""),
                          stream.stream_name ?? ""
                        )
                      }
                    />
                  ))}
            </div>
          </FilterSection>

          {/* Type of Institute Filter */}
          <FilterSection title="Institute Type" icon={IoBusiness}>
            <div className="space-y-1">
              {isLoading || filterSection.type_of_institute_filter.length === 0
                ? Array.from({ length: isMobile ? 3 : 6 }, (_, index) => (
                    <SkeletonFilterItem key={index} />
                  ))
                : filterSection.type_of_institute_filter.map((type) => (
                    <FilterOption
                      key={type.value}
                      type="checkbox"
                      value={type.value || ""}
                      label={type.value || ""}
                      count={type.count || 0}
                      checked={(
                        selectedFilters.type_of_institute as string[]
                      ).includes(type.value ?? "")}
                      onChange={() =>
                        handleLocalFilterChange(
                          "type_of_institute",
                          type.value ?? ""
                        )
                      }
                    />
                  ))}
            </div>
          </FilterSection>

          {/* Fee Range Filter */}
          <FilterSection title="Fee Range" icon={IoWallet}>
            <div className="space-y-2">
              {isLoading
                ? Array.from({ length: isMobile ? 2 : 5 }, (_, index) => (
                    <SkeletonFilterItem key={index} />
                  ))
                : feeRanges.map((range) => {
                    const isChecked = (
                      selectedFilters.fee_range as string[]
                    ).includes(range.value);
                    return (
                      <label
                        key={range.value}
                        className={`flex items-center space-x-2 sm:space-x-3 p-3 sm:p-2 rounded-xl transition-all duration-200 cursor-pointer group ${
                          isChecked
                            ? "bg-primary-main/5 border border-primary-main/20 shadow-sm"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            handleLocalFilterChange("fee_range", range.value)
                          }
                          className={`w-5 h-5 sm:w-4 sm:h-4 text-primary-main border-gray-300 rounded focus:ring-primary-main/20 focus:ring-2 transition-all ${
                            isChecked ? "ring-2 ring-primary-main/20" : ""
                          }`}
                        />
                        <div className="flex-1">
                          <span
                            className={`text-base sm:text-sm font-medium transition-colors ${
                              isChecked
                                ? "text-primary-main"
                                : "text-gray-700 group-hover:text-primary-main"
                            }`}
                          >
                            {range.label}
                          </span>
                        </div>
                        <div
                          className={`px-2 sm:px-3 py-1.5 sm:py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            isChecked ? "scale-105 shadow-sm" : ""
                          } ${range.color}`}
                        >
                          {range.label.includes("50K")
                            ? "Budget"
                            : range.label.includes("1.5L")
                            ? "Affordable"
                            : range.label.includes("3L")
                            ? "Mid-range"
                            : range.label.includes("5L")
                            ? "Premium"
                            : "Luxury"}
                        </div>
                        {isChecked && (
                          <div className="w-2 h-2 bg-primary-main rounded-full animate-pulse"></div>
                        )}
                      </label>
                    );
                  })}
            </div>
          </FilterSection>
        </div>
      </div>
    );
  }
);

export default CollegeFilter;
