import axios from "axios";
import { Button, Label, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Article from "../components/Article";
import Loader from "../components/Loader";

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "asc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const response = await axios.get(`/api/post/getposts?${searchQuery}`);
    if (response.status === 200) {
      setPosts([...posts, ...response.data.posts]);
      if (response.data.posts.length === 10) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const sortFromCaterogy = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || sortFromCaterogy) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: sortFromCaterogy,
      });
    }

    async function getPost() {
      setLoading(true);
      const searchQuery = urlParams.toString();
      console.log(searchQuery);
      try {
        const response = await axios.get(`/api/post/get-posts?${searchQuery}`);
        if (response.status === 200) {
          console.log(response.data);
          setLoading(false);
          setPosts(response.data.posts);
        }
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    }
    getPost();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      const searchTerm = e.target.value;
      setSidebarData({ ...sidebarData, searchTerm });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  console.log(sidebarData);
  return (
    <div className="flex">
      <div className="border-r border-r-slate-300 min-h-screen w-80 p-8 bg-white min-w-80">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label className="mb-2 block">Search Term</Label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label className="mb-2 block">Sory by</Label>
            <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="mb-4">
            <Label className="mb-2 block">Category</Label>
            <Select id="category" value={sidebarData.category} onChange={handleChange}>
              <option value="uncategorized">Uncategorized</option>
              <option value="javascript">JavaScript</option>
              <option value="css">CSS</option>
              <option value="devops">DevOps</option>
              <option value="design">Design</option>
              <option value="react">React</option>
            </Select>
          </div>
          <Button outline type="submit" gradientDuoTone="pinkToOrange" fullSized size="lg">
            Search
          </Button>
        </form>
      </div>
      <div className="p-10 flex flex-grow flex-col self-start">
        {loading ? (
          <Loader color="gray" className="mr-2" size="xl" />
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-600 p-10 shadow-lg rounded-lg w-full">
            <p>No post found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 self-start gap-5">
              {posts.length > 0 && posts.map((post) => <Article article={post} key={post._id} />)}
            </div>
            {showMore && (
              <div className="text-center mt-10">
                <Button onClick={handleShowMore} outline gradientDuoTone="pinkToOrange">
                  Show More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
