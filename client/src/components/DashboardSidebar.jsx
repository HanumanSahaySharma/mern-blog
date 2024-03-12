import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { LuUser, LuPenSquare, LuUsers, LuLogOut, LuMessagesSquare } from "react-icons/lu";
import { signoutSuccess } from "../redux/user/userSlice";

export default function DashboardSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
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
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Sidebar.Item
            as={Link}
            to="/dashboard?tab=profile"
            active={tab === "profile"}
            icon={LuUser}
            label={currentUser.isAdmin ? "Admin" : "User"}
            labelColor="dark"
          >
            Profile
          </Sidebar.Item>
          {currentUser.isAdmin && (
            <>
              <Sidebar.Item as={Link} to="/dashboard?tab=posts" active={tab === "posts"} icon={LuPenSquare}>
                Posts
              </Sidebar.Item>
              <Sidebar.Item as={Link} to="/dashboard?tab=users" active={tab === "users"} icon={LuUsers}>
                Users
              </Sidebar.Item>
              <Sidebar.Item as={Link} to="/dashboard?tab=comments" active={tab === "comments"} icon={LuMessagesSquare}>
                Comments
              </Sidebar.Item>
            </>
          )}
          <Sidebar.Item onClick={handleSignout} icon={LuLogOut} className="cursor-pointer">
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
