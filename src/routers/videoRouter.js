import express from 'express';
import { 
    getEdit,
    postEdit,
    deleteVideo, 
    getUpload,
    postUpload
} from '../controllers/videoController';
import { protectMiddleware, videoUpload } from '../middlewares';

const videoRouter = express.Router();

videoRouter.get('/:id([0-9a-f]{24})', watch);
videoRouter
    .route('/:id([0-9a-f]{24})/edit')
    .all(protectMiddleware)
    .get(getEdit)
    .post(postEdit);
videoRouter
    .route('/:id([0-9a-f]{24})/delete')
    .all(protectMiddleware)
    .get(deleteVideo);
videoRouter
    .route('/upload')
    .all(protectMiddleware)
    .get(getUpload)
    .post(videoUpload.single("video"), postUpload);

export default videoRouter;