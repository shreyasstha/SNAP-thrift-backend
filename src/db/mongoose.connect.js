import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL;
const mongodbName = process.env.MONGODB_NAME;
const connectDB = async() =>{
    console.log("Connecting to db", mongodbUrl, mongodbName)
    try{
        const connect= await mongoose.connect(`${mongodbUrl}/${mongodbName}`)
        console.log("Database connected succesfully")
    }
    catch(error){
        console.log('Error in connecting db', error.message)
    }
}

export default connectDB;