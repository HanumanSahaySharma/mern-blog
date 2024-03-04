import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge, Button } from "flowbite-react";
import { LuMoveLeft } from "react-icons/lu";
import { capitalizeText } from "../utils/capitalizeText";
import Loader from "../components/Loader";

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const getPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/post/get-posts?slug=${slug}`);
      if (response.status === 200) {
        setPost(response.data.posts[0]);
        setLoading(false);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getPost();
  }, [slug]);
  console.log(post);
  return (
    <div className="container mx-auto max-w-[1480px] pl-8 pr-8 py-10">
      <div className="mx-auto  p-10 bg-white rounded dark:bg-slate-800">
        <div className="mb-5">
          <Button
            as={Link}
            outline
            to="/dashboard?tab=posts"
            gradientMonochrome="failure"
            size="sm"
            className="inline-flex"
          >
            <LuMoveLeft />
          </Button>
        </div>
        {loading ? (
          <Loader color="gray" className="mr-2" size="xl" />
        ) : (
          <>
            {post && (
              <Badge color="warning" className="mb-5 inline-flex">
                {capitalizeText(post?.category)}
              </Badge>
            )}
            <h1 className="text-3xl font-bold mb-5">{post && post.title}</h1>
            <div className="mb-5 text-slate-600 flex gap-10 border-b border-b-slate-300 pb-5">
              <span>{new Date(post?.updatedAt).toLocaleDateString()}</span>
              <span>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>

            {post && (
              <div className="p-2 border border-slate-300 rounded-lg mb-5">
                <img src={post.image} className="object-cover w-full" />
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
          </>
        )}
      </div>
    </div>
  );
}
