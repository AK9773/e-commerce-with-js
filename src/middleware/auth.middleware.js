import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unathorized Access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access token");
  }
});

const restrictUser = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      throw new ApiError(401, "Unathorized to perform this task");
    }
    next();
  };
};

export { verifyJwt, restrictUser };
