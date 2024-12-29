import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"

export const verifyUser= async(req, _, next)=>{
    try {
        const accessToken= req.cookies.accessToken||req.header("Authorization").replace("Bearer ","")

        if(!accessToken){
            throw new ApiError(401,"Unauthorized request")
        }

    const decodedToken= jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

    if(!decodedToken){
        throw new ApiError(204,"there was error in jwt verify")
    }

    const user= await userModel.findById(decodedToken._id).select("-password -refreshToken")

    if(!user){
        throw new ApiError(204,"Invalid access token")
    }

        req.user= user;
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request")
    }
}

export const authorize=(...roles)=>{
    return (req, _, next)=>{
        if(!roles.includes(req.user.role)){
            throw new ApiError(403, "You are not allowed to access this resource")
        }
        next()
    }
}