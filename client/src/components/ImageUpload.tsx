import { uploadImages } from "@/api/imageApi";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";

interface Props {
  onUploadSuccess: () => void;
  existingImages: { order: number }[];
}
const ImageUpload: React.FC<Props> = ({ onUploadSuccess, existingImages }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [errors, setErrors] = useState<boolean[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      setTitles(selectedFiles.map(() => ""));
      setErrors(selectedFiles.map(() => false));
    }
  };

  const handleTitleChange = (index: number, title: string) => {
    const updatedTitles = [...titles];
    updatedTitles[index] = title;
    setTitles(updatedTitles);

    const updatedErrors = [...errors];
    updatedErrors[index] = title.trim() === "";
    setErrors(updatedErrors);
  };

  const handleUpload = async () => {
    // Validate titles
    const hasEmptyTitles = titles.some((title) => title.trim() === "");
    if (hasEmptyTitles) {
      const updatedErrors = titles.map((title) => title.trim() === "");
      setErrors(updatedErrors); // Highlight missing titles
      toast.error("Please provide titles for all images.");
      return;
    }

    const maxOrder = existingImages.reduce(
      (max, img) => Math.max(max, img.order),
      0
    );

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("images", file);
      formData.append("titles[]", titles[index] || "");

      // Append the new order
      const order = maxOrder + index + 1;
      formData.append("orders[]", String(order));
    });

    try {
      await uploadImages(formData);
      setFiles([]);
      setTitles([]);
      onUploadSuccess();
      toast.success("Upload successful");
    } catch (error: any) {
      toast.error(error.response.data.message || "Upload failed");
      console.error("Error uploading images", error);
    }
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    const updatedTitles = [...titles];
    updatedTitles.splice(index, 1);
    const updatedErrors = [...errors];
    updatedErrors.splice(index, 1);

    setFiles(updatedFiles);
    setTitles(updatedTitles);
    setErrors(updatedErrors);
  };

  return (
    <div className=" flex flex-col gap-2 px-4 bg-slate-200 rounded-md p-2">
      <h2 className="text-indigo-500 font-bold text-xl text-center">Upload</h2>
      <p>You can upload images from here!</p>
      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        required
      />
      {files.map((file, index) => (
        <div key={index} className="flex items-start gap-2 mt-2">
          {/* Image Preview */}
          <div className="w-16 h-16 flex-shrink-0 relative">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-full h-full object-cover rounded-md border"
            />

            <button
              type="button"
              onClick={() => handleDeleteFile(index)}
              className="absolute top-0 right-0 p-1 bg-red-500 hover:bg-red-700 rounded-full text-white"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* File Info and Title Input */}
          <div className="flex flex-col flex-grow">
            <p className="truncate">{file.name}</p>
            <Input
              type="text"
              required
              placeholder="Enter title"
              value={titles[index] || ""}
              onChange={(e) => handleTitleChange(index, e.target.value)}
            />
            {errors[index] && (
              <p className="text-red-500 text-sm">Title is required</p>
            )}
          </div>
        </div>
      ))}
      <Button
        className="bg-indigo-400 w-full sm:w-max sm:place-self-end hover:bg-indigo-500 text-white px-3 py-2"
        onClick={handleUpload}
      >
        Upload
      </Button>
    </div>
  );
};

export default ImageUpload;
