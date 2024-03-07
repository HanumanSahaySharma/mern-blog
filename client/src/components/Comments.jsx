import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";

export default function Comments({ comment }) {
  const [user, setUser] = useState({});
  const userId = comment.userId;

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`/api/auth/user/${userId}`);
        console.log(response.data);
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
      </div>
    </div>
  );
}
