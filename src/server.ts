import express from "express";
import cors from "cors";
import dotEnv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import hpp from "hpp";
import ExpressMongoSanitize from "express-mongo-sanitize";
import http from "http";
import helmet from "helmet";
import Db from "./database/dbCon";
import { defaultLimiter } from "./middleware/reqLimiter";
import userRouter from "./router/userRouter";




const app: express.Application = express();
const server = http.createServer(app);

app.use(
    cors({
        origin: true, // Allow requests from all origins
        credentials: true,
    }),
);
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

//middleware to prevent nosql injection
app.use(ExpressMongoSanitize());
app.use(hpp());

//connect database
Db.ConnectDb();
app.use("/api/v1/user", defaultLimiter, userRouter);
dotEnv.config({ path: "./.env" });
const hostName: string |any= process.env.HOST_NAME ;

const port: number = Number(process.env.PORT);


if (hostName && port) {
    server.listen(port, hostName, () => {
        console.log(`server is running at http://${hostName}:${port}`);
    });
}