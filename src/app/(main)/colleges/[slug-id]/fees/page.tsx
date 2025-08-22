import { notFound, redirect } from "next/navigation";
import Script from "next/script";
import { getCollegeFees } from "@/api/individual/getIndividualCollege";
import { CollegeDTO } from "@/api/@types/college-info";
import CollegeNav from "@/components/page/college/assets/CollegeNav";
import CollegeHead from "@/components/page/college/assets/CollegeHead";
import CollegeFeesContent from "@/components/page/college/assets/CollegeFeesContent";
import "@/app/styles/tables.css";
import CollegeFeesData from "@/components/page/college/assets/CollegeFeesData";
import RatingComponent from "@/components/miscellaneous/RatingComponent";
import { Suspense } from "react";

// Constants for better maintainability
const DOMAIN = "https://www.collegepucho.com";
const SLUG_ID_REGEX = /(.+)-(\d+)$/;

// Helper function to extract college ID from slug
const extractCollegeId = (slugId: string): number | null => {
  const match = slugId.match(SLUG_ID_REGEX);
  if (!match) return null;
  
  const collegeId = Number(match[2]);
  return isNaN(collegeId) ? null : collegeId;
};

// Helper function to generate canonical slug
const generateCanonicalSlug = (slug: string, collegeId: number): string => {
  const trimmedSlug = slug.replace(/-\d+$/, "").toLowerCase();
  return `${trimmedSlug}-${collegeId}`;
};

// Helper function to validate fees data
const hasFeesData = (college: CollegeDTO): boolean => {
  return !!(
    college.college_information?.dynamic_fields?.fees ||
    college.college_information?.additional_fields?.college_wise_fees_present
  );
};

export async function generateMetadata(props: {
  params: Promise<{ "slug-id": string }>;
}): Promise<{
  title: string;
  description?: string;
  keywords?: string;
  alternates?: object;
  openGraph?: object;
  robots?: object;
}> {
  const params = await props.params;
  const slugId = params["slug-id"];
  const collegeId = extractCollegeId(slugId);
  
  if (!collegeId) {
    return { title: "Invalid College" };
  }

  try {
    const college = await getCollegeFees(collegeId);
    if (!college || !hasFeesData(college)) {
      return { title: "College Fees Not Found" };
    }

    const { college_information, fees_section } = college;
    const collegeSlug = college_information?.slug.replace(/-\d+$/, "");
    const content = fees_section?.content?.[0] || {};
    const collegeName = college_information?.college_name || "College";

    const title = content.title || `${collegeName} Fees Details 2025`;
    const description = content.meta_desc || `Get complete information about ${collegeName} fees structure, tuition fees, hostel fees, and other charges for 2025 admissions.`;
    const keywords = content.seo_param || `${collegeName}, college fees 2025, tuition fees, hostel fees, admission fees, ${college_information?.city || ""}, ${college_information?.state || ""}`;

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: `${DOMAIN}/colleges/${collegeSlug}-${collegeId}/fees`,
      },
      openGraph: {
        title,
        description,
        url: `${DOMAIN}/colleges/${collegeSlug}-${collegeId}/fees`,
        type: "website",
        siteName: "CollegePucho",
        images: college_information?.logo_img ? [{
          url: college_information.logo_img,
          alt: `${collegeName} logo`,
          width: 200,
          height: 200,
        }] : undefined,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata for college fees:", error);
    return { 
      title: "College Fees Information",
      description: "Find detailed information about college fees, tuition costs, and admission charges.",
      robots: { noindex: true }
    };
  }
}

// Loading component for better UX
const FeesPageSkeleton = () => (
  <div className="container-body py-4 animate-pulse">
    <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
    <div className="h-4 bg-gray-200 rounded mb-6 w-2/3"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

const CollegeFees = async (props: {
  params: Promise<{ "slug-id": string }>;
}) => {
  const params = await props.params;
  const { "slug-id": slugId } = params;
  const collegeId = extractCollegeId(slugId);
  
  if (!collegeId) {
    return notFound();
  }

  try {
    const collegeFeesData: CollegeDTO = await getCollegeFees(collegeId);
    
    if (!collegeFeesData || !hasFeesData(collegeFeesData)) {
      return notFound();
    }

    const { college_information, news_section, fees_section } = collegeFeesData;

    if (!college_information?.slug) {
      return notFound();
    }

    const {
      slug,
      college_name,
      logo_img,
      college_website,
      college_email,
      college_phone,
      location,
    } = college_information;

    const correctSlugId = generateCanonicalSlug(slug, collegeId);

    // Redirect to canonical URL if needed
    if (slugId !== correctSlugId) {
      redirect(`/colleges/${correctSlugId}/fees`);
    }

    // Enhanced structured data
    const clgLD = {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      name: college_name,
      logo: logo_img,
      url: college_website,
      email: college_email,
      telephone: college_phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: college_information.city,
        addressRegion: college_information.state,
        addressCountry: "IN",
        streetAddress: location,
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Course Fees",
        description: "Fees structure for various courses",
      },
    };

    const breadcrumbLD = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: DOMAIN,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Colleges",
          item: `${DOMAIN}/colleges`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: college_name,
          item: `${DOMAIN}/colleges/${correctSlugId}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Fees",
          item: `${DOMAIN}/colleges/${correctSlugId}/fees`,
        },
      ],
    };

    // Fees structured data for better SEO
    const feesLD = fees_section?.fees?.map(fee => ({
      "@type": "Offer",
      name: `${fee.course_group_name} Fees`,
      description: `Fees for ${fee.course_group_name} course`,
      price: fee.total_min_fees,
      priceCurrency: "INR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: fee.total_min_fees,
        priceCurrency: "INR",
        unitText: "per semester",
      },
    })) || [];

    const extractedData = {
      college_name: college_name || "",
      college_logo: logo_img || "",
      city: college_information.city || "",
      state: college_information.state || "",
      location: location || "",
      title: fees_section?.content?.[0]?.title || "",
      college_brochure: college_information.college_brochure || "/",
    };

    return (
      <>
        {/* Structured Data Scripts */}
        <Script
          id="college-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clgLD) }}
        />
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }}
        />
        {feesLD.length > 0 && (
          <Script
            id="fees-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ 
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                itemListElement: feesLD,
              })
            }}
          />
        )}

        <CollegeHead data={extractedData} />
        <CollegeNav data={college_information} />

        <main className="container-body py-4" role="main">
          <Suspense fallback={<FeesPageSkeleton />}>
            <CollegeFeesContent
              content={fees_section?.content || []}
              news={news_section}
            />
            <CollegeFeesData data={fees_section?.fees} />
            <RatingComponent />
          </Suspense>
        </main>
      </>
    );
  } catch (error) {
    console.error("Error rendering college fees page:", error);
    return notFound();
  }
};

export default CollegeFees;
