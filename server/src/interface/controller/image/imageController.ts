import { NextFunction, Request, Response } from "express";
import { ImageRepository } from "../../../infrastructure/database/repository/imageRepository";
import { GetImagesUseCase } from "../../../application/use-cases/image/getImageUseCase";
import { ResponseHandler } from "../../../utils/ResponseHandler";
import { HttpStatusCode } from "../../../enums/HttpStatusCode";
import { Messages } from "../../../constants/Messages";
import { AddImageUseCase } from "../../../application/use-cases/image/addImageUseCase";
import { DeleteImageUseCase } from "../../../application/use-cases/image/deleteImageUseCase";
import { EditImageUseCase } from "../../../application/use-cases/image/editImageUseCase";
import { UpdateOrderUseCase } from "../../../application/use-cases/image/updateOrderUseCase";

const imageRepository = new ImageRepository();
export const getImagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("get images");
  try {
    const { id } = req.user!;
    if (!id) throw new Error("User ID is required");

    const useCase = new GetImagesUseCase(imageRepository);
    const userImages = await useCase.execute(id);
    console.log("userImages", userImages);
    ResponseHandler.sendResponse(
      res,
      HttpStatusCode.OK,
      true,
      Messages.FETCH_IMAGE_SUCCESS,
      userImages
    );
  } catch (error) {
    next(error);
  }
};

export const addImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { id } = req.user!;
    if (!id) throw new Error("User ID is required");

    const files = req.files as Express.Multer.File[]
    if(!files || files.length === 0){
      throw new Error('No files uploaded')
    }

    const {titles, } = req.body
    console.log('titels', titles)
    console.log(files)
    if(!titles || !Array.isArray(titles) || titles.length !== files.length) {
      throw new Error('Titles must be provided for each image')
    }


    
    const useCase = new AddImageUseCase(imageRepository);
    const imageDetails = files.map((file, index) => ({
      userId: id,
      title: titles[index],
      url: `/uploads/${file.filename}`,
      order: index
    }));

    const uploadedImages = await Promise.all(
      imageDetails.map((details) => useCase.execute(details))
    );
console.log(uploadedImages)
    ResponseHandler.sendResponse(
      res,
      HttpStatusCode.CREATED,
      true,
      "Image uploaded successfully",
      uploadedImages
    );
  } catch (error) {
    next(error);
  }
};


export const deleteImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;
    if (!id) throw new Error("User ID is required");
    const imageId = req.params.id
    const useCase = new DeleteImageUseCase(imageRepository);
    await useCase.execute(imageId);
    ResponseHandler.sendResponse(
      res,
      HttpStatusCode.OK,
      true,
      "Image deleted successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const changeOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {reorderedImages} = req.body;
  console.log('test')
  console.log('reorder', reorderedImages)
  try {
    
    if (!reorderedImages || !Array.isArray(reorderedImages)) {
       res.status(400).json({ message: "Invalid input data" });
  }
 
   const useCase = new UpdateOrderUseCase(imageRepository)
   await useCase.execute(reorderedImages)
    ResponseHandler.sendResponse(res, HttpStatusCode.OK, true, 'Image reordered')
  } catch (error) {
    next(error);
  }
};

export const editImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Image ID is required");

    // Extract the title and image file from the request
    const title = req.body.title;
    const imageFile = req.file; // multer adds file info to req.file

    // If title or file is missing, throw an error
    if (!title && !imageFile) {
      throw new Error("At least title or image must be provided");
    }

    // Log the received data (for debugging)
    console.log("Received data:", { title, imageFile });
    let fileUrl = undefined;
    if(imageFile){
      fileUrl= `/uploads/${imageFile.filename}`
    }

    const useCase = new EditImageUseCase(imageRepository);
    const updatedImage = await useCase.execute(id, { title, url:fileUrl });

    if (!updatedImage) {
      throw new Error("Error editing image");
    }
console.log(updatedImage)
    // Send response back to client
    ResponseHandler.sendResponse(
      res,
      HttpStatusCode.OK,
      true,
      "Image edited successfully",
      updatedImage
    );
  } catch (error) {
    next(error);
  }
};