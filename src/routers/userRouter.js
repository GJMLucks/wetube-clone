import express from 'express';
import {
    getEdit,
    postEdit,
    logout,
    see,
    startGithubLogin,
    finishGithubLogin,
} from '../controllers/userController';
import { publicOnlyMiddleware, avatarUpload } from '../middlewares';

const userRouter = express.Router();

userRouter.get('/logout', protectMiddleware, logout);
userRouter
    .route('/edit')
    .all(protectMiddleware)
    .get(getEdit)
    .post(avatarUpload.single("avatar"), postEdit);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id([0-9a-f]{24})", see);

export default userRouter;