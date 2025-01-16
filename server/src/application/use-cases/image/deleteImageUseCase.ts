import { IImageRepository } from "../../interfaces/IImageRepository";

export class DeleteImageUseCase {
    constructor(private imageRepository: IImageRepository){}
    async execute(id: string) :Promise<void>{
        await this.imageRepository.deleteImage(id)
    }
}