import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useRoutes } from "react-router-dom";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { RiSearchLine, RiMoonLine } from "react-icons/ri";

export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="w-full bg-white border-b border-b-slate-300">
      <div className="container mx-auto max-w-[1480px] pl-8 pr-8">
        <div className="grid grid-cols-2 gap4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="mr-5 flex self-start items-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="rounded-full flex items-center justify-center font-bold w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-400 text-white mr-3">
                B
              </span>
              Bloggy
            </Link>
            <form className="hidden lg:block w-2/4">
              <TextInput className="w-full" type="text" placeholder="Search..." rightIcon={RiSearchLine} />
            </form>
            <Button className="w-12 h-10 block lg:hidden" color="gray" pill>
              <RiSearchLine />
            </Button>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Navbar>
              <Navbar.Toggle />
              <Navbar.Collapse className="navbar-nav">
                <Navbar.Link as={Link} to="/" active={path === "/"}>
                  Home
                </Navbar.Link>
                <Navbar.Link as={Link} to="/about" active={path === "/about"}>
                  About
                </Navbar.Link>
                <Navbar.Link as={Link} to="/projects" active={path === "/projects"}>
                  Projects
                </Navbar.Link>
              </Navbar.Collapse>
            </Navbar>
            <Button className="w-12 h-10 sm:inline px-0" color="light" pill>
              <RiMoonLine />
            </Button>
            {currentUser ? (
              <Dropdown inline size="sm" label={<Avatar rounded img={currentUser.profileImage}></Avatar>}>
                <Dropdown.Header>
                  <p className="font-bold mb-1">{currentUser.name}</p>
                  <p>{currentUser.email}</p>
                </Dropdown.Header>
                <Link to="/dashboard?tab=profile">
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item>Sign out</Dropdown.Item>
              </Dropdown>
            ) : (
              <Button gradientDuoTone="pinkToOrange" pill>
                <Link to="/signin">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
