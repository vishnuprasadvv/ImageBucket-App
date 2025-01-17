import path from "path";
import fs from 'fs/promises'
import { IImageRepository } from "../../interfaces/IImageRepository";

export class DeleteImageUseCase {
    constructor(private imageRepository: IImageRepository){}
    async execute(id: string) :Promise<void>{
        try {
            const imageData = await this.imageRepository.getImageById(id)
        if(!imageData){
            throw new Error('Image not found')
        }
        const imagePath = path.join(__dirname, '../../../../', imageData.url);
        await fs.unlink(imagePath)
        await this.imageRepository.deleteImage(id) 
        } catch (error) {
            throw error
        }
       
    }
} 