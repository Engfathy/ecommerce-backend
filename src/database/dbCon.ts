import mongoose from "mongoose";
import dotEnv from "dotenv";

dotEnv.config({ path: "./../env.env" });

let uri:string;
// Function to connect with retry mechanism

const connectWithRetry = (retries = 5, delay = 5000) => {
    if (process.env.MONGODB_URI) {
        let uri = process.env.MONGODB_URI;
        console.log(1);
      } else {
        uri="mongodb://localhost:27017/e-commerce"
        console.log(2);
      }
    console.log(uri);
    mongoose.connect(uri, {
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
        } else {
            process.exit(1); // Exit after all retries are exhausted
        }
    });
};

// Event listeners for mongoose connection events
mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process on connection error
});

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to the database.");
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from the database.");
});

// Class to handle database connection
class Db {
    static ConnectDb() {
        connectWithRetry(); // Start the connection with retry logic
    }
}

export default Db;