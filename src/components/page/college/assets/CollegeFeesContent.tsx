import { InfoSection } from "@/api/@types/college-info";
import TocGenerator from "@/components/miscellaneous/TocGenerator";
import { sanitizeHtml } from "@/components/utils/sanitizeHtml";
import React, { useMemo } from "react";

interface CollegeFeesContentProps {
  news: InfoSection[];
  content: InfoSection[];
}

const CollegeFeesContent: React.FC<CollegeFeesContentProps> = ({
  news,
  content,
}) => {
  // Memoize the sanitized HTML to avoid unnecessary processing
  const sanitizedHtml = useMemo(() => {
    if (!content?.[0]?.description) return null;
    return sanitizeHtml(content[0].description);
  }, [content]);

  // Early return if no content
  if (!sanitizedHtml) {
    return (
      <div className="text-center py-8" role="status" aria-live="polite">
        <div className="max-w-md mx-auto">
          <div className="text-gray-500 mb-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No content available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <section 
      className="mb-8" 
      role="region" 
      aria-label="College Fees Information"
    >
      {/* Table of Contents */}
      <div className="mb-6">
        <TocGenerator content={sanitizedHtml} />
      </div>

      {/* Main Content */}
      <article 
        className="prose prose-gray max-w-none"
        aria-labelledby="fees-content-heading"
      >
        {content?.[0]?.title && (
          <h2 
            id="fees-content-heading" 
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            {content[0].title}
          </h2>
        )}
        
        <div 
          className="fees-content"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          aria-label="Detailed fee information"
        />
      </article>

      {/* Additional Notes */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-amber-800">
            <p className="font-medium">Disclaimer:</p>
            <p className="mt-1">
              The information provided here is for reference purposes only. Please verify all details with the college administration before making any decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CollegeFeesContent);
