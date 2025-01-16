import { config } from '@/config/config';
import React from 'react'

interface images{
  _id: string, 
  title: string;
  url: string;
  order: number
}
interface Props {
  images : images[]
}
const ImageList:React.FC<Props> = ({images}) => {
  return (
    <div>{
      images.map((image, index) => (
        <div key={index} className='bg-slate-200 mb-2 flex gap-5 min-h-16 items-center px-2'>

          <img src={`${config.app.BASE_URL}${image.url}`} alt="image" width={50} className='h-max' />
         
          <span>{image.title}</span>
        </div>
      ))
      }</div>
  )
}

export default ImageList