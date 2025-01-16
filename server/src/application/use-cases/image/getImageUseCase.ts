import { Image } from "../../../domain/entities/Image";
import { IImageRepository } from "../../interfaces/IImageRepository";

export class GetImagesUseCase{
    constructor(private imageRepository: IImageRepository){}
    async execute(userId:string):Promise<Image[]> {
        return await this.imageRepository.getImagesByUser(userId)
    }
}