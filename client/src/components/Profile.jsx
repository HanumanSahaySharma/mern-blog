import React from "react";
import { useSelector } from "react-redux";
import { Avatar, Button, Label, TextInput } from "flowbite-react";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-10 w-full">
      <div className="max-w-[540px] mx-auto w-full">
        <h1 className="text-4xl text-center">Profile</h1>
        <form className="mt-5">
          <div className="w-40 h-40 rounded-full border-4 border-slate-300 mx-auto mb-5 shadow-xl dark:border-slate-400">
            <img src={currentUser.profileImage} alt="user profile image" className="rounded-full w-full object-cover" />
          </div>
          <div className="mb-5">
            <Label htmlFor="name" value="Name" className="mb-2 block" />
            <TextInput id="name" type="text" defaultValue={currentUser.name} />
          </div>
          <div className="mb-5">
            <Label htmlFor="email" value="Email" className="mb-2 block" />
            <TextInput id="email" type="email" defaultValue={currentUser.email} />
          </div>
          <div className="mb-5">
            <Label htmlFor="password" value="Password" className="mb-2 block" />
            <TextInput id="password" type="password" />
          </div>
          <Button type="submit" gradientDuoTone="pinkToOrange" pill size="lg" fullSized className="mb-5">
            Update Profile
          </Button>
        </form>
        <div className="flex justify-between">
          <Button color="light">Delete Account</Button>
          <Button color="light">Sign Out</Button>
        </div>
      </div>
    </div>
  );
}
