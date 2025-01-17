import { Image } from "../../../domain/entities/Image";
import { IImageRepository } from "../../interfaces/IImageRepository";

export class UpdateOrderUseCase {
    constructor(private imageRepository: IImageRepository){}

    async execute(images: Image[]):Promise<void> {
        if(!images || images.length === 0) {
            throw new Error('No images provided for reordering')
        }
        await this.imageRepository.updateOrder(images);
    }
}