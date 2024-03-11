import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";
import Comments from "./Comments";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const userId = currentUser._id;

  const [comments, setComments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/comment/create", {
        content: comment,
        userId,
        postId,
      });
      if (response.status === 201) {
        setLoading(false);
        setComment("");
        toast.success(response.data.message);
        setComments([response.data.comment, ...comments]);
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const response = await axios.put(`/api/comment/likeComment/${commentId}`);
      if (!currentUser) {
        navigate("/signin");
        return;
      }
      if (response.status === 200) {
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: response.data.likes,
                  numberOfLikes: response.data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(`/api/comment/get-comments/${postId}`);
        if (response.status === 200) {
          setComments(response.data.comments);
        }
      } catch (error) {
        setError(error.response.data.message);
      }
    };
    getComments();
  }, [postId]);
  return (
    <div className="mt-5 mx-auto max-w-[740px]">
      {currentUser ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span>Signed in as: </span>
          <img width="30" src={currentUser.profileImage} className="rounded-full" />
          <Link to="/dashboard?tab=profile" className="text-orange-600">
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-5 mb-4 text-orange-500">
          <h3 className="font-normal">You must be signed in to comment</h3>
          <Link
            to="/signin"
            className="text-sm inline-flex px-5 py-2 font-normal bg-gradient-to-t  from-pink-500 to-orange-500 border-none rounded-lg text-white"
          >
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className="border border-slate-300 p-5 my-4 rounded-lg mb-10">
          {error && (
            <Alert className="mb-5 py-2.5" color="failure">
              {error}
            </Alert>
          )}
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            rows={5}
            maxLength={250}
            className="outline-0 border border-slate-300 focus:border-pink-300"
          ></Textarea>
          <div className="flex items-center justify-between mt-5">
            <p className="text-slate-500 text-sm">{250 - comment.length} characters remaining</p>
            <Button type="submit" outline gradientDuoTone="pinkToOrange">
              {loading ? <Loader color="gray" className="mr-2" size="md" /> : "Submit"}
            </Button>
          </div>
        </form>
      )}
      {comments.length > 0 ? (
        <>
          <h3 className="font-medium">
            Comments <span className="text-sm border border-slate-300 px-2 py-1 rounded">{comments.length}</span>
          </h3>
          {comments.map((comment) => (
            <Comments comment={comment} key={comment._id} onLike={handleLike} />
          ))}
        </>
      ) : (
        <p className="text-sm text-slate-500">No comments yet</p>
      )}
    </div>
  );
}
