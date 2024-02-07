import React from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignIn() {
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="container mx-auto max-w-[1480px] pl-8 pr-8">
      <div className="mx-auto max-w-[1000px] flex items-center">
        <form
          onSubmit={(e) => handleFormSubmit(e)}
          className="bg-white py-8 px-12 border border-slate-300 my-20 mx-auto w-full max-w-[480px] rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-5">Login</h2>
          <div className="mb-5">
            <Label htmlFor="username" value="Username" className="mb-2 block" />
            <TextInput id="username" type="text" />
          </div>
          <div className="mb-5">
            <Label htmlFor="password" value="Password" className="mb-2 block" />
            <TextInput id="password" type="password" />
          </div>
          <Button type="submit" gradientDuoTone="pinkToOrange" pill size="lg" fullSized className="mb-5">
            Sign In
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
