import { Reorder, useDragControls } from 'framer-motion'
import React from 'react'
import { Card } from './ui/card'
import { GripVertical, PencilIcon, Trash2 } from 'lucide-react'
import { Image } from '@/types/images'
import { config } from '@/config/config'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'

interface ImageItemProps {
    image : Image;
    title: string;
    setViewImage : React.Dispatch<React.SetStateAction<Image | null>>;
    setSelectedImage : React.Dispatch<React.SetStateAction<Image | null>>;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setNewImageFile: React.Dispatch<React.SetStateAction<File | null>>;
    handleSave: (id:string)=> void;
    handleDelete : (id: string) => void;
}
const ImageItem:React.FC<ImageItemProps> = ({image,title, setSelectedImage, setViewImage, setTitle, setNewImageFile, handleDelete, handleSave}) => {
    const dragControls =  useDragControls()
  return (
    <Reorder.Item value={image} key={image._id} dragListener={false} dragControls={dragControls}>
    <Card className="bg-slate-50 hover:bg-slate-100 w-full mb-2 flex gap-5 min-h-24 items-center px-2">
  
{/* Drag Handle */}
<div
    className="cursor-grab p-2"
    onPointerDown={(e) => dragControls.start(e)}
  >
    <GripVertical size={20} className="text-gray-400" />

  </div>

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
  )
}

export default ImageItem