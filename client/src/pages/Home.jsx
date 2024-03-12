import React from "react";
import bannerImage from "../image/banner.png";
import RecentPosts from "../components/RecentArticles";

export default function Home() {
  return (
    <div className="w-full">
      <div className="">
        <img src={bannerImage} className="w-full object-cover" />
      </div>
      <div className="py-10">
        <div className="container mx-auto max-w-[1480px] pl-8 pr-8">
          <RecentPosts />
        </div>
      </div>
    </div>
  );
}
