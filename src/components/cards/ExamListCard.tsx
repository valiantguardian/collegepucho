import { ExamInformationDTO } from "@/api/@types/exam-type";
import React from "react";
import { formatDate } from "../utils/formatDate";
import Link from "next/link";
import { HiOutlineBookmark, HiOutlineArrowNarrowRight } from "react-icons/hi";

const ExamListCard: React.FC<{ exam: ExamInformationDTO }> = ({ exam }) => {
  return (
    <div className="bg-white border-2 border-dashed border-primary-light rounded-2xl px-6 py-5 flex flex-col min-h-[170px] relative">
      {/* Bookmark icon top right */}
      <HiOutlineBookmark className="absolute top-4 right-4 text-gray-4 text-xl" />
      {/* Title and subtitle */}
      <Link
        href={`/exams/${exam.slug}-${exam.exam_id}`}
        className="text-base font-semibold text-primary-main mb-0.5 line-clamp-1 hover:underline focus:underline outline-none"
      >
        {exam.exam_name}
      </Link>
      <div className="text-gray-5 text-sm font-medium mb-4 line-clamp-1">{exam.exam_shortname}</div>
      {/* Details row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-end">
        <div>
          <div className="text-gray-6 text-sm font-medium">{exam.exam_level}</div>
          <div className="text-gray-4 text-xs">Exam Level</div>
        </div>
        <div>
          <div className="text-gray-6 text-sm font-medium">{exam.mode_of_exam}</div>
          <div className="text-gray-4 text-xs">Mode of Exam</div>
        </div>
        <div>
          <div className="text-gray-6 text-sm font-medium">{formatDate(exam.application_start_date)}</div>
          <div className="text-gray-4 text-xs">Application Starts</div>
        </div>
        <div className="flex items-center gap-1 justify-end md:justify-end">
          <Link href={`/exams/${exam.slug}-${exam.exam_id}`} className="group outline-none">
            <HiOutlineArrowNarrowRight className="text-primary-main text-xl group-hover:scale-110 group-focus:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamListCard;
