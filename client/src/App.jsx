import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import React Toatify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Components
import Header from "./components/header";
import Footer from "./components/Footer";

// Import Pages for Routing
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <Router>
      <ToastContainer autoClose={3000} />
      <Header />
      <main className="w-full bg-slate-100 main dark:bg-gray-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />}>
            Home
          </Route>
          <Route path="/about" element={<About />}>
            About
          </Route>
          <Route path="/projects" element={<Projects />}>
            Projects
          </Route>
          <Route path="/dashboard" element={<Dashboard />}>
            Dashboard
          </Route>
          <Route path="/signin" element={<SignIn />}>
            SignIn
          </Route>
          <Route path="/signup" element={<SignUp />}>
            SignUp
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
