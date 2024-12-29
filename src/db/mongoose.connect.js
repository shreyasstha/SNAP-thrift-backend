import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL;
const mongodbName = process.env.MONGODB_NAME;
const connectDB = async() =>{
    console.log("Connecting to db", mongodbUrl, mongodbName)
    try{
         const connect= await mongoose.connect(`${mongodbUrl}/${mongodbName}`)
        //const connect= await mongoose.connect('mongodb://localhost:27017/hello')

        console.log("Database connected successfully")
    }
    catch(error){
        console.log('Error in connecting db', error.message)
    }
}

export default connectDB;