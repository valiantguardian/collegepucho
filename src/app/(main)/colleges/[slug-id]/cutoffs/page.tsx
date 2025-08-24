import React from "react";
import {
  getCollegeCutoffs,
  getCollegeCutoffsData,
  getCollegeById,
} from "@/api/individual/getIndividualCollege";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";
import CollegeHead from "@/components/page/college/assets/CollegeHead";
import CollegeNav from "@/components/page/college/assets/CollegeNav";
import CutoffTable from "@/components/page/college/assets/CutoffTable";
import RatingComponent from "@/components/miscellaneous/RatingComponent";
import TocGenerator from "@/components/miscellaneous/TocGenerator";
import "@/app/styles/tables.css";
import { CollegeDateDTO } from "@/api/@types/college-info";
import CutoffDatesTable from "@/components/page/college/assets/CutoffDatesTable";

const BASE_URL = "https://www.collegepucho.com";

const parseSlugId = (slugId: string) => {
  const match = slugId.match(/(.+)-(\d+)$/);
  if (!match) return null;
  const collegeId = Number(match[2]);
  return isNaN(collegeId) ? null : { collegeId, slug: match[1] };
};

const generateJSONLD = (type: string, data: object) => ({
  "@context": "https://schema.org",
  "@type": type,
  ...data,
});

const getCollegeData = async (collegeId: number) => {
  try {
    // Get college information first
    const collegeInfo = await getCollegeById(collegeId, true);
    if (!collegeInfo) return null;
    
    // Get both cutoff APIs:
    // - getCollegeCutoffsData: Returns structured cutoff data (scores, ranks, etc.)
    // - getCollegeCutoffs: Returns cutoff content (descriptions, titles, meta info)
    const [cutoffData, cutoffInfo] = await Promise.all([
      getCollegeCutoffsData(collegeId, true),
      getCollegeCutoffs(collegeId)
    ]);
    
    // We need at least the cutoffData to proceed
    if (!cutoffData) return null;
    
    // Combine the data from both APIs
    return {
      ...collegeInfo,
      cutoffs_data: cutoffData.cutoffs_data || {},
      cutoff_content: cutoffInfo?.cutoff_content || [],
      college_dates: [] // Remove dependency on admission process API
    };
  } catch {
    return null;
  }
};

export async function generateMetadata(props: {
  params: Promise<{ "slug-id": string }>;
}): Promise<{
  title: string;
  description?: string;
  keywords?: string;
  alternates?: object;
  openGraph?: object;
}> {
  try {
    const params = await props.params;
    const slugId = params["slug-id"];
    const parsed = parseSlugId(slugId);
    if (!parsed) return { title: "College Not Found" };

    const { collegeId } = parsed;
    const college = await getCollegeData(collegeId);
    if (!college) return { title: "College Not Found" };

    const { college_information, cutoff_content } = college;
    const collegeName = college_information.college_name || "College Cutoffs";
    const canonicalUrl = `${BASE_URL}/colleges/${college_information.slug}-${collegeId}/cutoffs`;
    const metaDesc =
      cutoff_content?.[0]?.meta_desc ||
      "Find cutoff details and trends for this college.";

    return {
      title: cutoff_content?.[0]?.title || `${collegeName} Cutoffs`,
      description: metaDesc,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: cutoff_content?.[0]?.title || `${collegeName} Cutoffs`,
        description: metaDesc,
        url: canonicalUrl,
      },
    };
  } catch {
    return { title: "College Not Found" };
  }
}

const CollegeCutoffs = async (props: {
  params: Promise<{ "slug-id": string }>;
}) => {
  const params = await props.params;
  const { "slug-id": slugId } = params;
  
  const parsed = parseSlugId(slugId);
  if (!parsed) {
    return notFound();
  }

  const { collegeId } = parsed;
  
  const cutoffData = await getCollegeData(collegeId);
  if (!cutoffData) {
    return notFound();
  }

  // Check if we have the expected data structure
  if (!cutoffData.college_information) {
    return notFound();
  }

  const { college_information, cutoff_content } = cutoffData;
  const college_dates = cutoffData.college_dates || [];
  const correctSlugId = `${college_information.slug}-${collegeId}`;



  // Check if we have basic college information
  // The page should show even without cutoff data, as it might have content or other information
  if (!cutoffData.college_information) {
    return notFound();
  }

  if (slugId !== correctSlugId) {
    redirect(`/colleges/${correctSlugId}/cutoffs`);
  }

  const jsonLD: object[] = [
    generateJSONLD("CollegeOrUniversity", {
      name: college_information.college_name,
      logo: college_information.logo_img,
      url: college_information.college_website,
      email: college_information.college_email,
      telephone: college_information.college_phone,
      address: college_information.location,
    }),

    generateJSONLD("BreadcrumbList", {
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Colleges",
          item: `${BASE_URL}/colleges`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: college_information.college_name,
          item: `${BASE_URL}/colleges/${correctSlugId}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Cutoffs",
          item: `${BASE_URL}/colleges/${correctSlugId}/cutoffs`,
        },
      ],
    }),
    ...(college_dates?.length > 0 ? college_dates.map((date: CollegeDateDTO) =>
      generateJSONLD("Event", {
        name: date.event,
        startDate: date.start_date,
        endDate: date.end_date,
        location: {
          "@type": "Place",
          name: college_information.college_name,
          address: college_information.location,
        },
        eventStatus: date.is_confirmed ? "EventScheduled" : "EventPostponed",
      })
    ) : []),
  ];

  const extractedData = {
    college_name: college_information.college_name,
    logo_img: college_information.logo_img,
    city: college_information.city,
    state: college_information.state,
    title: cutoff_content[0]?.title,
    location: college_information.location,
    college_brochure: college_information.college_brochure || "/",
  };

  return (
    <>
      <Script
        id="college-cutoffs-ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
      />
      <CollegeHead data={extractedData} />
      <CollegeNav data={college_information} activeTab="Cutoffs" />
      <section className="container-body py-4">
        {cutoff_content?.[0]?.description ? (
          <>
            <TocGenerator content={cutoff_content[0].description} />
            <div dangerouslySetInnerHTML={{ __html: cutoff_content[0].description }} />
          </>
        ) : (
          <div className="text-center py-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">College Cutoffs</h2>
            <p className="text-gray-600">Find detailed cutoff information and admission criteria for {college_information.college_name}.</p>
          </div>
        )}
        {cutoffData?.cutoffs_data?.grouped_by_exam?.length > 0 ? (
          <CutoffTable data={cutoffData.cutoffs_data.grouped_by_exam} collegeId={collegeId} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No cutoff data available for this college at the moment.</p>
          </div>
        )}
        {college_dates?.length > 0 && (
          <CutoffDatesTable data={college_dates} />
        )}
        <RatingComponent />
      </section>
    </>
  );
};

export default CollegeCutoffs;
