import { editImage } from "@/api/imageApi";
import React, { useState } from "react";
interface Image {
  _id: string;
  title: string;
  url: string;
  order: number;
}
interface Props {
  image: Image | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}
const ImageEditModal: React.FC<Props> = ({ image, onClose, onSaveSuccess }) => {
  if (!image) return null;

  const [title, setTitle] = useState(image.title || "");

  const handleSave = async () => {
    if (image) {
      try {
        await editImage(image._id, { title });
        onSaveSuccess();
        onClose();
      } catch (error) {
        console.error("Error editing image", error);
      }
    }
  };

  return (
    <div className="border border-indigo-200 p-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-indigo-600 text-lg font-bold">Edit Image Title</h3>
        <input
          className="mt-1 p-2 border w-full"
          type="text"
          placeholder="Enter image title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-between gap-5">
        <button 
        className="bg-indigo-400 w-full hover:bg-indigo-500 px-3 py-2 text-white"
        onClick={handleSave}>Save</button>
        <button 
        className="text-indigo-400 w-full px-3 py-2 border hover:bg-slate-100"
        onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditModal;
