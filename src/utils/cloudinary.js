import {v2 as cloudinary} from "cloudinary" //imports the v2 version of Cloudinary's API 
import fs from "fs"
//fs =>file system :for reading(readFileSync), writing, deleting files(unlinkSync)

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("No local file path")
            return null
        }

        //cloudinary ma file upload garna
        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"})
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath) //local file delete after upload
        return response;   //access the details of the uploaded file.


    } catch (error) {
        console.log("there is error in uploading msg to the cloudinary",error.message)
        fs.unlinkSync(localFilePath) // remove local file if error occurs
        return null;
    }
}

export {uploadOnCloudinary}