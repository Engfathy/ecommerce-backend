"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./../env.env" });
let uri;
// Function to connect with retry mechanism
const connectWithRetry = (retries = 5, delay = 5000) => {
    if (process.env.MONGODB_URI) {
        let uri = process.env.MONGODB_URI;
        console.log(1);
    }
    else {
        uri = "mongodb://localhost:27017/e-commerce";
        console.log(2);
    }
    console.log(uri);
    mongoose_1.default.connect(uri, {
        autoIndex: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4 // Use IPv4
    })
        .then(() => {
        console.log("Database connected successfully.");
    })
        .catch((error) => {
        console.error("Database connection error:", error);
        if (retries > 0) {
            console.log(`Retrying connection in ${delay / 1000} seconds...`);
            setTimeout(() => connectWithRetry(retries - 1, delay), delay);
        }
        else {
            process.exit(1); // Exit after all retries are exhausted
        }
    });
};
// Event listeners for mongoose connection events
mongoose_1.default.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process on connection error
});
mongoose_1.default.connection.on("connected", () => {
    console.log("Mongoose connected to the database.");
});
mongoose_1.default.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from the database.");
});
// Class to handle database connection
class Db {
    static ConnectDb() {
        connectWithRetry(); // Start the connection with retry logic
    }
}
exports.default = Db;
//# sourceMappingURL=dbCon.js.map