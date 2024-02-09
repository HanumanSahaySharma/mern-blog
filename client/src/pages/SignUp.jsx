import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill the all fields.");
      setLoading(false);
      return false;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/signup", formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
        navigate("/signin");
      } else {
        setLoading(false);
        setError(null);
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div className="container mx-auto max-w-[1480px] pl-8 pr-8">
      <div className="mx-auto max-w-[1000px] flex items-center">
        <form
          onSubmit={(e) => handleFormSubmit(e)}
          className="bg-white py-8 px-12 border border-slate-300 my-20 mx-auto w-full max-w-[480px] rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-5">Create an account</h2>
          {error && (
            <Alert className="mb-5 py-2.5" color="failure">
              {error}
            </Alert>
          )}
          <div className="mb-5">
            <Label htmlFor="name" value="Name" className="mb-2 block" />
            <TextInput id="name" type="text" onChange={handleChange} disabled={loading} />
          </div>
          <div className="mb-5">
            <Label htmlFor="email" value="Email" className="mb-2 block" />
            <TextInput id="email" type="email" onChange={handleChange} disabled={loading} />
          </div>
          <div className="mb-5">
            <Label htmlFor="password" value="Password" className="mb-2 block" />
            <TextInput id="password" type="password" onChange={handleChange} disabled={loading} />
          </div>
          <Button type="submit" gradientDuoTone="pinkToOrange" pill size="lg" fullSized className="mb-5">
            {loading ? <Loader color="gray" className="mr-2" size="md" /> : "Sign Up"}
          </Button>
          <OAuth />
          <p>
            Have an account?{" "}
            <Link to="/signin" className="text-red-500 font-semibold">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
