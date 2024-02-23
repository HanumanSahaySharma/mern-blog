import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import { LuPencil, LuTrash } from "react-icons/lu";
import { capitalizeText } from "../utils/capitalizeText";
import Loader from "../components/Loader";

export default function Posts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getPosts() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/post/get-posts?userId=${currentUser._id}`);
        if (response.status === 200) {
          setPosts(response.data.posts);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    getPosts();
  }, [currentUser._id]);
  return (
    <div className="p-10 w-full">
      <div className="mx-auto w-full">
        <h1 className="text-2xl md:text-4xl mb-5">Post</h1>
        <div className="overflow-x-auto scrollbar scrollbar-track-slate-800 scrollbar-thumb-slate-500">
          {loading ? (
            <div className="bg-white p-5 flex justify-center">
              <Loader color="failure" className="mr-2" size="xl" />
            </div>
          ) : (
            <Table hoverable className="text-slate-800">
              <Table.Head>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Image</Table.HeadCell>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {posts?.length > 0 ? (
                  posts.map((post) => (
                    <Table.Row key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>
                        <Link to={post.slug}>
                          <img src={post.image} alt={post.title} className="w-20" />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link className="font-semibold" to={`/post/${post.slug}`}>
                          {post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{capitalizeText(post.category)}</Table.Cell>
                      <Table.Cell className="flex gap-2">
                        <Button to={`/post/edit/${post._id}`} as={Link} size="xs" gradientMonochrome="info">
                          <LuPencil size="16" />
                        </Button>
                        <Button size="xs" gradientMonochrome="failure">
                          <LuTrash size="16" />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell>
                      <p>You have not posts yet!</p>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
