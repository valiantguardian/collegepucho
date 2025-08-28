import { HomeExam } from "@/api/@types/home-datatype";
import React from "react";
import { formatDate } from "../utils/formatDate";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HomeExamCard: React.FC<{ exam: HomeExam }> = ({ exam }) => {
  const { exam_name, level_of_exam, exam_date, mode_of_exam, slug, exam_id } =
    exam;
  return (
    <div className="bg-white shadow-card1 rounded-xl border border-[#F9FAFB]">
      <div className="flex justify-center  flex-col p-4">
        <Link
          href={`/exams/${slug}-${exam_id}`}
          className="text-base font-semibold line-clamp-1 hover:text-primary-main transition-colors"
        >
          {exam_name}
        </Link>
        <p className="text-[#637381] text-md">{level_of_exam}</p>
      </div>
      <div className="flex justify-around items-center border-t border-dashed border-[#DFE3E8] p-4">
        <div>
          <p className="text-sm text-[#637381] text-center">Exam Date</p>
          <p className=" font-medium text-center text-md">
            {formatDate(exam_date)}
          </p>
        </div>
        <div>
          <p className="text-sm text-[#637381] text-center">Mode</p>
          <p className=" font-medium text-center text-md">{mode_of_exam}</p>
        </div>

        <Link
          href={`/exams/${slug}-${exam_id}`}
          className="text-primary-main bg-[#2B4EFF14] p-4 rounded-xl flex items-center justify-center"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default React.memo(HomeExamCard);
