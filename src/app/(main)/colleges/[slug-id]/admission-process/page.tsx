import React from "react";
import { getCollegeAdmissionProcess } from "@/api/individual/getIndividualCollege";
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
  const data = await getCollegeAdmissionProcess(collegeId);
  if (!data?.college_information?.dynamic_fields?.admission) return null;
  return data;
};

export async function generateMetadata(props: { params: Promise<{ "slug-id": string }> }) {
  try {
    const params = await props.params;
    const slugId = params["slug-id"];

    const parsed = parseSlugId(slugId);
    if (!parsed) return { title: "College Not Found" };

    const { collegeId } = parsed;
    const college = await getCollegeData(collegeId);
    if (!college) return { title: "College Not Found" };

    const { college_information, admission_process } = college;
    const collegeName =
      college_information.college_name || "College Admission Process";
    const canonicalUrl = `${BASE_URL}/colleges/${college_information.slug}-${collegeId}/admission-process`;
    const metaDesc =
      admission_process?.content?.[0]?.meta_desc ||
      "Find details of admission process of this college.";

    return {
      title: admission_process?.content?.[0]?.title || collegeName,
      description: metaDesc,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: admission_process?.content?.[0]?.title || collegeName,
        description: metaDesc,
        url: canonicalUrl,
      },
    };
  } catch (error) {
    console.error("Admission Process Metadata Error:", error);
    return { title: "Error Loading College Data" };
  }
}

const CollegeAdmissionProcess = async (props: { params: Promise<{ "slug-id": string }> }) => {
  const params = await props.params;
  const slugId = params["slug-id"];

  const parsed = parseSlugId(slugId);
  if (!parsed) return notFound();

  const { collegeId } = parsed;
  const admissionData = await getCollegeData(collegeId);
  if (!admissionData) return notFound();

  const { college_information, admission_process } = admissionData;
  const correctSlugId = `${college_information.slug}-${collegeId}`;

  if (slugId !== correctSlugId) {
    redirect(`/colleges/${correctSlugId}/admission-process`);
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
            name: "Admission Process",
            item: `${BASE_URL}/colleges/${correctSlugId}/admission-process`,
          },
        ],
      }),
    ];
    const extractedData = {
      college_name: college_information.college_name,
      logo_img: college_information.logo_img,
      city: college_information.city,
      state: college_information.state,
      title: admission_process?.content?.[0]?.title || "",
      location: college_information.location,
      college_brochure: college_information.college_brochure || "/",
      articleTitle: admission_process?.content?.[0]?.title || "",
      articleContent: admission_process?.content?.[0]?.description || "",
    };

    return (
      <>
        <Script
          id="college-ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
        />
        <CollegeHead data={extractedData} />
        <CollegeNav data={college_information} activeTab="Admission Process" />
        <section className="container-body py-4">
          {admission_process?.content?.[0]?.description && (
            <>
              <TocGenerator content={admission_process.content[0].description} />
              <div dangerouslySetInnerHTML={{ __html: admission_process.content[0].description }} />
            </>
          )}
          <RatingComponent />
        </section>
      </>
    );
  } catch (error) {
    console.error("Admission Process Page Error:", error);
    return notFound();
  }
};

export default CollegeAdmissionProcess;
