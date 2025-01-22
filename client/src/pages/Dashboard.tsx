import { getFilteredData } from '@/api/imageApi'
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

      const [searchInput, setSearchInput] = useState('')
      const [sort, setSort] = useState('default')
      const [currentPage, setCurrentPage] = useState(1)
      const [totalPages, setTotalPages] = useState(0)
      const itemsPerPage = 5;

      const fetchFilteredData = async() => {
        try {
          const response = await getFilteredData(searchInput, sort, currentPage, itemsPerPage)
          setImages(response.data.images)
          setTotalPages(response.data.totalPages || 0)
        } catch (error) {
          console.error('error fetching filtered data', error)
        }
      }

     useEffect(() => {
        fetchFilteredData()
      }, [searchInput, sort, currentPage])



  return (
    <div className='space-y-5'>
        <ImageUpload onUploadSuccess={fetchFilteredData} existingImages={images.map((image) => ({order: image.order}))} />
        <ImageList 

        images={images}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setImages={setImages}
        setSort={setSort}
        setSearchInput={setSearchInput}
        sort={sort}
         />
    </div>
  )
}

export default Dashboard