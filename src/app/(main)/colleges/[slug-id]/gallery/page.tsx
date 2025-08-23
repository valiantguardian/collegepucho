import { notFound } from "next/navigation";
import Script from "next/script";
import { getCollegeById, getCollegeGallery } from "@/api/individual/getIndividualCollege";
import CollegeHead from "@/components/page/college/assets/CollegeHead";
import CollegeNav from "@/components/page/college/assets/CollegeNav";
import CollegeGallery from "@/components/page/college/assets/CollegeGallery";
import RatingComponent from "@/components/miscellaneous/RatingComponent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "slug-id": string }>;
}) {
  const resolvedParams = await params;
  const { "slug-id": slugId } = resolvedParams;

  const collegeMatch = slugId.match(/(.+)-(\d+)$/);
  if (!collegeMatch) return { title: "College Not Found" };

  const collegeId = Number(collegeMatch[2]);
  if (isNaN(collegeId)) return { title: "College Not Found" };

  try {
    const collegeData = await getCollegeById(collegeId);
    if (!collegeData) return { title: "College Not Found" };

    const { college_information } = collegeData;
    const collegeName = college_information?.college_name || "College";

    return {
      title: `${collegeName} Gallery - Photos and Images | CollegePucho`,
      description: `Explore the ${collegeName} gallery featuring campus photos, facilities, infrastructure, and more. Get a visual tour of the college.`,
    };
  } catch {
    return {
      title: "College Gallery",
      description: "Explore college gallery and campus photos.",
    };
  }
}

export default async function CollegeGalleryPage({
  params,
}: {
  params: Promise<{ "slug-id": string }>;
}) {
  const resolvedParams = await params;
  const { "slug-id": slugId } = resolvedParams;

  const collegeMatch = slugId.match(/(.+)-(\d+)$/);
  if (!collegeMatch) return notFound();

  const collegeId = Number(collegeMatch[2]);
  if (isNaN(collegeId)) return notFound();

  try {
    const collegeData = await getCollegeById(collegeId);
    if (!collegeData) return notFound();

    const { college_information } = collegeData;
    const clgName = college_information?.slug || "Default College Name";
    const trimmedCollegeName = clgName
      .replace(/-\d+$/, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    const correctSlugId = `${trimmedCollegeName}-${collegeId}`;

    if (slugId !== correctSlugId) {
      return notFound();
    }

    // Fetch gallery data
    const galleryData = await getCollegeGallery(collegeId);
    const gallery = galleryData?.gallery || [];

    const extractedData = {
      college_id: college_information.college_id,
      college_name: college_information.college_name,
      short_name: college_information.short_name,
      city: college_information.city,
      state: college_information.state,
      country: college_information.country,
      founded_year: college_information.founded_year,
      type_of_institute: college_information.type_of_institute,
      logo_img: college_information.logo_img,
      banner_img: college_information.banner_img,
      kapp_rating: college_information.kapp_rating,
      kapp_score: college_information.kapp_score,
      nacc_grade: college_information.nacc_grade,
      UGC_approved: college_information.UGC_approved,
      college_brochure: college_information.college_brochure || "/",
    };

    const jsonLD = {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      name: college_information.college_name,
      description: `Gallery of ${college_information.college_name}`,
      url: `https://collegepucho.com/colleges/${slugId}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: college_information.city,
        addressRegion: college_information.state,
        addressCountry: college_information.country,
      },
      foundingDate: college_information.founded_year,
      image: college_information.banner_img || college_information.logo_img,
    };

    return (
      <>
        <Script
          id="college-gallery-ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
        />
        <CollegeHead data={extractedData} />
        <CollegeNav data={college_information} activeTab="Gallery" />
        <section className="container-body py-4">
          <CollegeGallery gallery={gallery} />
          <RatingComponent />
        </section>
      </>
    );
  } catch {
    return notFound();
  }
}
