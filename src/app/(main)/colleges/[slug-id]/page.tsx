import React from "react";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";
import { getCollegeById } from "@/api/individual/getIndividualCollege";
import CollegeHead from "@/components/page/college/assets/CollegeHead";
import CollegeNav from "@/components/page/college/assets/CollegeNav";
import CollegeInfoContent from "@/components/page/college/assets/CollegeInfoContent";
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
  const defaultMetadata = {
    title: "College Not Found",
    description: "The requested college could not be found.",
    keywords: "college, not found",
    alternates: { canonical: "https://www.collegepucho.com" },
  };

  const match = slugId.match(/(.+)-(\d+)$/);
  if (!match) return defaultMetadata;

  const collegeId = Number(match[2]);
  if (isNaN(collegeId)) return defaultMetadata;

  const college = await getCollegeById(collegeId);
  if (!college) return defaultMetadata;

  const { info_section, college_information } = college;
  const info = info_section?.[0];
  const collegeSlug = college_information.slug.replace(/-\d+$/, "");

  return {
    title:
      info?.title || college_information.college_name || defaultMetadata.title,
    description:
      info?.meta_desc ||
      `Explore courses, scholarships, and more at ${college_information.college_name}`,
    keywords:
      info?.seo_param ||
      `${college_information.college_name}, college, courses`,
    alternates: {
      canonical: `https://www.collegepucho.com/colleges/${collegeSlug}-${collegeId}`,
    },
    openGraph: {
      title: info?.title || college_information.college_name,
      description:
        info?.meta_desc ||
        `Explore courses, scholarships, and more at ${college_information.college_name}`,
      url: `https://www.collegepucho.com/colleges/${collegeSlug}-${collegeId}`,
    },
  };
}

export const revalidate = 21600;

const IndividualCollege = async (props: {
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

  //   const collegeSchema = await getCollegeById(collegeId, true);
  const { college_information, info_section, popular_courses, news_section } =
    college;

  const collegeSlug = college_information.slug.replace(/-\d+$/, "");
  const correctSlugId = `${collegeSlug}-${collegeId}`;

  if (slugId !== correctSlugId) {
    return redirect(`/colleges/${correctSlugId}`);
  }
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollegeOrUniversity",
        name: college_information.college_name,
        logo: college_information.logo_img,
        url: `https://www.collegepucho.com/colleges/${correctSlugId}`,
      },
      {
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
        ],
      },
      ...(info_section?.[0]
        ? [
            {
              "@context": "https://schema.org",
              "@type": "Article",
              inLanguage: "en",
              headline: info_section[0].title,
              description: info_section[0].meta_desc,
              dateModified: new Date().toISOString(),
              datePublished: new Date().toISOString(),
              url: `https://www.collegepucho.com/colleges/${correctSlugId}`,
              mainEntityOfPage: {
                "@id": `https://www.collegepucho.com/colleges/${correctSlugId}`,
                "@type": "WebPage",
                name: college_information.college_name,
              },
              author: {
                "@type": "Person",
                name: info_section[0].author_name || "CollegePucho",
                url: `https://www.collegepucho.com/team/${
                  info_section[0].author_id || 16
                }`,
                image:
                  info_section[0].author_image ||
                  "https://www.collegepucho.com/logo.webp",
              },
              publisher: {
                "@type": "Organization",
                name: "CollegePucho",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.collegepucho.com/logo.webp",
                },
              },
              image: {
                "@type": "ImageObject",
                url: college_information.logo_img,
              },
            },
          ]
        : []),
    ],
  };
  const extractedData = {
    college_name: college_information.college_name,
    logo_img: college_information.logo_img,
    banner_img: college_information.banner_img,
    city: college_information.city,
    state: college_information.state,
    college_brochure: college_information.college_brochure || "/",
    title: info_section?.[0]?.title || "",
    location: college_information.location,
    articleTitle: info_section?.[0]?.title || "",
    articleContent: info_section?.[0]?.meta_desc || "",
  };

  return (
    <>
      <Script
        id="college-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <CollegeHead data={extractedData} />
      <CollegeNav data={college_information} />
      <section className="container-body py-4">
        <CollegeInfoContent
          data={college_information}
          info={info_section}
          news={news_section}
          course={popular_courses}
        />
      </section>
    </>
  );
};

export default React.memo(IndividualCollege);
