import React from "react";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";
import { getCollegeById } from "@/api/individual/getIndividualCollege";
import CollegeHead from "@/components/page/college/assets/CollegeHead";
import CollegeNav from "@/components/page/college/assets/CollegeNav";
import RatingComponent from "@/components/miscellaneous/RatingComponent";
import TocGenerator from "@/components/miscellaneous/TocGenerator";
import "@/app/styles/tables.css";

export async function generateMetadata(props: {
  params: Promise<{ "slug-id": string }>;
}): Promise<{
  title: string;
  description?: string;
  keywords?: string;
  alternates?: object;
  openGraph?: object;
}> {
  const params = await props.params;
  const slugId = params["slug-id"];
  const match = slugId.match(/(.+)-(\d+)$/);
  if (!match) return notFound();

  if (!match) return { title: "College Not Found" };

  const collegeId = Number(match[2]);
  if (isNaN(collegeId)) return { title: "Invalid College" };

  const college = await getCollegeById(collegeId);
  if (!college) return { title: "College Not Found" };

  const { college_information, highlight_section } = college;
  const collegeSlug = college_information?.slug.replace(/-\d+$/, "");
  const highlight = highlight_section?.[0] || {};

  return {
    title:
      highlight.title ||
      college_information?.college_name ||
      "College Highlights",
    description: highlight.meta_desc || "Find details about this college.",
    keywords: highlight.seo_param || "",
    alternates: {
      canonical: `https://www.collegepucho.com/colleges/${collegeSlug}-${collegeId}/highlights`,
    },
    openGraph: {
      title:
        highlight.title ||
        college_information?.college_name ||
        "College Highlights",
      description: highlight.meta_desc || "Find details about this college.",
      url: `https://www.collegepucho.com/colleges/${collegeSlug}-${collegeId}/highlights`,
    },
  };
}

const CollegeHighlights = async (props: {
  params: Promise<{ "slug-id": string }>;
}) => {
  const params = await props.params;
  const { "slug-id": slugId } = params;
  const match = slugId.match(/(.+)-(\d+)$/);
  if (!match) return notFound();

  const collegeId = Number(match[2]);
  if (isNaN(collegeId)) return notFound();

  const college = await getCollegeById(collegeId);
  if (!college) return notFound();

  const { college_information, highlight_section } = college;
  const trimmedSlug =
    college_information?.slug.replace(/-\d+$/, "") || "default-college";
  const correctSlugId = `${trimmedSlug}-${collegeId}`;

  if (slugId !== correctSlugId) {
    return redirect(`/colleges/${correctSlugId}`);
  }
  const highlight = highlight_section?.[0] || {};
  const description = highlight.description || "";

  const extractedData = {
    college_name: college_information.college_name,
    college_logo: college_information.logo_img,
    city: college_information.city,
    state: college_information.state,
    title: highlight.title || "",
    location: college_information.location,
    college_brochure: college_information.college_brochure || "/",
    articleTitle: highlight.title || "",
    articleContent: highlight.meta_desc || "",
  };

  const generateLDJson = () => [
    {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      name: college_information.college_name,
      logo: college_information.logo_img,
      url: college_information.college_website,
      email: college_information.college_email,
      telephone: college_information.college_phone,
      address: college_information.location,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.collegepucho.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Colleges",
          item: "https://www.collegepucho.com/colleges",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: college_information.college_name,
          item: `https://www.collegepucho.com/colleges/${correctSlugId}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: highlight.title,
          item: `https://www.collegepucho.com/colleges/${correctSlugId}/highlights`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: highlight.title,
      description:
        highlight.meta_desc ||
        "Details of the admission process for this college.",
      author: {
        "@type": "Person",
        name: highlight.author_name || "Unknown Author",
      },
      datePublished: highlight.updated_at,
      dateModified: highlight.updated_at,
      image: {
        "@type": "ImageObject",
        url: college_information.logo_img,
        height: 800,
        width: 800,
      },
      publisher: {
        "@type": "Organization",
        name: "CollegePucho",
        logo: {
          "@type": "ImageObject",
          url: "https://www.collegepucho.com/logo-dark.webp",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://www.collegepucho.com/colleges/${correctSlugId}/highlights`,
      },
    },
  ];

  return (
    <>
      {generateLDJson().map((ld, idx) => (
        <Script
          key={idx}
          id={`college-highlights-schema-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      <div className="bg-gray-2">
        <CollegeHead data={extractedData} />
          <CollegeNav data={college_information} />

        <section className="container-body py-4">
          {description && <TocGenerator content={description} />}
          <div dangerouslySetInnerHTML={{ __html: description }} />
          <RatingComponent />
        </section>
      </div>
    </>
  );
};

export default CollegeHighlights;
