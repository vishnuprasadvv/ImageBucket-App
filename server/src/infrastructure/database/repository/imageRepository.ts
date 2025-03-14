import mongoose, { SortOrder } from "mongoose";
import { IImageRepository } from "../../../application/interfaces/IImageRepository";
import { Image } from "../../../domain/entities/Image";
import { ImageModel } from "../models/ImageModel";




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



export class ImageRepository implements IImageRepository{
    async getImagesByUser(userId: string): Promise<Image[]> {
        const data = await ImageModel.find({userId}).sort({order:1})
        return data.map((image) => ({
            ...image.toObject(), 
            _id : image._id.toString(),
            userId: image.userId.toString(),
        }))
    }

    async  getFilteredImagesByUser(userId: string, filter:Filter, sort:Record<string, SortOrder >,  pagination : Pagination  | null ):Promise<PaginatedImages> {
        const query = ImageModel.find({userId, ...filter}).sort(sort)
        
        if(pagination) {
            const skip = (pagination.page - 1) * pagination.limit;
            query.skip(skip).limit(pagination.limit)
        }

        const data = await query.lean().exec()
        const totalImages = await ImageModel.countDocuments({userId, ...filter})
        const totalPages = pagination ? Math.ceil ( totalImages / pagination.limit) : null

        const convertedData =  data.map((image) => ({
            ...image,
            _id: image._id.toString(),
            userId: image.userId.toString(),
        }))

        

        return {
           images: convertedData, 
            totalImages ,
            totalPages
        }
    }

    async addImage(image: Image): Promise<Image> {
        const highestOrderImage = await ImageModel.findOne().sort({ order: -1 }).exec();
    const newOrder = highestOrderImage ? highestOrderImage.order + 1 : 1; 

    // Create a new image with the calculated order
    const newImage = new ImageModel({ ...image, order: newOrder });
    const uploaded = await newImage.save();
        return {...uploaded, _id: uploaded._id.toString(), userId: uploaded.userId.toString()}
    }
    async getImageById(id: string): Promise<Image | null> {
        return await ImageModel.findById(id)
    }

    async deleteImage(id: string): Promise<void> {
        await ImageModel.findByIdAndDelete(id)
    }

    async editImage(id: string, updates: Partial<Image>): Promise<Image | null> {
        return await ImageModel.findByIdAndUpdate(id, updates, {new: true})
    }

    async updateOrder(images: Image[]): Promise<void> {
        const bulkOperations = images.map((image) => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(image._id) },
                update: { order: image.order}
            },
        }));
        await ImageModel.bulkWrite(bulkOperations);
    }
}