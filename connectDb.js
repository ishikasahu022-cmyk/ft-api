import mongoose from "mongoose";
import { envConfig } from "./config/envConfig.js";

const connectDb = async () => {
    mongoose.connect(envConfig.dbUrl)
        .then(() => console.log('Connected with database!'))
        .catch((error) => console.log('Unable to connect with database', error));
}

export default connectDb;