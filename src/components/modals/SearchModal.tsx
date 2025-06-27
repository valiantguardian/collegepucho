"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { SearchResultDTO } from "@/api/@types/search-type";
import { getSearchData } from "@/api/individual/getSearchData";
import { MdOutlineSearch, MdClose, MdDelete, MdHistory, MdTrendingUp } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "../utils/useMobile";

const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

interface SearchItem {
  slug: string;
  college_name?: string;
  exam_name?: string;
  full_name?: string;
  title?: string;
  college_id?: number;
  exam_id?: number;
  course_group_id?: number;
  article_id?: number;
}

interface SearchModalProps {
  trigger?: React.ReactNode;
}

const SearchModal: React.FC<SearchModalProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchData, setSearchData] = useState<SearchResultDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<SearchResultDTO | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    setRecentSearches(saved ? JSON.parse(saved) : null);

    let mounted = true;
    const fetchData = async () => {
      try {
        const data = await getSearchData();
        if (mounted) setSearchData(data);
      } catch (err: any) {
        if (mounted) setError(err.message);
      }
    };
    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const openModal = useCallback(() => setIsOpen(true), []);
  const isMobile = useIsMobile();
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSearchTerm("");
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 100),
    []
  );

  const filteredResults = useMemo(() => {
    if (!searchData || !searchTerm) return null;

    const lowerSearch = searchTerm.toLowerCase();
    const filterItems = <T extends { [key: string]: any }>(
      items: T[],
      keys: string[]
    ): T[] =>
      items
        .filter((item) =>
          keys.some((key) =>
            String(item[key]).toLowerCase().includes(lowerSearch)
          )
        )
        .slice(0, 4);

    const results = {
      college_search: filterItems(searchData.college_search, [
        "college_name",
        "short_name",
        "slug",
      ]),
      exam_search: filterItems(searchData.exam_search, [
        "exam_name",
        "exam_shortname",
        "slug",
      ]),
      course_group_search: filterItems(searchData.course_group_search, [
        "name",
        "full_name",
        "slug",
      ]),
      articles_search: filterItems(searchData.articles_search, [
        "title",
        "tags",
        "slug",
      ]),
    };

    if (Object.values(results).some((arr) => arr.length > 0)) {
      localStorage.setItem("recentSearches", JSON.stringify(results));
      setRecentSearches(results);
    }

    return results;
  }, [searchData, searchTerm]);

  const mixedResults = useMemo(
    () =>
      filteredResults
        ? [
            ...filteredResults.college_search,
            ...filteredResults.exam_search,
            ...filteredResults.course_group_search,
            ...filteredResults.articles_search,
          ].slice(0, 8)
        : [],
    [filteredResults]
  );

  const mixedRecentSearches = useMemo(
    () =>
      recentSearches
        ? [
            ...recentSearches.college_search,
            ...recentSearches.exam_search,
            ...recentSearches.course_group_search,
            ...recentSearches.articles_search,
          ].slice(0, 8)
        : [],
    [recentSearches]
  );

  const clearSingleSearch = useCallback(
    (slug: string) => {
      if (!recentSearches) return;

      const updatedSearches = {
        college_search: recentSearches.college_search.filter(
          (item) => item.slug !== slug
        ),
        exam_search: recentSearches.exam_search.filter(
          (item) => item.slug !== slug
        ),
        course_group_search: recentSearches.course_group_search.filter(
          (item) => item.slug !== slug
        ),
        articles_search: recentSearches.articles_search.filter(
          (item) => item.slug !== slug
        ),
      };

      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      setRecentSearches(updatedSearches);
    },
    [recentSearches]
  );

  const clearAllSearches = useCallback(() => {
    localStorage.removeItem("recentSearches");
    setRecentSearches(null);
  }, []);

  const RenderSection = React.memo(
    ({
      items,
      searchTerm,
      showDelete = false,
    }: {
      items: SearchItem[];
      searchTerm: string;
      showDelete?: boolean;
    }) => {
      if (!items.length) return null;

      const highlightText = (text: string, term: string) => {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, "gi");
        return text.split(regex).map((part, i) =>
          part.toLowerCase() === term.toLowerCase() ? (
            <span key={i} className="bg-primary-light/20 text-primary-light">
              {part}
            </span>
          ) : (
            part
          )
        );
      };

      return (
        <ul className="space-y-2">
          {items.map((item) => {
            const type = item.college_name
              ? "colleges"
              : item.exam_name
              ? "exams"
              : item.full_name
              ? "courses"
              : "articles";
            const labelKey = item.college_name
              ? "college_name"
              : item.exam_name
              ? "exam_name"
              : item.full_name
              ? "full_name"
              : "title";
            const idKey = item.college_id
              ? "college_id"
              : item.exam_id
              ? "exam_id"
              : item.course_group_id
              ? "course_group_id"
              : "article_id";

            return (
              <li
                key={item.slug}
                className="group flex items-center justify-between rounded-xl transition-colors hover:bg-gray-50"
              >
                <Link
                  href={`/${type}/${item.slug.replace(/-\d+$/, "")}-${
                    item[idKey]
                  }`}
                  className="flex-1 p-3 text-gray-700 group-hover:text-primary-light transition-colors"
                  onClick={closeModal}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-primary-light/10 group-hover:text-primary-light transition-colors">
                      {type === "colleges" && "C"}
                      {type === "exams" && "E"}
                      {type === "courses" && "S"}
                      {type === "articles" && "A"}
                    </div>
                    <div>
                      <div className="font-medium">
                        {highlightText(item[labelKey] || "", searchTerm)}
                      </div>
                      <div className="text-xs text-gray-500 capitalize mt-0.5">
                        {type}
                      </div>
                    </div>
                  </div>
                </Link>
                {showDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 mr-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => clearSingleSearch(item.slug)}
                  >
                    <MdClose className="h-4 w-4" />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      );
    }
  );

  RenderSection.displayName = "RenderSection";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary-light/10 transition-colors shadow-sm border"
          >
            <MdOutlineSearch className="h-5 w-5 text-gray-600" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white rounded-2xl">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="sr-only">Search colleges, exams, courses and articles</DialogTitle>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2 border border-gray-100">
            <MdOutlineSearch className="h-5 w-5 text-gray-400 ml-2" />
            <Input
              type="text"
              placeholder="Search colleges, exams, courses..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 text-base"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
        </DialogHeader>

        <div className="p-4 pt-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {searchTerm ? (
            <div className="space-y-4">
              {mixedResults.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <MdTrendingUp className="h-4 w-4" />
                    <span>Search Results</span>
                  </div>
                  <RenderSection items={mixedResults} searchTerm={searchTerm} />
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No results found for "{searchTerm}"
                </div>
              )}
            </div>
          ) : (
            mixedRecentSearches.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MdHistory className="h-4 w-4" />
                    <span>Recent Searches</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-gray-500 hover:text-red-500"
                    onClick={clearAllSearches}
                  >
                    Clear All
                  </Button>
                </div>
                <RenderSection
                  items={mixedRecentSearches}
                  searchTerm=""
                  showDelete
                />
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
