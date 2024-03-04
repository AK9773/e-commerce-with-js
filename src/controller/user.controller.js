import { options } from "../constant.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import jwt from "jsonwebtoken";
import transport from "../utils/nodemailer.utils.js";

const generateOtp = () => {
  const otp = 100000 + Math.floor(Math.random() * 900000);
  return otp;
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const response1 = await user.generateAccessToken();
    const accessToken = response1;

    const response2 = await user.generateRefreshToken();
    const refreshToken = response2;

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  if (!username || !fullName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  }).select("-password -refreshToken");

  if (existedUser) {
    throw new ApiError(400, "username or email is already used");
  }

  const avatarLocalFilePath = req.file?.path;

  if (!avatarLocalFilePath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  let avatar = await uploadOnCloudinary(avatarLocalFilePath);

  if (!avatar) {
    throw new ApiError(500, "Something went wrong while uploading avatar");
  }

  const user = await User.create({
    username,
    fullName,
    email,
    password,
    avatar: avatar.url,
    role: "user",
  });

  const savedUser = await User.findById(user._id).select("-password");

  if (!savedUser) {
    throw new ApiError(500, "error while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, savedUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and Password is mandatory");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(400, "username is not correct");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfull"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successful"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (user?.refreshToken !== refreshToken) {
      throw new ApiError(401, " refresh token is used or expired");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(decodedToken._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});

const updateRoleToSeller = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const existUser = await User.findById(userId);

  if (!existUser) {
    throw new ApiError(400, "Userid is not correct");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        role: "seller",
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(500, "Something went wrong while updating User Role");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Role is updated to seller"));
});

const updateRoleToAdmin = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const existUser = await User.findById(userId);

  if (!existUser) {
    throw new ApiError(400, "Userid is not correct");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        role: "admin",
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(500, "Something went wrong while updating User Role");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Role is updated to seller"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (
    oldPassword?.trim() === "" ||
    newPassword?.trim() === "" ||
    !oldPassword ||
    !newPassword
  ) {
    throw new ApiError(400, "Missing Required Feilds");
  }

  const user = await User.findById(req.user._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Old Password is not correct");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Password Updated Successfuylly"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || email.trim() === "") {
    throw new ApiError(400, "email id is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, `User is not found with ${email}`);
  }

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpiration = Date.now() + 300000;
  await user.save({ validateBeforeSave: false });

  try {
    await transport.sendMail({
      to: email,
      subject: "Password Reset",
      html: `To reset the password otp is : ${otp}`,
    });
  } catch (error) {
    throw new ApiError(500, "Something went wrong while sending email");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Otp is sent"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email, otp });
  if (!user) {
    throw new ApiError(400, "email or otp is invalid");
  }
  if (user.otpExpiration < Date.now()) {
    throw new ApiError(401, "otp is expired");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $unset: {
        otp: 1,
        otpExpiration: 1,
        refreshToken: 1,
      },
    },
    { new: true }
  ).select("-password -createdAt -updatedAt -__v -avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Password is successfully reset"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateRoleToSeller,
  updateRoleToAdmin,
  changePassword,
  forgotPassword,
  resetPassword,
};
