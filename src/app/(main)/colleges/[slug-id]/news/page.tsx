import React from "react";
import { getCollegeNewsById } from "@/api/individual/getIndividualCollege";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";
import CollegeHead from "@/components/page/college/assets/CollegeHead";
import CollegeNav from "@/components/page/college/assets/CollegeNav";

import Link from "next/link";
import Image from "next/image";
import { createSlugFromTitle } from "@/components/utils/utils";
import "@/app/styles/tables.css";

const formatDateWord = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const trimText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
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
  const params = await props.params;
  const slugId = params["slug-id"];
  const match = slugId.match(/(.+)-(\d+)$/);
  if (!match) return { title: "College Not Found" };

  const collegeId = Number(match[2]);
  if (isNaN(collegeId)) return { title: "Invalid College" };

  const college = await getCollegeNewsById(collegeId);
  if (!college) return { title: "College Not Found" };

  const { college_information, scholarship_section } = college;
  const { college_name, slug } = college_information;
  const scholarship = scholarship_section?.[0];
  const collegeSlug = slug.replace(/-\d+$/, "");

  return {
    title: scholarship?.title || `${college_name} News`,
    description:
      scholarship?.meta_desc || `Latest news and updates from ${college_name}.`,
    keywords:
      scholarship?.seo_param ||
      `${college_name}, news, college updates, education`,
    alternates: {
      canonical: `https://www.collegepucho.com/colleges/${collegeSlug}-${collegeId}/news`,
    },
    openGraph: {
      title: scholarship?.title || `${college_name} News`,
      description:
        scholarship?.meta_desc ||
        `Latest news and updates from ${college_name}.`,
      url: `https://www.collegepucho.com/colleges/${collegeSlug}-${collegeId}/news`,
    },
  };
}

const CollegeNews = async ({
  params,
}: {
  params: Promise<{ "slug-id": string }>;
}) => {
  const { "slug-id": slugId } = await params;
  const match = slugId.match(/(.+)-(\d+)$/);
  if (!match) return notFound();

  const collegeId = Number(match[2]);
  if (isNaN(collegeId)) return notFound();

  const college = await getCollegeNewsById(collegeId);
  if (!college?.college_information || !college?.news_section)
    return notFound();

  const { college_information } = college;

  const newsList = college.news_section;
  const collegeName =
    college.college_information?.college_name || "Unknown College";
  const trimmedCollegeName =
    college.college_information?.slug?.replace(/-\d+$/, "") ||
    collegeName.toLowerCase().replace(/\s+/g, "-");
  const correctSlugId = `${trimmedCollegeName}-${collegeId}`;

  if (slugId !== correctSlugId) {
    redirect(`/colleges/${correctSlugId}/news`);
  }

  if (!newsList || newsList.length === 0) {
    return notFound();
  }

  const extractedData = {
    college_name: college_information.college_name,
    logo_img: college_information.logo_img,
    city: college_information.city,
    state: college_information.state,
    title: college_information.college_name,
    location: college_information.location,
    college_brochure: college_information.college_brochure || "/",
  };

  const jsonLD = [
    {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      name: collegeName,
      logo: college.college_information?.logo_img,
      url: college.college_information?.college_website,
      email: college.college_information?.college_email,
      telephone: college.college_information?.college_phone,
      address: college.college_information?.location,
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
          name: collegeName,
          item: `https://www.collegepucho.com/colleges/${correctSlugId}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "News",
          item: `https://www.collegepucho.com/colleges/${correctSlugId}/news`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: newsList[0]?.title || `${collegeName} News`,
      description:
        newsList[0]?.meta_desc || `Latest updates from ${collegeName}.`,
      author: {
        "@type": "Person",
        name: newsList[0]?.author_name || "Unknown Author",
      },
      datePublished: newsList[0]?.updated_at,
      dateModified: newsList[0]?.updated_at,
      image:
        college.college_information?.logo_img ||
        "https://www.collegepucho.com/logo-dark.webp",
      publisher: {
        "@type": "Organization",
        name: "CollegePucho",
        logo: {
          "@type": "ImageObject",
          url: "https://www.collegepucho.com/logo-dark.webp",
        },
      },
    },
  ];

  return (
    <div className="bg-gray-2 min-h-screen">
      <Script
        id="college-news-ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
      />
      <CollegeHead data={extractedData} />
      <CollegeNav data={college_information} />
      <div className="container-body lg:grid grid-cols-12 gap-4 pt-4">
        <div className="col-span-9 mt-4">
          <div className="flex gap-4 flex-col">
            {newsList.map(
              (newsItem: {
                id: number;
                title: string;
                updated_at: string;
                meta_desc?: string;
              }) => (
                <div
                  key={newsItem.id}
                  className="p-4 bg-white shadow-md rounded-2xl"
                >
                  <Link
                    href={`/colleges/${correctSlugId}/news/${createSlugFromTitle(
                      newsItem.title
                    )}-${newsItem.id}`}
                  >
                    <h2 className="text-lg font-medium hover:underline">
                      {newsItem.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-600">
                    {formatDateWord(newsItem.updated_at)}
                  </p>
                  {newsItem.meta_desc && (
                    <div
                      className="text-gray-700 mt-2"
                      dangerouslySetInnerHTML={{
                        __html: trimText(newsItem.meta_desc, 150),
                      }}
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <div className="col-span-1 mt-4">
          <Image src="/ads/static.svg" height={250} width={500} alt="ads" />
        </div>
      </div>
    </div>
  );
};

export default CollegeNews;
