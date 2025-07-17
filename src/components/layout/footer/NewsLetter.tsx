import LeadModal from "@/components/modals/LeadModal";
import React from "react";
import { RiCustomerService2Fill } from "react-icons/ri";

const NewsLetter = () => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 py-12 px-6 bg-gray-800 rounded-2xl my-8">
      <div className="col-span-1 animate-fade-in-left">
        <h2 className="text-white font-sans font-bold text-4xl md:text-6xl lg:text-7xl mb-8">
          Confusion chhodo,{" "}
          <span className="text-primary-1 inline-block">EXPERT</span>{" "}
          <span className="inline-block">ki suno</span>
        </h2>
        <LeadModal
          triggerText={
            <span className="inline-flex items-center gap-2 bg-primary-1 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-primary-2 transition-all duration-300 hover:scale-105 active:scale-95">
              <RiCustomerService2Fill className="text-2xl" /> Get FREE counselling!
            </span>
          }
        />
      </div>
      <div className="col-span-1 font-semibold text-white text-lg space-y-6 flex justify-center flex-col animate-fade-in-right">
        <div className="flex items-center gap-4 hover:translate-x-2 transition-transform duration-300">
          <div className="w-2 h-2 bg-primary-1 rounded-full"></div>
          <p>
            <span className="text-primary-1">Personalized </span> College & Course
            Recommendations
          </p>
        </div>
        <div className="flex items-center gap-4 hover:translate-x-2 transition-transform duration-300">
          <div className="w-2 h-2 bg-primary-1 rounded-full"></div>
          <p>
            Expert <span className="text-primary-1">Counselling </span>Services
          </p>
        </div>
        <div className="flex items-center gap-4 hover:translate-x-2 transition-transform duration-300">
          <div className="w-2 h-2 bg-primary-1 rounded-full"></div>
          <p>
            In-Depth <span className="text-primary-1">College Comparisons</span>
          </p>
        </div>
        <div className="flex items-center gap-4 hover:translate-x-2 transition-transform duration-300">
          <div className="w-2 h-2 bg-primary-1 rounded-full"></div>
          <p>
            <span className="text-primary-1">Scholarship </span>Assistance
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
