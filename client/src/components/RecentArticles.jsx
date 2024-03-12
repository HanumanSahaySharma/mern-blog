import axios from "axios";
import React, { useEffect, useState } from "react";
import Article from "./Article";

export default function RecentPosts() {
  const [articles, setArticles] = useState([]);
  const getArticles = async () => {
    try {
      const response = await axios.get("/api/post/get-posts?limit=3");
      if (response.status == 200) {
        setArticles(response.data.posts);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getArticles();
  }, []);
  return (
    <div className="w-full">
      <h2 className="font-bold text-2xl">Recent articles</h2>
      {articles && (
        <div className="grid grid-cols-3 gap-4 mt-5">
          {articles.map((article) => (
            <Article article={article} key={article._id} />
          ))}
        </div>
      )}
    </div>
  );
}
