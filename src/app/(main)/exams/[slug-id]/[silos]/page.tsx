import { getExamsById } from "@/api/individual/getExamsById";
import ExamContent from "@/components/page/exam/ExamContent";
import { splitSilos } from "@/components/utils/utils";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";

export async function generateMetadata(props: {
  params: Promise<{ "slug-id": string; silos: string }>;
}) {
  const { "slug-id": slugId, silos } = await props.params;
  if (!slugId) return notFound();

  const accurateSilos = splitSilos(silos);

  const match = slugId.match(/(.+)-(\d+)$/);
  if (!match) return notFound();

  const examId = Number(match[2]);
  if (isNaN(examId)) return notFound();

  let exam;
  try {
    exam = await getExamsById(examId, accurateSilos);
  } catch {
    return notFound();
  }

  if (!exam || !exam.examInformation) return notFound();

  const title = 
    typeof exam.examContent === "object" && exam.examContent?.topic_title
      ? exam.examContent.topic_title
      : "Exam Details";
  const description =
    (typeof exam.examContent === "object" && exam.examContent?.meta_desc) ||
    "Find details about this exam.";
  const canonicalUrl = `https://www.collegepucho.com/exams/${exam.examInformation.slug}-${examId}/${accurateSilos}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
  };
}

const ExamSiloCard: React.FC<{
  params: Promise<{ "slug-id": string; silos: string }>;
}> = async ({ params }) => {
  const { "slug-id": slugId, silos } = await params;

  if (!slugId) return notFound();
  if (silos === "info") {
    redirect(`/exams/${slugId}`);
  }
  const accurateSilos = splitSilos(silos);

  const match = slugId.match(/(.+)-(\d+)$/);
  if (!match) return notFound();

  const examId = Number(match[2]);
  if (isNaN(examId)) return notFound();

  let exam;
  try {
    exam = await getExamsById(examId, accurateSilos);
  } catch {
    return notFound();
  }

  if (
    !exam ||
    !exam.examInformation
  ) {
    return notFound();
  }

  const { examInformation: examInfo, examContent } = exam;

  const correctSlugId = `${examInfo.exam_name
    .replace(/\s+/g, "-")
    .toLowerCase()}-${examId}`;

  if (slugId !== correctSlugId) {
    return redirect(`/exams/${correctSlugId}/${silos}`);
  }



  const breadcrumbLD = {
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
        name: "Exams",
        item: "https://www.collegepucho.com/exams",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: examInfo.exam_name,
        item: `https://www.collegepucho.com/exams/${correctSlugId}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${examInfo.exam_name} Results`,
        item: `https://www.collegepucho.com/exams/${correctSlugId}/results`,
      },
    ],
  };

  // Extract metadata based on response structure
  const topic_title = typeof examContent === "object" ? examContent.topic_title : undefined;
  const meta_desc = typeof examContent === "object" ? examContent.meta_desc : undefined;
  const author_name = typeof examContent === "object" ? examContent.author_name : undefined;
  const updated_at = typeof examContent === "object" ? examContent.updated_at : undefined;

  const articleLD = {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: "en",
    headline: topic_title || `${examInfo.exam_name} Details`,
    description:
      meta_desc || "Details of the admission process for this college.",
    author: { "@type": "Person", name: author_name || "Unknown Author" },
    datePublished: updated_at,
    dateModified: updated_at,
    image: {
      "@type": "ImageObject",
      url: examInfo.examInformation?.exam_logo,
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
      "@id": `https://www.collegepucho.com/exams/${correctSlugId}/info`,
    },
  };

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }}
      />
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLD) }}
      />

      <ExamContent exam={exam} />
    </>
  );
};

export default ExamSiloCard;
