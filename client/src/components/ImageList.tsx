import { deleteImage, editImage, reorderImages } from "@/api/imageApi";
import { config } from "@/config/config";
import React, { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import { Image } from "@/types/images";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { PencilIcon, Trash2 } from "lucide-react";

interface Props {
  images: Image[];
  onDeleteSuccess: () => void;
  onRearrangeSuccess: () => void;
}

const ImageList: React.FC<Props> = ({ images, onDeleteSuccess }) => {
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
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [title, setTitle] = useState("");
  useEffect(() => {
    setImageList(images);
  }, [images]);

  useEffect(() => {
    setTitle(selectedImage?.title || "");
  }, [selectedImage]);

  const handleSave = async (imageId: string) => {
    if (!selectedImage) return;
    try {
      await editImage(imageId, { title });
      setSelectedImage(null);
      setImageList((prevList) =>
        prevList.map((image) =>
          image._id === imageId ? { ...image, title } : image
        )
      );
    } catch (error) {
      console.error("Error editing image", error);
    }
  };



  if (!images) {
    return <div>Loading images...</div>;
  }
  if(images.length === 0){
    return <div className=" h-screen text-center font-bold text-slate-500">NO IMAGES</div>
  }

  const handleReorder = async (reorderedList: Image[]) => {
    const updatedList = reorderedList.map((image, index) => ({
      ...image,
      order: index + 1,
    }));
    setImageList(updatedList);

    try {
      await reorderImages(updatedList);
      console.log("fkdsjf", updatedList);
      console.log("reorder saved to DB");
    } catch (error) {
      console.error("Error saving reorder to db", error);
    }
  };

  return (
    <div className="bg-slate-200 p-2 flex flex-col w-full h-screen rounded-md">
      <h3 className="text-center font-bold text-xl pb-4 text-indigo-500">Your images</h3>
      <Reorder.Group values={imageList} onReorder={handleReorder}>
        {imageList.map((image) => (
          <Reorder.Item value={image} key={image._id}>
            <Card className="bg-slate-50 hover:bg-slate-100 w-full mb-2 flex gap-5 min-h-24 items-center px-2">
              <img
                src={`${config.app.BASE_URL}${image.url}`}
                alt="image"
                width={68}
                className="h-max"
              />

              <p className="font-semibold">{image.title}</p>

              <div className="flex ml-auto gap-1">
                <Dialog>
                  <DialogTrigger className="bg-indigo-400 w-full hover:bg-indigo-500 p-3 rounded-md aspect-square  text-white" 
                  onClick={() => setSelectedImage(image)}>
                    <PencilIcon size={15} />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit image title</DialogTitle>
                      <DialogDescription>
                        <Input
                          className="mt-1 p-2 border w-full"
                          type="text"
                          placeholder="Enter image title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose>
                      <Button onClick={() => handleSave(image._id)} className="bg-indigo-500 hover:bg-indigo-400">
                        Save changes
                      </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button size='icon'
                  className="bg-red-400 w-full hover:bg-red-500 aspect-square text-white"
                  onClick={() => handleDelete(image._id)}
                >
                  <Trash2 size={15}/>
                </Button>
              </div>
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default ImageList;
