import { FeeDTO } from "@/api/@types/college-info";
import { formatFeeRange } from "@/components/utils/utils";
import React, { useMemo } from "react";

interface CollegeFeesDataProps {
  data: FeeDTO[];
}

// Fee details configuration for better maintainability
const FEE_DETAILS_CONFIG = [
  {
    key: "tuition",
    label: "Tuition",
    description: "Tuition fee is calculated on the basis of 1st year/semester. Actual amount may vary.",
    minKey: "total_tution_fees_min" as keyof FeeDTO,
    maxKey: "total_tution_fees_max" as keyof FeeDTO,
  },
  {
    key: "oneTime",
    label: "One Time Payment",
    description: "One time payment includes Admission fees (Non Refundable), Student welfare fund (Non Refundable), Institute Security Deposits (Refundable), Library Security Deposits (Refundable).",
    minKey: "min_one_time_fees" as keyof FeeDTO,
    maxKey: "max_one_time_fees" as keyof FeeDTO,
  },
  {
    key: "hostel",
    label: "Hostel",
    description: "Hostel fee is calculated on the basis of 1st semester. Actual amount may vary. The fees might include components other than hostel fees. Meal Plan is included in mentioned fee.",
    minKey: "min_hostel_fees" as keyof FeeDTO,
    maxKey: "max_hostel_fees" as keyof FeeDTO,
  },
  {
    key: "other",
    label: "Other Fees",
    description: "Other fees include miscellaneous charges, examination fees, and other academic expenses.",
    minKey: "min_other_fees" as keyof FeeDTO,
    maxKey: "max_other_fees" as keyof FeeDTO,
  },
] as const;

const CollegeFeesData: React.FC<CollegeFeesDataProps> = ({ data }) => {
  // Memoize the processed data to avoid unnecessary recalculations
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }

    return data.map((fee) => ({
      ...fee,
      feesDetails: FEE_DETAILS_CONFIG.map(({ key, label, description, minKey, maxKey }) => ({
        key,
        label,
        description,
        feeRange: [fee[minKey], fee[maxKey]] as [number, number],
      })),
    }));
  }, [data]);

  // Add null check for data
  if (!processedData) {
    return (
      <div className="text-center py-8" role="status" aria-live="polite">
        <div className="max-w-md mx-auto">
          <div className="text-gray-500 mb-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No fee information available at the moment.</p>
          <p className="text-gray-400 text-xs mt-1">Please check back later or contact the college directly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" role="region" aria-label="College Fees Information">
      {processedData.map(({ fee_id, course_group_name, duration, feesDetails, total_min_fees, total_max_fees }) => (
        <article 
          key={fee_id} 
          className="mb-6 article-content-body" 
          id={`pdf-table-${fee_id}`}
          aria-labelledby={`fees-heading-${fee_id}`}
        >
          <h4 
            id={`fees-heading-${fee_id}`}
            className="text-base md:text-xl font-semibold md:font-bold py-4 px-1 text-gray-900"
          >
            <span className="text-primary-main">{course_group_name} </span>
            Fees Details for 2025
          </h4>
          
          <div className="rounded-2xl overflow-hidden border border-[#00A76F29] shadow-sm">
            <div className="overflow-x-auto">
              <table 
                className="couse-table rounded-2xl mb-0 w-full"
                role="table"
                aria-label={`Fee structure for ${course_group_name}`}
              >
                <thead>
                  <tr className="bg-[#00A76F14] text-[#007867] rounded-t-2xl border-b border-dashed border-[#DFE3E8]">
                      <th 
                        scope="col" 
                        className="font-semibold text-sm px-4 py-3 text-left"
                      >
                        Particulars
                      </th>
                      <th 
                        scope="col" 
                        className="font-semibold text-sm px-4 py-3 text-right"
                      >
                        Amount for {duration}
                      </th>
                    </tr>
                </thead>
                <tbody>
                  {feesDetails.map(({ key, label, description, feeRange }) => (
                    <tr 
                      key={key} 
                      className="border-b border-dashed border-[#DFE3E8] hover:bg-gray-50 transition-colors"
                    >
                      <td className="text-sm font-semibold px-4 py-3">
                        <span className="block text-gray-900">{label}</span>
                        <span className="block leading-4 md:leading-5 font-light text-xs text-gray-600 mt-1">
                          {description}
                        </span>
                      </td>
                      <td className="text-sm px-4 py-3 text-right font-medium">
                        {formatFeeRange(feeRange[0], feeRange[1])}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[#00A76F14] font-semibold">
                    <td className="text-base px-4 py-3 text-gray-900">Total Fees</td>
                    <td className="text-base px-4 py-3 text-right text-gray-900">
                      {formatFeeRange(total_min_fees, total_max_fees)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
        </article>
      ))}
    </div>
  );
};

export default React.memo(CollegeFeesData);
