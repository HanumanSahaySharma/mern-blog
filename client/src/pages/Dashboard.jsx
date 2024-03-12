import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardComp from "../components/DashboardComp";
import Profile from "../components/Profile";
import Posts from "../components/Posts";
import Users from "../pages/Users";
import Comments from "../components/DashboardComments";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="border-r-slate-300 dark:border-r-slate-700 border-r">
        <DashboardSidebar />
      </div>
      {tab === "dashboard" && <DashboardComp />}
      {tab === "profile" && <Profile />}
      {tab === "posts" && <Posts />}
      {tab === "users" && <Users />}
      {tab === "comments" && <Comments />}
    </div>
  );
}
