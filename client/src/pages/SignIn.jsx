import React, { useState } from "react";
import axios from "axios";
import { Button, Label, TextInput, Alert } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

export default function SignIn() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.email || !formData.password || formData.email === "" || formData.password === "") {
      setError("All field are required");
      setLoading(false);
      return false;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/api/auth/signin", formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="container mx-auto max-w-[1480px] pl-8 pr-8">
      <div className="mx-auto max-w-[1000px] flex items-center">
        <form
          onSubmit={(e) => handleFormSubmit(e)}
          className="bg-white py-8 px-12 border border-slate-300 my-20 mx-auto w-full max-w-[480px] rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-5">Login</h2>
          {error && (
            <Alert className="mb-5 py-2.5" color="failure">
              {error}
            </Alert>
          )}
          <div className="mb-5">
            <Label htmlFor="email" value="Email" className="mb-2 block" />
            <TextInput id="email" type="text" onChange={handleChange} disabled={loading} />
          </div>
          <div className="mb-5">
            <Label htmlFor="password" value="Password" className="mb-2 block" />
            <TextInput id="password" type="password" onChange={handleChange} disabled={loading} />
          </div>
          <Button type="submit" gradientDuoTone="pinkToOrange" pill size="lg" fullSized className="mb-5">
            {loading ? <Loader color="gray" className="mr-2" size="md" /> : "Sign In"}
          </Button>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-red-500 font-semibold">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
