import { IImageRepository } from "../../../application/interfaces/IImageRepository";
import { Image } from "../../../domain/entities/Image";
import { ImageModel } from "../models/ImageModel";

export class ImageRepository implements IImageRepository{
    async getImagesByUser(userId: string): Promise<Image[]> {
        const data = await ImageModel.find({userId}).sort('order')
        return data.map((image) => ({
            ...image.toObject(), 
            _id : image._id.toString(),
            userId: image.userId.toString(),
        }))
        
    }

    async addImage(image: Image): Promise<Image> {
        const newImage = new ImageModel(image);
        const uploaded = await newImage.save();
        return {...uploaded, _id: uploaded._id.toString(), userId: uploaded.userId.toString()}
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
                filter: { _id: image._id},
                update: { order: image.order}
            },
        }));
        await ImageModel.bulkWrite(bulkOperations);
    }
}