import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "flowbite-react";
import { capitalizeText } from "../utils/capitalizeText";

export default function Article({ article }) {
  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden" key={article._id}>
      <Link to={`/post/${article.slug}`}>
        <div className="w-full h-40 bg-contain" style={{ backgroundImage: `url(${article.image})` }}></div>
      </Link>
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-xl mb-2">
          <Link to={`/post/${article.slug}`}>{article.title}</Link>
        </h3>
        <Badge color="success" className="mb-5 inline-flex">
          {capitalizeText(article?.category)}
        </Badge>
        <div
          dangerouslySetInnerHTML={{ __html: article && article.content.substr(0, 180) + "..." }}
          className="mb-5"
        ></div>
        <Link
          to={`/post/${article.slug}`}
          className="px-4 py-3 rounded text-white text-sm font-semibold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-800"
        >
          Read more
        </Link>
      </div>
    </div>
  );
}
