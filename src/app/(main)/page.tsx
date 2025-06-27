import { getHomeData } from "@/api/list/getHomeData";
import dynamic from "next/dynamic";

const Hero = dynamic(() => import("@/components/page/home/Hero"));
const TopColleges = dynamic(() => import("@/components/page/home/TopColleges"));
// const Cities = dynamic(() => import("@/components/page/home/Cities"));
const News = dynamic(() => import("@/components/page/home/News"));
const TrendingCourse = dynamic(
  () => import("@/components/page/home/TrendingCourse")
);
const PrivateCollege = dynamic(
  () => import("@/components/page/home/PrivateCollege")
);
const Exams = dynamic(() => import("@/components/page/home/Exams"));
// const DistanceCollege = dynamic(
//   () => import("@/components/page/home/DistanceCollege")
// );
const Testimonials = dynamic(
  () => import("@/components/page/home/Testimonials")
);

export default async function Home() {
  const {
    top_colleges: topCollegeData,
    news_section: newsData,
    // top_cities: cityData,
    courses_section: courseSection,
    top_private_colleges_sections: privateCollegeData,
    upcoming_exams: examData,
    // online_section: onlineSection,
  } = await getHomeData();
  const courseData = courseSection.courses;
  return (
    <div>
      <Hero />
      <TopColleges data={topCollegeData} />
      {/* <Cities data={cityData} /> */}
      <TrendingCourse data={courseData} />
      <Exams data={examData} />
      <PrivateCollege data={privateCollegeData} />
      <News data={newsData} />
      {/* <DistanceCollege data={onlineSection} /> */}
      <Testimonials />
    </div>
  );
}
