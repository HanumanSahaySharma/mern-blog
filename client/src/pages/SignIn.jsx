import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Alert } from "flowbite-react";
import Loader from "../components/Loader";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || formData.email === "" || formData.password === "") {
      dispatch(signInFailure("All fields are required"));
      return false;
    }
    try {
      dispatch(signInStart());
      const response = await axios.post("/api/auth/signin", formData);
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(signInSuccess(response.data.user));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.response.data.message));
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
            <TextInput id="email" type="email" onChange={handleChange} disabled={loading} />
          </div>
          <div className="mb-5">
            <Label htmlFor="password" value="Password" className="mb-2 block" />
            <TextInput id="password" type="password" onChange={handleChange} disabled={loading} />
          </div>
          <Button type="submit" gradientDuoTone="pinkToOrange" pill size="lg" fullSized className="mb-5">
            {loading ? <Loader color="gray" className="mr-2" size="md" /> : "Sign In"}
          </Button>
          <OAuth />
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
