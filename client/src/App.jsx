import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import React Toatify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Components
import Header from "./components/header";
import Footer from "./components/Footer";
import PrivateRoutes from "./components/PrivateRoutes";
import OnlyAdminPrivateRoutes from "./components/OnlyAdminPrivateRoutes";

// Import Pages for Routing
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Users from "./pages/Users";

export default function App() {
  return (
    <Router>
      <ToastContainer autoClose={3000} />
      <Header />
      <main className="w-full bg-slate-100 main dark:bg-gray-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<OnlyAdminPrivateRoutes />}>
            <Route path="post/create-post" element={<CreatePost />} />
            <Route path="post/edit/:postId" element={<EditPost />} />
            <Route path="/users" element={<Users />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
