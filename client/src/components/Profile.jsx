import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { app } from "../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Button, Label, TextInput, Alert } from "flowbite-react";
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { updateStart, updateSuccess, updateFailure } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

import Loader from "../components/Loader";

export default function Profile() {
  const profileImageRef = useRef();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageUploadProgess, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  const uploadProfilImage = async () => {
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError("Could not upload image (file must be less than 2 MB)");
        setImageUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          if (downloadUrl) {
            toast.success("Image uploaded successfully");
            setFormData({
              ...formData,
              profileImage: downloadUrl,
            });
          }
        });
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      uploadProfilImage();
    }
    dispatch(updateFailure());
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      toast.warning("No changes made");
      return;
    }
    try {
      dispatch(updateStart());
      const response = await axios.put(`/api/auth/user/update/${currentUser._id}`, formData);
      if (response.data.success) {
        dispatch(updateSuccess(response.data.user));
        toast.success("User profile updated sucessfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.response.data.message));
    }
  };

  return (
    <div className="p-10 w-full">
      <div className="max-w-[540px] mx-auto w-full">
        <h1 className="text-4xl text-center">Profile</h1>
        <form onSubmit={handleSubmit} className="mt-5">
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={profileImageRef}
          />
          <div
            onClick={() => profileImageRef.current.click()}
            className="relative w-40 h-40 mx-auto mb-5 rounded-full shadow-xl"
          >
            {imageUploadProgess && imageUploadProgess < 100 && (
              <CircularProgressbar
                value={imageUploadProgess}
                text={`${imageUploadProgess}%`}
                strokeWidth={4}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                  },
                  path: {
                    stroke: `rgba(255, 0, 0, ${imageUploadProgess / 100})`,
                    strokeLinecap: "butt",
                  },
                  text: {
                    fill: "#333",
                  },
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.profileImage}
              alt="user profile image"
              className={`w-40 h-40 rounded-full border-4 border-slate-300 dark:border-slate-400 object-cover ${
                imageUploadProgess && imageUploadProgess < 100 && "opacity-60"
              }`}
            />
          </div>

          {imageUploadError && (
            <Alert className="mb-5 py-2.5" color="failure">
              {imageUploadError}
            </Alert>
          )}
          {error && (
            <Alert className="mb-5 py-2.5" color="failure">
              {error}
            </Alert>
          )}
          <div className="mb-5">
            <Label htmlFor="username" value="Username" className="mb-2 block" />
            <TextInput
              id="username"
              type="text"
              defaultValue={currentUser.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-5">
            <Label htmlFor="email" value="Email" className="mb-2 block" />
            <TextInput
              id="email"
              type="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-5">
            <Label htmlFor="password" value="Password" className="mb-2 block" />
            <TextInput id="password" type="password" onChange={handleChange} />
          </div>
          <Button
            type="submit"
            gradientDuoTone="pinkToOrange"
            pill
            size="lg"
            fullSized
            className="mb-5"
          >
            {loading ? <Loader color="gray" className="mr-2" size="md" /> : "Update Profile"}
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