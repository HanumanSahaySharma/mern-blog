import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { AiOutlineUser, AiOutlineLogout } from "react-icons/ai";
import { signoutSuccess } from "../redux/user/userSlice";

export default function DashboardSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignout = async () => {
    try {
      const response = await axios.post("/api/auth/user/signout");
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(signoutSuccess());
        navigate("/");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  return (
    <Sidebar className="md:w-80 w-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            as={Link}
            to="/dashboard?tab=profile"
            active={tab === "profile"}
            icon={AiOutlineUser}
            label="User"
            labelColor="dark"
          >
            Profile
          </Sidebar.Item>
          <Sidebar.Item onClick={handleSignout} icon={AiOutlineLogout} className="cursor-pointer">
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
