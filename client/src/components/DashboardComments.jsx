import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Table, Modal } from "flowbite-react";
import { LuTrash, LuInfo } from "react-icons/lu";

import Loader from "./Loader";
import axios from "axios";

export default function DashboardComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  const getComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/comment/all-comments");
      if (response.status === 200) {
        setComments(response.data.comments);
        setLoading(false);
        if (response.data.comments.length < 10) {
          setShowMore(false);
        } else {
          setShowMore(true);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async () => {
    setConfirmModal(false);
    try {
      const response = await axios.delete(`/api/comment/deleteComment/${commentIdToDelete}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        setComments(comments.filter((comment) => comment._id !== commentIdToDelete));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const response = await axios.get(`/api/comment/all-comments?startIndex=${startIndex}`);
      if (response.status === 200) {
        setComments((comments) => [...comments, ...response.data.comments]);
        if (response.data.comments.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.messsage);
    }
  };

  useEffect(() => {
    getComments();
  }, []);
  return (
    <div className="container mx-auto max-w-[1480px] pl-8 pr-8 py-10">
      <h1 className="text-3xl font-bold mb-5">Comments</h1>
      <div className="mx-auto p-2 bg-white rounded dark:bg-slate-800">
        {loading ? (
          <Loader color="gray" className="mr-2 mx-auto" size="xl" />
        ) : (
          <Table>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>No of Likes</Table.HeadCell>
              <Table.HeadCell>Post ID</Table.HeadCell>
              <Table.HeadCell>User ID</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments.length > 0 &&
                comments.map((comment) => (
                  <Table.Row
                    key={comment._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <Table.Cell>{new Date(comment?.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{comment.content}</Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    <Table.Cell>
                      <Button
                        onClick={() => {
                          setConfirmModal(true), setCommentIdToDelete(comment._id);
                        }}
                        size="xs"
                        gradientMonochrome="failure"
                        outline
                      >
                        <LuTrash size="16" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        )}
      </div>
      {showMore && (
        <Button onClick={handleShowMore} gradientMonochrome="failure" outline size="sm" className="mt-5 mx-auto">
          Show more
        </Button>
      )}
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
  );
}
