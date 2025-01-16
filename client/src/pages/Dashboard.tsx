import { getImages } from '@/api/imageApi'
import ImageList from '@/components/ImageList'
import ImageUpload from '@/components/ImageUpload'
import React, { useEffect, useState } from 'react'

const Dashboard:React.FC = () => {
    const [images, setImages] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)

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
    <div>
        <ImageUpload />
        <ImageList images={images} />
    </div>
  )
}

export default Dashboard