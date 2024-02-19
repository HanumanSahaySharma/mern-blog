import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Label, TextInput, Select, FileInput, Button } from "flowbite-react";

export default function CreatePost() {
  return (
    <div className="container mx-auto max-w-[1480px] pl-8 pr-8 py-10">
      <div className="mx-auto max-w-[800px] p-10 bg-white rounded dark:bg-slate-800">
        <h1 className="text-3xl font-bold mb-10">Create post</h1>
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
            <div className="flex rounded border border-dashed border-slate-300 dark:border-slate-700 p-4">
              <FileInput id="file" type="file" className="flex-grow" />
              <Button outline gradientDuoTone="pinkToOrange" className="ml-4">
                Upload
              </Button>
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
