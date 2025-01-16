import { uploadImages } from '@/api/imageApi'
import React, { useState } from 'react'

const ImageUpload:React.FC = () => {

    const [files, setFiles] = useState<File[]>([])
    const [titles, setTitles] = useState<string[]>([])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setFiles(Array.from(e.target.files));
            setTitles(Array.from(e.target.files).map(() => ''))
        }
    }

    const handleTitleChange= (index:number, title:string) => {
        const updatedTitles = [...titles]
        updatedTitles[index] = title;
        setTitles(updatedTitles)
    }

    const handleUpload = async() => {
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append('images', file)
            formData.append('titles', titles[index])
        });

        console.log('formdata', files, titles)

        try{
            await uploadImages(formData);
            setFiles([])
            setTitles([])
        }catch(error){
            console.error('Error uploading images', error)
        }
    }

  return (
    <div>
        <input type="file" accept='image/*' multiple onChange={handleFileChange} required />
        {files.map((file,index) => (
            <div key={index}>
                <p>{file.name}</p>
                <input type="text" 
                placeholder='Enter title'
                value={titles[index]}
                onChange={(e) => handleTitleChange(index , e.target.value)}
                />
            </div>
        ))}
        <button className='bg-indigo-400 text-white px-3 py-2' onClick={handleUpload}>Upload</button>
    </div>
  )
}

export default ImageUpload