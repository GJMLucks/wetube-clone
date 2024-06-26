import express from "express";
import morgan from "morgan";
import session from "express-session";
// for saving session data. 
// default storage is not for actual implementation, 
// so must set session storage to not default one.
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware, pageNotFoundHandler } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.COOKIE_SECRET_KEY,
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL
        }),
        resave: true,
        saveUninitialized: true,
    })
);

app.use(localsMiddleware);
app.use("/uploads", express.static(uploads));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use(pageNotFoundHandler);



export default app;