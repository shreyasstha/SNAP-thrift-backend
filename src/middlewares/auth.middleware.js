import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { generateAccessAndRefreshTokens } from "../controllers/auth.controller.js";
import { response } from "express";

export const verifyUser = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }
    try {
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      console.log("dt: ", decodedToken);
      if (!decodedToken) {
        throw new ApiError(204, "there was error in jwt verify");
      }

      const user = await User.findById(decodedToken.data.id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(204, "Invalid access token");
      }

      req.user = user; //Attaches the authenticated user object to the request for downstream access
      next();
    } catch (error) {
      if (
        error.name === "TokenExpiredError" &&
        error.message === "jwt expired"
      ) {
        // Handle expired access token - try to refresh using refresh token
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
          throw new ApiError(
            401,
            "No refresh token provided. Please log in again."
          );
        }
        console.log("refresh ", refreshToken);

        // Validate the refresh token and generate new tokens
        console.log("Executing query for refreshToken:", refreshToken.trim());

        const user = await User.findOne({ refreshToken: refreshToken.trim() });
        console.log("THis is user", user);

        if (!user) {
          throw new ApiError(
            401,
            "Invalid refresh token. Please log in again."
          );
        }

        // If the refresh token is valid, generate new access and refresh tokens
        const { accessToken, refreshToken: newRefreshToken } =
          await generateAccessAndRefreshTokens(user._id);

        // Set new tokens in cookies and continue
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
        });
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
        });

        req.user = { id: user._id, email: user.email }; // Attach the user object to the request
        next(); // Continue to the next middleware or route handler
      }
    }
  } catch (error) {
    console.error("Error in verifyUser middleware:", error.message);
    throw new ApiError(404, "Error", error.message);
    // next(error);
  }
};

// export const authorize = (...role) => {
//   return (req, _, next) => {
//     if (!role.includes(req.user.role)) {
//       throw new ApiError(403, "You are not allowed to access this resource");
//     }
//     next();
//   };
// };

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "You are not authorized to access this resource");
    }
    next();
  };
};
