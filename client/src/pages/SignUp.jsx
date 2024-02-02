import React from "react";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="container mx-auto max-w-[1480px] pl-8 pr-8">
      <div className="mx-auto max-w-[1000px] flex items-center">
        <div className="grid grid-cols-2 mt-20">
          <div className="flex flex-col justify-center items-start p-12 bg-gradient-to-r from-pink-500 to-orange-400 text-white">
            <h1 className="text-4xl font-bold mb-5">Welcome Back!</h1>
            <p className="mb-5 text-[18px] leading-8">To keep connected with us, please login with your credentails.</p>
            <Button to="/signin" as={Link} outline gradientDuoTone="pinkToOrange" pill size="lg" fullSized>
              Sign In
            </Button>
          </div>
          <form className="bg-white py-8 px-12 border border-slate-300 border-l-0">
            <h2 className="text-2xl font-bold mb-8">Create an account</h2>
            <div className="mb-5">
              <Label htmlFor="username" value="Username" className="mb-2 block" />
              <TextInput id="username" type="text" />
            </div>
            <div className="mb-5">
              <Label htmlFor="email" value="Email" className="mb-2 block" />
              <TextInput id="email" type="email" />
            </div>
            <div className="mb-5">
              <Label htmlFor="password" value="Password" className="mb-2 block" />
              <TextInput id="password" type="password" />
            </div>
            <Button type="submit" gradientDuoTone="pinkToOrange" pill size="lg" fullSized className="mb-5">
              Sign Up
            </Button>
            <p>
              Have an account?{" "}
              <Link to="/signin" className="text-red-500 font-semibold">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
