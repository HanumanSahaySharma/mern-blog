import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";

import { LuArrowUpFromLine, LuUsers, LuPenSquare, LuMessageSquare, LuBadgeCheck, LuBadgeX } from "react-icons/lu";
import ButtonLink from "./ButtonLink";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import { capitalizeText } from "../utils/capitalizeText";

export default function DashboardComp() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  const { currentUser } = useSelector((state) => state.user);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/auth/user/get-users?limit=10");
      if (response.status === 200) {
        setUsers(response.data.users);
        setTotalUsers(response.data.totalUsers);
        setLastMonthUsers(response.data.lastMonthUsers);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const getPosts = async () => {
    try {
      const response = await axios.get("/api/post/get-posts?limit=5");
      if (response.status === 200) {
        setPosts(response.data.posts);
        setTotalPosts(response.data.totalPosts);
        setLastMonthPosts(response.data.lastMonthPosts);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getComments = async () => {
    try {
      const response = await axios.get("/api/comment/all-comments?limit=5");
      if (response.status === 200) {
        setComments(response.data.comments);
        setTotalComments(response.data.totalComments);
        setLastMonthComments(response.data.lastMonthComment);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      getUsers();
      getPosts();
      getComments();
    }
  }, [currentUser]);
  return (
    <div className="container mx-auto max-w-[1480px] pl-8 pr-8 py-10">
      <h1 className="text-3xl font-bold mb-5">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="w-full px-8 py-4 bg-white rounded-xl dark:bg-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex flex-col">
              <span className="font-semibold uppercase text-slate-500">Total Users</span>
              <span className="text-[40px]">{totalUsers}</span>
            </h2>
            <div className="flex items-center justify-center rounded-full w-14 h-14 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
              <LuUsers size="24" />
            </div>
          </div>
          <div className="font-medium flex text-slate-500">
            <span className={`mr-2 flex items-center ${lastMonthUsers > 0 ? "text-green-500" : ""}`}>
              <LuArrowUpFromLine size="20" className="mr-2" /> {lastMonthUsers}
            </span>
            <span>Last month</span>
          </div>
        </div>
        <div className="w-full px-8 py-4 bg-white rounded-xl dark:bg-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex flex-col">
              <span className="font-semibold uppercase text-slate-500">Total Posts</span>
              <span className="text-[40px]">{totalPosts}</span>
            </h2>
            <div className="flex items-center justify-center rounded-full w-14 h-14 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
              <LuPenSquare size="24" />
            </div>
          </div>
          <div className="font-medium flex text-slate-500">
            <span className={`mr-2 flex items-center ${lastMonthPosts > 0 ? "text-green-500" : ""}`}>
              <LuArrowUpFromLine size="20" className="mr-2" /> {lastMonthPosts}
            </span>
            <span>Last month</span>
          </div>
        </div>
        <div className="w-full px-8 py-4 bg-white rounded-xl dark:bg-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex flex-col">
              <span className="font-semibold uppercase text-slate-500">Total Comments</span>
              <span className="text-[40px]">{totalComments}</span>
            </h2>
            <div className="flex items-center justify-center rounded-full w-14 h-14 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
              <LuMessageSquare size="24" />
            </div>
          </div>
          <div className="font-medium flex text-slate-500">
            <span className={`mr-2 flex items-center ${lastMonthComments > 0 ? "text-green-500" : ""}`}>
              <LuArrowUpFromLine size="20" className="mr-2" /> {lastMonthComments}
            </span>
            <span>Last month</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="w-full bg-white rounded-xl dark:bg-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2 px-8 py-4">
            <h2 className="font-semibold uppercase text-slate-500">Recent users</h2>
            <ButtonLink url="/dashboard?tab=users" />
          </div>
          {loading ? (
            <Loader color="gray" className="mx-auto w-10 h-10 mb-4" size="xl" />
          ) : (
            <Table>
              <Table.Head>
                <Table.HeadCell>Avatar</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {users.length > 0 &&
                  users.map((user) => (
                    <Table.Row
                      key={user._id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <Table.Cell>
                        <img src={user.profileImage} className="w-10 h-10 object-contain rounded-full" />
                      </Table.Cell>
                      <Table.Cell>{user.username}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap text-ellipsis max-w-[200px] overflow-hidden">
                        {user.email}
                      </Table.Cell>
                      <Table.Cell>
                        {user.isAdmin ? (
                          <LuBadgeCheck size="24" className="text-lime-600" />
                        ) : (
                          <LuBadgeX size="24" className="text-red-600" />
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          )}
        </div>
        <div className="w-full bg-white rounded-xl dark:bg-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2 px-8 py-4">
            <h2 className="font-semibold uppercase text-slate-500">Recent comments</h2>
            <ButtonLink url="/dashboard?tab=comments" />
          </div>
          {loading ? (
            <Loader color="gray" className="mx-auto w-10 h-10 mb-4" size="xl" />
          ) : (
            <Table>
              <Table.Head>
                <Table.HeadCell>Comment</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {comments.length > 0 &&
                  comments.map((comment) => (
                    <Table.Row
                      key={comment._id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <Table.Cell>{comment.content}</Table.Cell>
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          )}
        </div>
      </div>
      <div className="w-full bg-white rounded-xl dark:bg-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-2 px-8 py-4">
          <h2 className="font-semibold uppercase text-slate-500">Recent posts</h2>
          <ButtonLink url="/dashboard?tab=posts" />
        </div>
        {loading ? (
          <Loader color="gray" className="mx-auto w-10 h-10 mb-4" size="xl" />
        ) : (
          <Table>
            <Table.Head>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {posts.length > 0 &&
                posts.map((post) => (
                  <Table.Row
                    key={post._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img src={post.image} alt={post.title} className="w-20 rounded" />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>{post.title}</Link>
                    </Table.Cell>
                    <Table.Cell>{capitalizeText(post.category)}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  );
}
