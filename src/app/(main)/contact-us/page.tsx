"use server";

import { CourseDTO } from "@/api/@types/course-type";
import { getCourses } from "@/api/list/getCourses";
import ContactForm from "@/components/forms/ContactForm";

export default async function Contact() {
  let courses: CourseDTO[] = [];
  
  try {
    const coursesData = await getCourses();
    courses = coursesData.courses || [];
  } catch (error) {
    // During build time or API issues, courses will be empty
    // This is expected behavior for public pages
    console.log("Courses not available during build:", error);
  }

  return <ContactForm courseData={courses} />;
}
