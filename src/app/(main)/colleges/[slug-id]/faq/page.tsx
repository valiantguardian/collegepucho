import React from "react";
import { getCollegeFaq } from "@/api/individual/getIndividualCollege";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";
import CollegeHead from "@/components/page/college/assets/CollegeHead";
import CollegeNav from "@/components/page/college/assets/CollegeNav";

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
  const data = await getCollegeFaq(collegeId);
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
    const faqItems = (college as { faq_section?: Array<{ meta_desc?: string; title?: string }>; faqData?: Array<{ meta_desc?: string; title?: string }> })?.faq_section ?? (college as { faq_section?: Array<{ meta_desc?: string; title?: string }>; faqData?: Array<{ meta_desc?: string; title?: string }> })?.faqData ?? [];
    if (!faqItems?.length) return { title: "FAQs Not Available" };

    const { college_information } = college as { college_information: { college_name: string; slug: string } };
    const collegeName = college_information.college_name || "College FAQs";
    const canonicalUrl = `${BASE_URL}/colleges/${college_information.slug}-${collegeId}/faq`;
    const metaDesc =
      faqItems[0]?.meta_desc ||
      "Find answers to frequently asked questions about this college.";

    return {
      title: faqItems[0]?.title || `${collegeName} FAQs`,
      description: metaDesc,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: faqItems[0]?.title || `${collegeName} FAQs`,
        description: metaDesc,
        url: canonicalUrl,
      },
    };
  } catch {
    return { title: "Error Loading College Data" };
  }
}

const CollegeFAQs = async (props: {
  params: Promise<{ "slug-id": string }>;
}) => {
  try {
    const params = await props.params;
    const { "slug-id": slugId } = params;
    const parsed = parseSlugId(slugId);
    if (!parsed) return notFound();

    const { collegeId } = parsed;
    const faqData = await getCollegeData(collegeId);
    if (!faqData) return notFound();

    const { college_information } = faqData;
    const faqItems = faqData?.faq_section ?? faqData?.faqData ?? [];
    const correctSlugId = `${college_information.slug}-${collegeId}`;

    if (slugId !== correctSlugId) {
      redirect(`/colleges/${correctSlugId}/faq`);
    }

    const jsonLD = [
      generateJSONLD("CollegeOrUniversity", {
        name: college_information.college_name,
        logo: college_information.logo_img,
        url: college_information.college_website,
        email: college_information.college_email,
        telephone: college_information.college_phone,
        address: college_information.location,
        college_brochure: college_information.college_brochure || "/",
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
            name: "FAQs",
            item: `${BASE_URL}/colleges/${correctSlugId}/faq`,
          },
        ],
      }),

      //   generateJSONLD("FAQPage", {
      //     mainEntity: faq_section.map((faq: { title: string; description: string }) => ({
      //       "@type": "Question",
      //       name: faq.title || "Frequently Asked Question",
      //       acceptedAnswer: {
      //         "@type": "Answer",
      //         text: faq.description || "Answer not available",
      //       },
      //     })),
      //   }),
    ];

    const extractedData = {
      college_name: college_information.college_name,
      logo_img: college_information.logo_img,
      city: college_information.city,
      state: college_information.state,
      title: faqItems[0]?.title || "College FAQs",
      location: college_information.location,
      articleTitle: faqItems[0]?.title || "College FAQs",
      articleContent: faqItems[0]?.description || "",
    };

    return (
      <>
        <Script
          id="college-faqs-ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
        />
        <CollegeHead data={extractedData} />
        <CollegeNav data={college_information} />
        <section className="container-body py-4">
          {faqItems?.length ? (
            <div className="space-y-6">
              {faqItems.map((faq: { title: string; description: string }, index: number) => (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-3">{faq.title}</h3>
                  <div dangerouslySetInnerHTML={{ __html: faq.description }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              FAQs will be updated soon.
            </div>
          )}
        </section>
      </>
    );
  } catch {
    return notFound();
  }
};

export default CollegeFAQs;
