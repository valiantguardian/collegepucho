import { InfoSection } from "@/api/@types/college-info";
import TocGenerator from "@/components/miscellaneous/TocGenerator";
import { sanitizeHtml } from "@/components/utils/sanitizeHtml";
import React from "react";

interface CollegeCourseContentProps {
  news: InfoSection[];
  content: InfoSection[];
}

const CollegeCourseContent: React.FC<CollegeCourseContentProps> = ({
  news,
  content,
}) => {
  const originalHtml = content?.[0]?.description || "";
  const sanitizedHtml = sanitizeHtml(originalHtml);
  const hasSanitized = typeof sanitizedHtml === "string" && sanitizedHtml.trim().length > 0;
  const hasOriginal = typeof originalHtml === "string" && originalHtml.trim().length > 0;

  return (
    <>
      {hasSanitized && <TocGenerator content={sanitizedHtml} />}

      {hasSanitized ? (
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      ) : (
        hasOriginal && <div dangerouslySetInnerHTML={{ __html: originalHtml }} />
      )}
    </>
  );
};

export default CollegeCourseContent;
