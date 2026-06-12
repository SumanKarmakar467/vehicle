const mongodbUrl= process.env.MONGO_URL
import mongoose from "mongoose";

// mongoDB url is not found 
if(!mongodbUrl){
    throw new Error("db url not found")
}

// Create a cache for like when user already exist not create any connection if user new then create connetion
// Not multiple connection
let cached = global.mongooseConn
if(!cached){
    cached=global.mongooseConn={conn:null,promise:null}
}

const connectDb= async () => {
    if(cached.conn){
        return cached.conn
    }

    if(!cached.promise){
        console.log("new connection")
        cached.promise=mongoose.connect(mongodbUrl).then(c=>c.connection)
    }

    try{
        const conn=await cached.promise
        cached.conn=conn
        return conn
    }
    catch(error){
        console.log(error)
        throw(error)
    }
}

export default connectDb