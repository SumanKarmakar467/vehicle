const mongodbUrl = process.env.MONGO_URI;

if(!mongodbUrl){
    throw new Error("Database url is not found!")
}

