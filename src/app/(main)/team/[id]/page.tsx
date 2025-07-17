import { getAuthor } from "@/api/individual/getAuthor";
import { formatDateTime } from "@/components/utils/formatDateTime";
import { getRandomFallbackImage, trimText } from "@/components/utils/utils";
import { notFound } from "next/navigation";
import "@/app/styles/author.css";

const ARTICLE_FALLBACK_IMAGES = [
  "https://d28xcrw70jd98d.cloudfront.net/articles/articleFallback1.webp",
  "https://d28xcrw70jd98d.cloudfront.net/articles/articleFallback2.webp",
  "https://d28xcrw70jd98d.cloudfront.net/articles/articleFallback3.webp",
  "https://d28xcrw70jd98d.cloudfront.net/articles/articleFallback4.webp",
  "https://d28xcrw70jd98d.cloudfront.net/articles/articleFallback5.webp",
];

const DEFAULT_AUTHOR = {
  view_name: "Digvijay Singh",
  role: "Senior Content Strategist",
  about: "Visionary content creator with a passion for transforming educational narratives. 5+ years shaping the future of college admissions content.",
  image: "/admin.jpg",
};

const DEFAULT_CONTENT = {
  articles: [
    { name: "AI-Powered College Admissions in 2025", updated_at: "2025-03-25T09:00:00Z", image: ARTICLE_FALLBACK_IMAGES[0] },
    { name: "Quantum Learning: SAT Prep Revolution", updated_at: "2025-03-20T14:15:00Z", image: ARTICLE_FALLBACK_IMAGES[1] },
    { name: "Future-Proof Your Major Choice", updated_at: "2025-03-15T11:30:00Z", image: ARTICLE_FALLBACK_IMAGES[2] },
  ],
  exams: [
    { name: "SAT 3.0 Blueprint", updated_at: "2025-03-05T13:20:00Z" },
    { name: "ACT Digital Strategies", updated_at: "2025-02-28T10:10:00Z" },
    { name: "GRE Next Gen Guide", updated_at: "2025-02-25T15:00:00Z" },
  ],
  colleges: [
    { name: "Quantum Tech Institute", updated_at: "2025-03-18T17:30:00Z" },
    { name: "NeuralNet University", updated_at: "2025-03-22T12:00:00Z",  image: ARTICLE_FALLBACK_IMAGES[1] },
    { name: "Cybertron College", updated_at: "2025-03-12T09:45:00Z" },
  ],
};

type Author = typeof DEFAULT_AUTHOR;

interface ContentItem {
  name: string;
  updated_at: string;
  image?: string;
  type: "article" | "exam" | "college";
}

type Content = typeof DEFAULT_CONTENT;

const getStats = (content: Content) => ({
  articles: content.articles.length,
  exams: content.exams.length,
  colleges: content.colleges.length,
});

const getFeatured = (content: Content): ContentItem[] => {
  const allItems: ContentItem[] = [
    ...content.articles.map(item => ({ name: item.name, updated_at: item.updated_at, image: item.image, type: "article" as "article" })),
    ...content.exams.map(item => ({ name: item.name, updated_at: item.updated_at, type: "exam" as "exam" })),
    ...content.colleges.map(item => ({ name: item.name, updated_at: item.updated_at, type: "college" as "college" })),
  ];
  return allItems.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 3);
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authorId = Number(id);
  if (isNaN(authorId)) return { title: "CollegePucho Admin" };

  const authorData = await getAuthor(authorId).catch(() => null);
  const author = authorData?.author_details ?? DEFAULT_AUTHOR;
  return {
    title: `CollegePucho: ${author.view_name}`,
    description: trimText(author.about, 160),
  };
}

const ContentSection = ({ title, items, className }: { title: string; items: { name: string; updated_at: string; image?: string }[]; className: string }) => (
  items.length > 0 && (
    <section className={`category ${className}`}>
      <h2>{title}</h2>
      <div className="content-grid">
        {items.map((item, i) => (
          <div key={i} className="content-item">
            <h3>{trimText(item.name, 50)}</h3>
            <p>{formatDateTime(item.updated_at)}</p>
          </div>
        ))}
      </div>
    </section>
  )
);

const AuthorIndividual = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const authorId = Number(id);
  if (isNaN(authorId)) return notFound();

  const authorData = await getAuthor(authorId).catch(() => null);
  const author = authorData?.author_details ?? DEFAULT_AUTHOR;
  const content = authorData?.content_written ?? DEFAULT_CONTENT;

  const stats = getStats(content);
  const featured = getFeatured(content);

  return (
    <div className="author-page">
      <header className="hero">
        <div className="hero-overlay"></div>
        <img src={author.image} alt={author.view_name} className="hero-avatar" />
        <h1 className="hero-title">{author.view_name}</h1>
        <p className="hero-role">{author.role}</p>
      </header>

      <main className="content-wrapper">
        <section className="about">
          <h2>About</h2>
          <p>{author.about}</p>
        </section>

        <section className="stats">
          {stats.articles > 0 && <div className="stat-card"><span>{stats.articles}</span> Articles</div>}
          {stats.exams > 0 && <div className="stat-card"><span>{stats.exams}</span> Exams</div>}
          {stats.colleges > 0 && <div className="stat-card"><span>{stats.colleges}</span> Colleges</div>}
        </section>

        {featured.length > 0 && (
          <section className="featured">
            <h2>Featured Work</h2>
            <div className="featured-grid">
              {featured.map((item, i) => (
                <div key={i} className="featured-item">
                  {item.type === "article" && (
                    <img src={item.image || getRandomFallbackImage(ARTICLE_FALLBACK_IMAGES)} alt={item.name} />
                  )}
                  <h3>{item.name}</h3>
                  <p>{formatDateTime(item.updated_at)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <ContentSection title="Articles" items={content.articles} className="articles" />
        <ContentSection title="Exams" items={content.exams} className="exams" />
        <ContentSection title="Colleges" items={content.colleges} className="colleges" />
      </main>
    </div>
  );
};

export default AuthorIndividual;