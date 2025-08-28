import { GreExamDTO } from "@/api/@types/exam-type";
import React from "react";
import ExamHead from "./ExamHead";
import { sanitizeHtml } from "@/components/utils/sanitizeHtml";
import TocGenerator from "@/components/miscellaneous/TocGenerator";
import ExamNav from "./ExamNav";
import "@/app/styles/tables.css";


const ExamContent: React.FC<{ exam: GreExamDTO }> = ({ exam }) => {
  // Handle both response structures:
  // 1. examContent as object with description field
  // 2. examContent as string (HTML content)
  let contentToDisplay = "";
  let articleTitle: string | undefined;
  let articleContent: string | undefined;
  
  if (typeof exam.examContent === "string") {
    // examContent is a string (HTML content)
    contentToDisplay = exam.examContent;
  } else if (exam.examContent?.description) {
    // examContent is an object with description field
    contentToDisplay = exam.examContent.description;
    articleTitle = exam.examContent.topic_title;
    articleContent = exam.examContent.meta_desc;
  }
  
  const sanitizedHtml = contentToDisplay ? sanitizeHtml(contentToDisplay) : "";
    
  return (
    <>
      <ExamHead
        data={exam.examInformation}
        title={
          typeof exam.examContent === "object" && exam.examContent?.topic_title
            ? exam.examContent.topic_title
            : exam.examInformation.exam_name
        }
        articleTitle={articleTitle}
        articleContent={articleContent}
      />
      <ExamNav data={exam} />
      <div className="container-body">
        {sanitizedHtml ? (
          <>
            <TocGenerator content={sanitizedHtml} />
            <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Content Coming Soon
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Detailed information about {exam.examInformation.exam_name} will be available soon. 
              Please check back later for updates on syllabus, exam pattern, and other details.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ExamContent;
