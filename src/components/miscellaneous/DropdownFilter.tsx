import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuSearch, LuX } from "react-icons/lu";
import clsx from "clsx";

interface FilterOption {
  value: string;
  label: string;
}

interface DropdownFilterProps {
  options: FilterOption[];
  selected: string | null;
  placeholder: string;
  searchable?: boolean;
  onSelect: (value: string | null) => void;
  className?: string;
  containerClassName?: string;
  dropdownClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  error?: boolean;
  loading?: boolean;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  options,
  selected,
  placeholder,
  searchable = false,
  onSelect,
  className = "",
  containerClassName = "",
  dropdownClassName = "",
  inputClassName = "",
  disabled = false,
  error = false,
  loading = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoized filtered options for better performance
  const filteredOptions = useMemo(
    () =>
      search
        ? options.filter((o) =>
            o.label.toLowerCase().includes(search.toLowerCase())
          )
        : options,
    [options, search]
  );

  // Enhanced click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            onSelect(filteredOptions[highlightedIndex].value);
            setOpen(false);
            setSearch("");
            setHighlightedIndex(-1);
          }
          break;
        case "Escape":
          event.preventDefault();
          setOpen(false);
          setSearch("");
          setHighlightedIndex(-1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, filteredOptions, highlightedIndex, onSelect]);

  // Enhanced open/close handler
  const handleToggle = useCallback(() => {
    if (disabled || loading) return;
    
    if (!open) {
      setOpen(true);
      setHighlightedIndex(-1);
      // Focus search input if searchable
      if (searchable && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    } else {
      setOpen(false);
      setSearch("");
      setHighlightedIndex(-1);
    }
  }, [open, disabled, loading, searchable]);

  // Enhanced option selection
  const handleOptionSelect = useCallback((value: string) => {
    onSelect(value);
    setOpen(false);
    setSearch("");
    setHighlightedIndex(-1);
  }, [onSelect]);

  // Enhanced clear selection
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
    setSearch("");
  }, [onSelect]);

  // Get selected option label
  const selectedOption = useMemo(() => 
    options.find((o) => o.value === selected),
    [options, selected]
  );

  // Default classes with enhanced styling
  const defaultContainerClasses = "relative inline-block text-left w-full";
  const defaultButtonClasses = clsx(
    "w-full px-4 py-3 text-sm rounded-xl border bg-white text-text-primary flex justify-between items-center transition-all duration-200",
    "hover:border-primary-main focus:border-primary-main focus:ring-2 focus:ring-primary-main/20 focus:outline-none",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    error ? "border-error-main focus:border-error-main focus:ring-error-main/20" : "border-gray-3",
    className
  );
  const defaultDropdownClasses = clsx(
    "absolute mt-2 w-full bg-white border border-gray-3 rounded-xl shadow-lg z-50 max-h-60 overflow-hidden",
    "animate-in fade-in-0 zoom-in-95 duration-200"
  );
  const defaultInputClasses = clsx(
    "w-full px-4 py-3 border-b border-gray-2 focus:outline-none focus:ring-0 focus:border-primary-main transition-colors duration-200",
    "placeholder:text-gray-4 text-text-primary",
    inputClassName
  );

  return (
    <div
      ref={dropdownRef}
      className={clsx(defaultContainerClasses, containerClassName)}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || loading}
        className={defaultButtonClasses}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="dropdown-label"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-4">
              <div className="w-4 h-4 border-2 border-gray-3 border-t-primary-main rounded-full animate-spin" />
              Loading...
            </div>
          ) : selectedOption ? (
            <span className="truncate text-left">{selectedOption.label}</span>
          ) : (
            <span className="text-gray-4">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-2">
          {selected && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-2 rounded-full transition-colors duration-200"
              aria-label="Clear selection"
            >
              <LuX className="w-3 h-3 text-gray-4" />
            </button>
          )}
          {loading ? (
            <div className="w-4 h-4 border-2 border-gray-3 border-t-primary-main rounded-full animate-spin" />
          ) : (
            <span className="text-gray-4 transition-transform duration-200">
              {open ? <IoIosArrowUp className="w-4 h-4" /> : <IoIosArrowDown className="w-4 h-4" />}
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className={clsx(defaultDropdownClasses, dropdownClassName)}>
          {searchable && (
            <div className="relative p-3 border-b border-gray-2">
              <LuSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-4" />
              <input
                ref={inputRef}
                type="text"
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                className={clsx(defaultInputClasses, "pl-10")}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setOpen(false);
                    setSearch("");
                    setHighlightedIndex(-1);
                  }
                }}
              />
            </div>
          )}
          
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              <ul role="listbox" aria-label={placeholder}>
                {filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={highlightedIndex === index}
                    onClick={() => handleOptionSelect(option.value)}
                    className={clsx(
                      "cursor-pointer px-4 py-3 text-sm transition-colors duration-150",
                      "hover:bg-primary-1 hover:text-primary-main",
                      highlightedIndex === index && "bg-primary-1 text-primary-main",
                      selected === option.value && "bg-primary-main text-white hover:bg-primary-4"
                    )}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center text-gray-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-2 rounded-full flex items-center justify-center">
                  <LuSearch className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">No {placeholder.toLowerCase()} found</p>
                <p className="text-xs text-gray-4 mt-1">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownFilter;
