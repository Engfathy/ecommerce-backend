"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const hpp_1 = __importDefault(require("hpp"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const dbCon_1 = __importDefault(require("./database/dbCon"));
const reqLimiter_1 = require("./middleware/reqLimiter");
const userRouter_1 = __importDefault(require("./router/userRouter"));
const adminProductRouter_1 = __importDefault(require("./router/adminProductRouter"));
const paymentRouter_1 = __importDefault(require("./router/paymentRouter"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: "100kb" }));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
//middleware to prevent nosql injection
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, hpp_1.default)());
//connect database
dbCon_1.default.ConnectDb();
app.use("/api/v1/user", reqLimiter_1.defaultLimiter, userRouter_1.default);
app.use("/api/v1/payments", reqLimiter_1.defaultLimiter, paymentRouter_1.default);
app.use("/api/v1/admin/product", adminProductRouter_1.default);
app.use("/api/v1/admin/product", adminProductRouter_1.default);
dotenv_1.default.config({ path: "./.env" });
const hostName = process.env.HOST_NAME;
const port = Number(process.env.PORT);
// if (cluster.isPrimary) {
//     const numCPUs = os.cpus().length;
//     for (let i = 0; i < numCPUs; i++) {
//       cluster.fork();
//     }
//     cluster.on('exit', (worker, code, signal) => {
//       console.log(`Worker ${worker.process.pid} died. Restarting...`);
//       cluster.fork();
//     });} else{
if (hostName && port) {
    server.listen(port, hostName, () => {
        console.log(`server is running at http://${hostName}:${port}`);
    });
}
// }
//# sourceMappingURL=server.js.map