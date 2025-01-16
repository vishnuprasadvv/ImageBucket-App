import { Image } from "../../../domain/entities/Image";
import { IImageRepository } from "../../interfaces/IImageRepository";

export class UpdateOrderUseCase {
    constructor(private imageRepository: IImageRepository){}

    async execute(images: Image[]):Promise<void> {
        await this.imageRepository.updateOrder(images)
    }
}