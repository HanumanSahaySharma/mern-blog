import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import Profile from "../components/Profile";
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
      {tab === "profile" && <Profile />}
    </div>
  );
}
