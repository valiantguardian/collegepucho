"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { getCurrentLocation, getCurrentUrl } from "../utils/utils";

const NPSModal = dynamic(() => import("../modals/NPSModal"), { ssr: false });

const RatingComponent: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const responseUrl = getCurrentUrl();
  const location = getCurrentLocation();

  const ratingOptions = useMemo(
    () => [
      { number: 1, label: "Poor" },
      { number: 2, label: "Fair" },
      { number: 3, label: "Good" },
      { number: 4, label: "Very Good" },
      { number: 5, label: "Excellent" },
    ],
    []
  );

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setModalOpen(true);
  };

  return (
    <div className="bg-white border border-gray-3 rounded-xl p-8 mb-4 mt-4 sm:mt-2 shadow-card1">
      <div className="text-center mb-8">
        <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-2">
          Rate Your Experience
        </h3>
        <p className="text-text-secondary text-sm md:text-base">
          How would you rate your experience with this page?
        </p>
      </div>
      
      <div className="flex justify-center items-center space-x-2 md:space-x-4">
        {ratingOptions.map(({ number, label }) => (
          <div
            key={number}
            className="group cursor-pointer transition-all duration-200"
            onClick={() => handleRatingClick(number)}
          >
            <div className="relative">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-2 hover:bg-primary-2 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-card2">
                <span className="text-lg md:text-xl font-bold text-text-primary group-hover:text-primary-main transition-colors duration-200">
                  {number}
                </span>
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-text-primary text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {label}
                </div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-text-primary mx-auto"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-xs text-text-secondary">
          Click on a number to rate your experience
        </p>
      </div>

      {modalOpen && selectedRating !== null && (
        <NPSModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          rating={selectedRating}
          response_url={responseUrl}
          location={location}
        />
      )}
    </div>
  );
};

export default RatingComponent;
