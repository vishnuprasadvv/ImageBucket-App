import { getFilteredData, getImages } from '@/api/imageApi'
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
    const [imageList, setImageList] = useState<Image[]>([]);

      const [searchInput, setSearchInput] = useState('')
      const [sort, setSort] = useState('latest')
      const [currentPage, setCurrentPage] = useState(1)
      const [totalPages, setTotalPages] = useState(0)
      const itemsPerPage = 5;
     useEffect(() => {
        const fetchFilteredData = async() => {
          try {
            const response = await getFilteredData(searchInput, sort, currentPage, itemsPerPage)
            console.log('filtered data', response)
            setImageList(response.data.images)
          } catch (error) {
            console.log('error fetching filtered data', error)
          }
        }
        fetchFilteredData()
      }, [searchInput, sort, currentPage])

    const fetchImages = async() => {
        try {
            const response = await getImages();
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

        images={imageList}
        onRearrangeSuccess={(fetchImages)}
         />
    </div>
  )
}

export default Dashboard