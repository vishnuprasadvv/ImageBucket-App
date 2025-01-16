import { Image } from "../../../domain/entities/Image";
import { IImageRepository } from "../../interfaces/IImageRepository";

export class AddImageUseCase {
    constructor(private imageRepository: IImageRepository){}

    async execute(image: Image):Promise<Image>{
        return await this.imageRepository.addImage(image)
    }
}