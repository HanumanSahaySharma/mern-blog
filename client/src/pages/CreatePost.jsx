import React, { useState } from "react";
import { app } from "../firebase";
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Alert, Label, TextInput, Select, FileInput, Button } from "flowbite-react";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
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
              imageUrl: downloadUrl,
            });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  return (
    <div className="container mx-auto max-w-[1480px] pl-8 pr-8 py-10">
      <div className="mx-auto max-w-[800px] p-10 bg-white rounded dark:bg-slate-800">
        <h1 className="text-3xl font-bold mb-10">Create post</h1>
        {imageUploadError && (
          <Alert color="failure" className="mb-5">
            {imageUploadError}
          </Alert>
        )}
        <form>
          <div className="mb-5">
            <Label htmlFor="title" value="Title" className="mb-2 block" />
            <TextInput id="title" type="text" />
          </div>
          <div className="mb-5">
            <Label htmlFor="category" value="Category" className="mb-2 block" />
            <Select id="category" defaultValue="javascript">
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

              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  className="w-full h-60 object-cover mt-5 rounded border border-slate-300 dark:border-slate-600 p-1 "
                />
              )}
            </div>
          </div>
          <div className="mb-5">
            <ReactQuill theme="snow" className="h-60 mb-16" required />
          </div>
          <Button gradientDuoTone="pinkToOrange" fullSized size="lg">
            Publish
          </Button>
        </form>
      </div>
    </div>
  );
}
