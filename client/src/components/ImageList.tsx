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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import PaginationComponent from "./PaginationComponent";
import toast from "react-hot-toast";

interface Props {
  images: Image[],
  setImages: React.Dispatch<React.SetStateAction<Image[]>>,
  setSearchInput: React.Dispatch<React.SetStateAction<string>>,
  setSort: React.Dispatch<React.SetStateAction<string>>,
  setCurrentPage : React.Dispatch<React.SetStateAction<number>>,
  currentPage:number,
  totalPages  : number,
  sort : string
}

const ImageList: React.FC<Props> = ({setSearchInput, setSort , sort, images, setImages, currentPage, totalPages, setCurrentPage  }) => {

  const handleDelete = async (id: string) => {
    try {
      await deleteImage(id);
      setImages((prev) => prev.filter( item => item._id !== id))
    } catch (error) {
      console.error("Error deleting image", error);
    }
  };
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [title, setTitle] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [viewImage, setViewImage] = useState<Image | null>(null);

  useEffect(() => {
    setTitle(selectedImage?.title || "");
  }, [selectedImage]);

  const handleSave = async (imageId: string) => {
    if (!selectedImage) return;

    try {
      const response = await editImage(imageId, {
        title,
        imageFile: newImageFile,
      });
      setSelectedImage(null);
     
      setImages((prevList) =>
        prevList.map((image) =>
          image._id === imageId
            ? {
                ...image,
                title,
                url: newImageFile ? response.data.url : image.url,
              }
            : image
        )
      );
      setNewImageFile(null); // Reset the image file input
    } catch (error) {
      console.error("Error editing image", error);
    }
  };

  if (!images) {
    return <div>Loading images...</div>;
  }
  if (images.length === 0) {
    return (
      <div className=" h-screen text-center font-bold text-slate-500">
        NO IMAGES
      </div>
    );
  }

  const handleReorder = async (reorderedList: Image[]) => {
    if(sort !=='default') {
      toast.error('Please change to "default" sort method')
      return;
    }
    const updatedList = reorderedList.map((image, index) => ({
      ...image,
      order: index + 1,
    }));
    setImages(updatedList);

    try {
      await reorderImages(updatedList);
    } catch (error) {
      console.error("Error saving reorder to db", error);
    }
  };

  const handleSearch = async () => {

  }

  return (
    <div className="bg-slate-200 p-2 flex flex-col w-full min-h-screen rounded-md">
      <h3 className="text-center font-bold text-xl pb-4 text-indigo-500">
        Your images
      </h3>
      <div className="flex flex-col md:flex-row justify-between px-2 items-center mb-2">
      <div className="flex w-full h-10 my-2 md:pr-6">
        <input type="text" placeholder="Search images" onChange={(e) => setSearchInput(e.target.value)}  className="w-full rounded-l-md px-3"/>
        <button className="bg-indigo-400 hover:bg-indigo-500 text-white px-10 rounded-r-md " onClick={handleSearch}>Search</button>
      </div>
      <div className="flex h-8 md:h-10 items-center pl-6 place-self-end md:place-self-center gap-2">
        <label htmlFor="sort" className="font-semibold text-gray-500">Sort: </label>
        <select onChange={(e) => setSort(e.target.value)} name="sort" id="sort" className="h-full pl-2 rounded-md text-gray-600 text-sm">
          <option value="default">Default</option>
          <option value="latest">Latest to oldest</option>
          <option value="oldest">Oldest to newest</option>
        </select>
      </div>

      </div>
      <Reorder.Group values={images} onReorder={handleReorder}>
        {images.map((image) =>{
        return (
          <Reorder.Item value={image} key={image._id}>
            <Card className="bg-slate-50 hover:bg-slate-100 w-full mb-2 flex gap-5 min-h-24 items-center px-2">
          
              <img
                src={`${config.app.BASE_URL}${image.url}`}
                alt="image"
                width={68}
                className="h-max cursor-pointer"
                onClick={() => setViewImage(image)}
              />

              <p className="font-semibold">{image.title}</p>

              <div className="flex ml-auto gap-1">
                <Dialog>
                  <DialogTrigger
                    className="bg-indigo-400 w-full hover:bg-indigo-500 p-3 rounded-md aspect-square  text-white"
                    onClick={() => setSelectedImage(image)}
                  >
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

                        <Input
                          type="file"
                          className="mt-2"
                          accept="image/*"
                          onChange={(e) =>
                            setNewImageFile(e.target.files?.[0] || null)
                          }
                        />
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose>
                        <Button
                          onClick={() => handleSave(image._id)}
                          className="bg-indigo-500 hover:bg-indigo-400"
                        >
                          Save changes
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                


                <AlertDialog>
      <AlertDialogTrigger asChild 
      >
        <div className="bg-red-400 w-full hover:bg-red-500  rounded-md aspect-square  text-white p-3">
          <Trash2 size={15} />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction  onClick={() => handleDelete(image._id)} 
            className="bg-indigo-500 hover:bg-indigo-400"
            >Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>


              </div>
            </Card>
          </Reorder.Item>
        )})}
      </Reorder.Group>


      {viewImage && (
        <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewImage.title}</DialogTitle>
            </DialogHeader>
            <img
              src={`${config.app.BASE_URL}${viewImage.url}`}
              alt={viewImage.title}
              className="w-full h-auto rounded-md"
            />
            <DialogFooter>
              <DialogClose>
                <Button
                  onClick={() => setViewImage(null)}
                  className="bg-indigo-500 hover:bg-indigo-400"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

<div className="mt-auto">
  <PaginationComponent 
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
  />
</div>


    </div>
  );
};

export default ImageList;
