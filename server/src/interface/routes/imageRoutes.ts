import { Router } from 'express'
import { isAuthenticated } from '../middleware/authMiddleware';
import { addImageController, changeOrderController, deleteImageController, editImageController, getImagesController } from '../controller/image/imageController';
import { upload } from '../../infrastructure/services/fileService';

const router = Router();

router.get('/', isAuthenticated, getImagesController)
router.post('/upload', isAuthenticated, upload.array('images'), addImageController)
router.delete('/:id', isAuthenticated, deleteImageController)
router.put('/:id', isAuthenticated, editImageController)
router.post('/reorder', isAuthenticated, changeOrderController)


export default router;