import { HomeArticle } from "@/api/@types/home-datatype";
import { formatDate } from "@/components/utils/formatDate";
import { trimText } from "@/components/utils/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface NewsProps {
  data: HomeArticle[];
}

const NewsComponent: React.FC<NewsProps> = ({ data }) => {
  return (
    <div className="container-body pb-6 md:pb-12">
      <div className="flex justify-between items-center py-6">
        <h2 className="font-bold lg:text-5xl ">
          Latest News
        </h2>
        <Link href="/articles" className="text-primary-main font-semibold">
          View All
        </Link>
      </div>

      {data
        .slice(0, 3)
        .map(({ updated_at, title, meta_desc, article_id, slug }) => (
          <div
            key={article_id}
            className="grid sm:grid-cols-12 gap-6 items-center border-dashed border-b border-[#C4CDD5] py-6"
          >
            <div className="col-span-1">
              <Image src="/svg/right.svg" alt="icon" width={60} height={60} />
            </div>
            <div className="col-span-9">
              <p className="text-[#00B8D9] font-semibold text-xs">
                {formatDate(updated_at)}
              </p>
              <h3 className="font-semibold">{trimText(title, 72)}</h3>
              <p className="text-sm text-[#637381]">{meta_desc}</p>
            </div>
            <div className="col-span-2 md:text-end">
              <Link
                href={`/articles/${slug}-${article_id}`}
                className="text-primary-main bg-[#2B4EFF14] p-2 rounded-xl font-medium text-sm whitespace-pre flex items-center justify-center gap-2"
              >
                Read More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

const News = React.memo(NewsComponent);
News.displayName = "News";

export default News;
