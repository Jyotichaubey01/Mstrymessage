
import { log } from "console";
import { promises } from "dns";
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnection(): Promise<void> {
    if (connection.isConnected) {
        console.log("already connected to database");
        return
        
    }
    try {
       const db = await mongoose.connect(promises.env.MONGODB_URI || '',{})
        
       connection.isConnected = db.connections[0].readyState
       console.log("Db connected successfuly");
       
    } catch (error) {
        console.log("database connection failed ",error);
        
        process.exit(1)
    }
}

export default dbConnect;