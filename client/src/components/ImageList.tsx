import { deleteImage, reorderImages } from "@/api/imageApi";
import { config } from "@/config/config";
import React, { useEffect, useState } from "react";
import {Reorder } from "framer-motion";
import { Image } from "@/types/images";

interface Props {
  images: Image[];
  onEdit: (image: Image) => void;
  onDeleteSuccess: () => void;
  onRearrangeSuccess: () => void;
}

const ImageList: React.FC<Props> = ({
  images,
  onEdit,
  onDeleteSuccess,
}) => {
  console.log("imagelist", images);

  const handleDelete = async (id: string) => {
    try {
      await deleteImage(id);
      onDeleteSuccess();
    } catch (error) {
      console.error("Error deleting image", error);
    }
  };

  const [imageList, setImageList] = useState<Image[]>(images);


  useEffect(() => {
    setImageList(images);
  }, [images]);

  if (!images || images.length === 0) {
    return <div>Loading images...</div>;
  }

  const handleReorder = async (reorderedList: Image[]) => {
    

    const updatedList = reorderedList.map((image, index) => ({
      ...image,
      order: index + 1
    }))
    setImageList(updatedList);

    try {
      await reorderImages(updatedList)
     console.log('fkdsjf', updatedList)
      console.log('reorder saved to DB')
    } catch (error) {
      console.error('Error saving reorder to db', error)
    }
  };

  return (
    <div className="bg-blue-200 p-2 flex flex-col w-full h-screen">
      <Reorder.Group values={imageList} onReorder={handleReorder}>
        {imageList.map((image, index) => (
          <Reorder.Item value={image} key={image._id}>
            <div className="bg-slate-50 w-full mb-2 flex gap-5 min-h-16 items-center px-2">
              <img
                src={`${config.app.BASE_URL}${image.url}`}
                alt="image"
                width={50}
                className="h-max"
              />

              <p className="font-semibold">{image.title}</p>

              <div className="flex bg-slate-500 ml-auto">
                <button
                  className="bg-indigo-400 w-full hover:bg-indigo-500 px-3 py-2 text-white"
                  onClick={() => onEdit(image)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-400 w-full hover:bg-red-500 px-3 py-2 text-white"
                  onClick={() => handleDelete(image._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default ImageList;
