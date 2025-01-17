import { getImages } from '@/api/imageApi'
import ImageList from '@/components/ImageList'
import ImageUpload from '@/components/ImageUpload'
import React, { useEffect, useState } from 'react'
interface Image {
  _id: string;
  title: string;
  url: string;
  order: number;
}
const Dashboard:React.FC = () => {
    const [images, setImages] = useState<Image[]>([])

    const fetchImages = async() => {
        try {
            const response = await getImages();
            console.log(response)
            setImages(response.data)
        } catch (error) {
            console.error('Error fetching images', error)
        }
    }

    useEffect(()=> {
        fetchImages()
    }, [])


  return (
    <div className='space-y-5'>
        <ImageUpload onUploadSuccess={fetchImages} existingImages={images.map((image) => ({order: image.order}))} />
        <ImageList 
        images={images}
        onDeleteSuccess={fetchImages}
        onRearrangeSuccess={(fetchImages)}
         />
    </div>
  )
}

export default Dashboard