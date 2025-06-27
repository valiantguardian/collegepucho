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
        <h2 className="font-bold lg:text-5xl">Latest News</h2>
        <Link href="/articles" className="text-primary-main font-semibold">
          View All
        </Link>
      </div>

      <div className="grid gap-6">
        {/* All news items in a grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.slice(0, 4).map(({ updated_at, title, meta_desc, article_id, slug }, index) => (
            <div
              key={article_id}
              className={`
                flex flex-col border-dashed border border-[#C4CDD5] rounded-lg p-4 sm:p-6 bg-white shadow-sm hover:shadow-md transition-shadow
                ${index === 0 ? 'sm:col-span-2 lg:col-span-3 sm:grid sm:grid-cols-12 sm:items-center' : ''}
              `}
            >
              <div className={`mb-4 ${index === 0 ? 'sm:col-span-2' : ''}`}>
                <Image 
                  src={index === 0 ? "/svg/right-blue.svg" : "/svg/right.svg"}
                  alt="icon" 
                  width={index === 0 ? 80 : 50} 
                  height={index === 0 ? 80 : 50} 
                  className={`w-12 h-auto ${index === 0 ? 'sm:w-full' : 'sm:w-auto'}`}
                />
              </div>
              <div className={`flex-grow ${index === 0 ? 'sm:col-span-8' : ''}`}>
                <p className="text-[#00B8D9] font-semibold text-xs sm:text-sm mb-2">
                  {formatDate(updated_at)}
                </p>
                <h3 className={`font-semibold mb-2 ${index === 0 ? 'sm:text-xl' : ''}`}>
                  {trimText(title || "", index === 0 ? 100 : 60)}
                </h3>
                <p className="text-sm text-[#637381]">
                  {trimText(meta_desc || "", index === 0 ? 150 : 100)}
                </p>
              </div>
              <div className={`mt-4 ${index === 0 ? 'sm:col-span-2 sm:flex sm:justify-end' : ''}`}>
                <Link
                  href={`/articles/${slug}-${article_id}`}
                  className={`
                    text-primary-main bg-[#2B4EFF14] rounded-xl font-medium text-sm whitespace-pre flex items-center gap-2 hover:bg-[#2B4EFF24] transition-colors w-full
                    ${index === 0 ? 'sm:w-auto sm:p-3 p-2 justify-center sm:justify-start' : 'p-2 justify-center'}
                  `}
                >
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const News = React.memo(NewsComponent);
News.displayName = "News";

export default News;
