import { SortOrder } from "mongoose";
import { Image } from "../../../domain/entities/Image";
import { IImageRepository } from "../../interfaces/IImageRepository";


interface Pagination {
    page: number;
    limit: number;
}


export class GetImagesUseCase{
    constructor(private imageRepository: IImageRepository){}
    async execute(userId:string):Promise<Image[]> {
        return await this.imageRepository.getImagesByUser(userId)
    }
}

export class GetFilteredImagesUseCase{ 
    constructor(private imageRepository: IImageRepository){}
    async execute(userId: string, searchInput : string, sort: string, page: number, limit: number) {
        const normalizedQuery = searchInput.replace(/[^a-zA-Z0-9]/g, '');
        const preproccessedQuery = normalizedQuery.split('').join('[^a-zA-Z0-9]*')
        const regex = new RegExp(preproccessedQuery, 'i');

        const searchCriteria = {
            title: {$regex: regex},
        }

        const sortInput : Record<string ,SortOrder> = {}
            if(sort === 'latest') sortInput.createdAt = -1;
            else if(sort == 'oldest') sortInput.createdAt = 1;
            else if(sort === 'default') sortInput.order = 1

            const pagination : Pagination | null = page && limit ? {page, limit} : null;

            return this.imageRepository.getFilteredImagesByUser(userId, searchCriteria, sortInput, pagination)
    }
}