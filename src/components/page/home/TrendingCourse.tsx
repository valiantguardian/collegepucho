import { HomeCourse } from "@/api/@types/home-datatype";
import { Pencil } from "lucide-react";

import React from "react";

interface TrendingCourseProps {
  data: HomeCourse[];
}

const TrendingCourse: React.FC<TrendingCourseProps> = ({ data }) => {
  return (
    <div className="bg-primary-darker container-body pb-6 md:pb-8">
      <div className="flex justify-center items-center py-6">
        <h2 className="font-bold lg:text-5xl  text-white">Trending Courses</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-8">
        {data.map((course) => (
          <div
            key={course.course_id}
            className="p-2 md:p-4 bg-white rounded-xl min-w-20 md:min-w-32 aspect-square text-center grid grid-rows-2 gap-2 place-items-center"
          >
            <div className="w-12 aspect-square bg-secondary-main rounded-xl flex items-center justify-center">
                <Pencil className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-primary-darker font-medium text-sm line-clamp-1">
              {course.short_name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCourse;
