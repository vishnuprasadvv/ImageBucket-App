import { Image } from "../../domain/entities/Image";

export interface IImageRepository{
    addImage(image:Image):Promise<Image>
    editImage(id: string, updates: Partial<Image>) : Promise<Image | null> 
    deleteImage(id: string):Promise<void>
    getImagesByUser(userId: string):Promise<Image[]>
    updateOrder(images: Image[]): Promise<void>
}