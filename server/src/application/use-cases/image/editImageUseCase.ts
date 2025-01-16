import { Image } from "../../../domain/entities/Image";
import { IImageRepository } from "../../interfaces/IImageRepository";

export class EditImageUseCase {
    constructor(private imageRepository: IImageRepository){}

    async execute(id: string, updates: Partial<Image>):Promise<Image | null> {
        return await this.imageRepository.editImage(id, updates)
    }
}