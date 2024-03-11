import axios from "axios";
import moment from "moment";
import { Button, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { LuThumbsUp, LuPencil, LuTrash2 } from "react-icons/lu";
import { useSelector } from "react-redux";

export default function Comments({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const userId = comment.userId;
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`/api/auth/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = (e) => {
    e.preventDefault();
    onEdit(comment, editedContent);
    setEditing(false);
  };
  return (
    <div className="py-5 border-b border-b-slate-300 flex">
      <img src={user.profileImage} className="w-10 rounded-full self-start" />
      <div className="pl-5 flex-grow">
        <p className="font-bold mb-2 text-sm">
          <span className="text-orange-500">@{user.username}</span>
          <span className="text-slate-500 ml-2 font-normal">{moment(comment.createdAt).fromNow()}</span>
        </p>
        {!isEditing && <p className="text-slate-700">{comment.content}</p>}
        {isEditing ? (
          <form onSubmit={handleEdit}>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={4}
              maxLength={250}
              className="outline-0 border border-slate-300 focus:border-pink-300 w-full"
            ></Textarea>
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" type="submit" color="light">
                Submit
              </Button>
              <Button size="sm" type="button" color="light" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            <Button color="light" onClick={() => onLike(comment._id)} size="sm">
              <LuThumbsUp
                className={`mr-2 ${currentUser && comment.likes.includes(currentUser._id) ? "text-orange-500" : ""}`}
              />
              <span className="text-slate-700">
                {comment.numberOfLikes}
                {comment.numberOfLikes > 1 ? " likes" : " like"}
              </span>
            </Button>
            {currentUser.isAdmin && currentUser._id === comment.userId && (
              <>
                <Button color="light" onClick={() => setEditing(true)} size="sm">
                  <LuPencil className="mr-2" />
                  <span className="text-slate-700">Edit</span>
                </Button>
                <Button color="light" onClick={() => onDelete(comment._id)} size="sm">
                  <LuTrash2 className="mr-2" />
                  <span className="text-slate-700">Delete</span>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
