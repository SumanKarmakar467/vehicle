const mongodbUrl = process.env.MONGO_URI;

if(!mongodbUrl){
    throw new Error("Database url is not found!")
}

let cached = global.mongooseConn
if(!cached){
    cached = global.mongooseConn={conn:null, promise:null}
}

const connectDb = async(){
    if(cached.conn){
        return cached.conn
    }

    if(!cached.promise){
        cached.promise=mongoose.connect(mongodbUrl).then(c=>c.connection)
    }
    try{
        const conn=await cached.promise
        return conn
    }catch(error){
        console.log(error)
    }
}
export default connectDb