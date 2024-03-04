import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { app } from "../firebase";
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import Loader from "../components/Loader";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { LuMoveLeft } from "react-icons/lu";

import { Alert, Label, TextInput, Select, FileInput, Button } from "flowbite-react";

export default function EditPost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({
              ...formData,
              image: downloadUrl,
            });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
  };

  const getCurrentPost = async () => {
    try {
      const response = await axios.get(`/api/post/get-posts?postId=${postId}`);
      if (response.status === 200) {
        const { title, category, image, content } = response.data.posts[0];
        setFormData({
          ...formData,
          title,
          category,
          image,
          content,
        });
        setPublishError(null);
      }
    } catch (error) {
      setPublishError(error.message);
    }
  };

  const handleUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.put(`/api/post/update/${postId}/${currentUser._id}`, formData);
      if (response.status === 200) {
        setLoading(false);
        toast.success("The post updated successfully.");
        navigate("/dashboard?tab=posts");
      }
    } catch (error) {
      setPublishError(error.response.data.message);
    }
  };
  useEffect(() => {
    getCurrentPost();
  }, []);
  return (
    <div className="container mx-auto max-w-[1480px] pl-8 pr-8 py-10">
      <div className="mx-auto max-w-[800px] p-10 bg-white rounded dark:bg-slate-800">
        <Button
          as={Link}
          outline
          to="/dashboard?tab=posts"
          gradientMonochrome="failure"
          size="sm"
          className="inline-flex mb-5"
        >
          <LuMoveLeft />
        </Button>
        <h1 className="text-3xl font-bold mb-10">Edit post</h1>
        {publishError && (
          <Alert color="failure" className="mb-5">
            {publishError}
          </Alert>
        )}
        {imageUploadError && (
          <Alert color="failure" className="mb-5">
            {imageUploadError}
          </Alert>
        )}
        <form onSubmit={(e) => handleUpdate(e)}>
          <div className="mb-5">
            <Label htmlFor="title" value="Title" className="mb-2 block" />
            <TextInput
              id="title"
              type="text"
              defaultValue={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="mb-5">
            <Label htmlFor="category" value="Category" className="mb-2 block" />
            <Select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="javascript">JavaScript</option>
              <option value="css">CSS</option>
              <option value="devops">DevOps</option>
              <option value="design">Design</option>
              <option value="react">React</option>
            </Select>
          </div>
          <div className="mb-5">
            <Label htmlFor="file" value="Upload Image" className="mb-2 block" />
            <div className="mb-5 rounded border border-dashed border-slate-300 dark:border-slate-600 p-4">
              <div className="flex">
                <FileInput id="file" type="file" className="flex-grow" onChange={(e) => setFile(e.target.files[0])} />
                <Button
                  disabled={imageUploadProgress}
                  onClick={handleUploadImage}
                  outline
                  gradientDuoTone="pinkToOrange"
                  className="ml-4"
                >
                  {imageUploadProgress ? (
                    <div className="w-12 h-12">
                      <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                    </div>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </div>

              {formData.image && (
                <img
                  src={formData.image}
                  className="w-full h-60 object-cover mt-5 rounded border border-slate-300 dark:border-slate-600 p-1 "
                />
              )}
            </div>
          </div>
          <div className="mb-5">
            <ReactQuill
              id="content"
              theme="snow"
              className="h-60 mb-16"
              value={formData.content}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  content: value,
                })
              }
            />
          </div>
          <Button type="submit" gradientDuoTone="pinkToOrange" fullSized size="lg">
            {loading ? <Loader color="gray" className="mr-2" size="md" /> : "Publish"}
          </Button>
        </form>
      </div>
    </div>
  );
}
