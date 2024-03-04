import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Table, Modal } from "flowbite-react";
import { LuPencil, LuTrash, LuInfo } from "react-icons/lu";
import { capitalizeText } from "../utils/capitalizeText";
import Loader from "../components/Loader";

export default function Posts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    async function getPosts() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/post/get-posts?userId=${currentUser._id}`);
        if (response.status === 200) {
          setPosts(response.data.posts);
          setLoading(false);
          if (response.data.posts.length < 10) {
            setShowMore(false);
          }
        }
      } catch (error) {
        setLoading(false);
      }
    }
    getPosts();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    try {
      const response = await axios.get(`/api/post/get-posts?userId=${currentUser._id}&startIndex=${startIndex}`);
      console.log(response.data.post);
      if (response.status === 200) {
        setPosts((prev) => [...prev, ...response.data.posts]);
        console.log(posts);
        if (response.data.posts.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.messsage);
    }
  };
  const handleDelete = async () => {
    setConfirmModal(false);
    try {
      const response = await axios.delete(`/api/post/delete/${postIdToDelete}/${currentUser._id}`);
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        setPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-10 w-full">
      <div className="mx-auto w-full">
        <div className="flex justify-between mb-5">
          <h1 className="text-2xl md:text-4xl">Post</h1>
          <Button as={Link} to="/post/create-post" gradientDuoTone="pinkToOrange" outline>
            Create Post
          </Button>
        </div>
        <div className="overflow-x-auto scrollbar scrollbar-track-slate-800 scrollbar-thumb-slate-500">
          {loading ? (
            <div className="bg-white p-5 flex justify-center">
              <Loader color="gray" className="mr-2" size="xl" />
            </div>
          ) : (
            <>
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
                          <Button to={`/post/edit/${post._id}`} as={Link} outline size="xs" gradientMonochrome="info">
                            <LuPencil size="16" />
                          </Button>
                          <Button
                            onClick={() => {
                              setConfirmModal(true), setPostIdToDelete(post._id), setUserIdToDelete(post.userId);
                            }}
                            size="xs"
                            gradientMonochrome="failure"
                            outline
                          >
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
              {showMore && (
                <Button
                  onClick={handleShowMore}
                  gradientMonochrome="failure"
                  outline
                  size="sm"
                  className="mt-5 mx-auto"
                >
                  Show more
                </Button>
              )}
            </>
          )}
        </div>
        <Modal show={confirmModal} onClose={() => setConfirmModal(false)} popup size="md">
          <Modal.Header />
          <Modal.Body className="text-center">
            <LuInfo size="50" color="gray" className="mx-auto" />
            <p className="text-2xl text-slate-500 mb-10 mt-5">Are you sure want to delete this post?</p>
            <div className="flex gap-5">
              <Button fullSized gradientDuoTone="pinkToOrange" onClick={handleDelete}>
                Delete
              </Button>
              <Button onClick={() => setConfirmModal(false)} fullSized outline gradientDuoTone="pinkToOrange">
                Cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
