import React from "react";
import { getCollegeScholarshipById } from "@/api/individual/getIndividualCollege";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";
import CollegeHead from "@/components/page/college/assets/CollegeHead";
import CollegeNav from "@/components/page/college/assets/CollegeNav";
import RatingComponent from "@/components/miscellaneous/RatingComponent";
import TocGenerator from "@/components/miscellaneous/TocGenerator";
import "@/app/styles/tables.css";

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
  const data = await getCollegeScholarshipById(collegeId);
  if (!data?.scholarship_section?.length) return null;
  return data;
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

    const { college_information, scholarship_section } = college;
    const collegeName =
      college_information.college_name || "College Scholarships";
    const canonicalUrl = `${BASE_URL}/colleges/${college_information.slug}-${collegeId}/scholarships`;
    const metaDesc =
      scholarship_section?.[0]?.meta_desc ||
      "Explore scholarship opportunities at this college.";

    return {
      title: scholarship_section?.[0]?.title || `${collegeName} Scholarships`,
      description: metaDesc,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: scholarship_section?.[0]?.title || `${collegeName} Scholarships`,
        description: metaDesc,
        url: canonicalUrl,
      },
    };
  } catch {
    return { title: "Error Loading College Data" };
  }
}

const CollegeScholarship = async (props: {
  params: Promise<{ "slug-id": string }>;
}) => {
  const params = await props.params;
  const { "slug-id": slugId } = params;
  const parsed = parseSlugId(slugId);
  if (!parsed) return notFound();

  const { collegeId } = parsed;
  const scholarshipData = await getCollegeData(collegeId);
  if (!scholarshipData) return notFound();

  const { college_information, scholarship_section } =
    scholarshipData;
  const correctSlugId = `${college_information.slug}-${collegeId}`;

  if (slugId !== correctSlugId) {
    redirect(`/colleges/${correctSlugId}/scholarships`);
  }

  try {
    const jsonLD = [
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
            name: "Scholarships",
            item: `${BASE_URL}/colleges/${correctSlugId}/scholarships`,
          },
        ],
      }),
      generateJSONLD("Scholarship", {
        name: scholarship_section?.[0]?.title,
        provider: {
          "@type": "CollegeOrUniversity",
          name: college_information.college_name,
        },
        description: scholarship_section?.[0]?.meta_desc,
        url: `${BASE_URL}/colleges/${correctSlugId}/scholarships`,
      }),
    ];

    const extractedData = {
      college_name: college_information.college_name,
      logo_img: college_information.logo_img,
      city: college_information.city,
      state: college_information.state,
      college_brochure: college_information.college_brochure || "/",
      title: scholarship_section?.[0]?.title,
      location: college_information.location,
      articleTitle: scholarship_section?.[0]?.title || "",
      articleContent: scholarship_section?.[0]?.meta_desc || "",
    };

    return (
      <>
        <Script
          id="college-scholarship-ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
        />
        <div className="bg-gray-2">
          <CollegeHead data={extractedData} />
          <CollegeNav data={college_information} />
          <section className="container-body py-4">
            {scholarship_section?.[0]?.description && (
              <>
                <TocGenerator content={scholarship_section[0].description} />
                <div dangerouslySetInnerHTML={{ __html: scholarship_section[0].description }} />
              </>
            )}
            <RatingComponent />
          </section>
        </div>
      </>
    );
  } catch {
    return notFound();
  }
};

export default CollegeScholarship;
