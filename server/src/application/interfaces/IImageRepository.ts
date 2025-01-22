import { SortOrder } from "mongoose";
import { Image } from "../../domain/entities/Image";

interface Pagination {
    page: number;
    limit: number;
}

interface Filter {
    [key: string] : any
}

interface PaginatedImages {
    images: Image[];
    totalImages : number;
    totalPages: number | null;
}

export interface IImageRepository{
    addImage(image:Image):Promise<Image>
    getImageById (id:string):Promise<Image| null>
    editImage(id: string, updates: Partial<Image>) : Promise<Image | null> 
    deleteImage(id: string):Promise<void>
    getImagesByUser(userId: string):Promise<Image[]>
    updateOrder(images: Image[]): Promise<void>

    getFilteredImagesByUser(userId: string, filter:Filter, sort:Record<string, SortOrder >,  pagination : Pagination  | null ):Promise<PaginatedImages>
}