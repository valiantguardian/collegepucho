import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

type SortOption = {
  label: string;
  value: string;
  sortFn: (a: unknown, b: unknown) => number;
};

const sortOptions: SortOption[] = [
  {
    label: "Recommended",
    value: "kapp_score_desc",
    sortFn: (a: unknown, b: unknown) => Number((b as { kapp_score: string | number }).kapp_score) - Number((a as { kapp_score: string | number }).kapp_score),
  },
  {
    label: "Rating (High - Low)",
    value: "rating_desc",
    sortFn: (a: unknown, b: unknown) => Number((b as { kapp_rating: string | number }).kapp_rating) - Number((a as { kapp_rating: string | number }).kapp_rating),
  },
  {
    label: "Fees (Low - High)",
    value: "min_fees_asc",
    sortFn: (a: unknown, b: unknown) => (Number((a as { min_fees: string | number }).min_fees) || 0) - (Number((b as { min_fees: string | number }).min_fees) || 0),
  },
  {
    label: "Fees (High - Low)",
    value: "max_fees_desc",
    sortFn: (a: unknown, b: unknown) => (Number((b as { max_fees: string | number }).max_fees) || 0) - (Number((a as { max_fees: string | number }).max_fees) || 0),
  },
];

interface CollegeSortProps {
  onSortChange: (sortFn: (a: unknown, b: unknown) => number) => void;
}

const CollegeSort: React.FC<CollegeSortProps> = ({ onSortChange }) => {
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSortChange = (option: SortOption) => {
    setSelectedSort(option.value);
    onSortChange(option.sortFn);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-2xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedSort
            ? sortOptions.find((opt) => opt.value === selectedSort)?.label ||
              "Sort By"
            : "Sort By"}
          <IoChevronDown className="-mr-1 ml-2 h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-2xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`${
                  selectedSort === option.value
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700"
                } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
                onClick={() => handleSortChange(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeSort;