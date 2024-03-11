import axios from "axios";
import moment from "moment";
import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { LuThumbsUp } from "react-icons/lu";
import { useSelector } from "react-redux";

export default function Comments({ comment, onLike }) {
  const [user, setUser] = useState({});
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
  return (
    <div className="py-5 border-b border-b-slate-300 flex">
      <img src={user.profileImage} className="w-10 rounded-full self-start" />
      <div className="pl-5">
        <p className="font-bold mb-2 text-sm">
          <span className="text-orange-500">@{user.username}</span>
          <span className="text-slate-500 ml-2 font-normal">{moment(comment.createdAt).fromNow()}</span>
        </p>
        <p className="text-slate-600">{comment.content}</p>
        <div className="flex items-center gap-2 pt-2">
          <Button
            color="light"
            onClick={() => onLike(comment._id)}
            size="sm"
            className={`border-none hover:bg-orange-500 enabled:hover:bg-orange-500 enabled:hover:text-white ${
              currentUser && comment.likes.includes(currentUser._id) ? "bg-orange-500 text-white" : ""
            }`}
          >
            <LuThumbsUp />
          </Button>
          <span className="text-slate-600">
            {comment.numberOfLikes}
            {comment.numberOfLikes > 1 ? " likes" : " like"}
          </span>
        </div>
      </div>
    </div>
  );
}
