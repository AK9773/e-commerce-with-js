import { Address } from "../model/address.model.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

const isMobileNumberValid = (value) => {
  return /^\+?(91-)?[789]\d{9}$/.test(value);
};

const addAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let { street, village, city, state, pincode, mobile, profile } = req.body;

  if (!street || !city || !state || !pincode || !mobile) {
    throw new ApiError(400, "Missing required fields");
  }

  const validMobileNumber = isMobileNumberValid(mobile);

  if (!validMobileNumber) {
    throw new ApiError(400, "Please enter a valid mobile number");
  }

  if (!profile) {
    profile = "home";
  }

  const existAddress = await Address.findOne({
    addressHolder: userId,
    profile,
  });

  if (existAddress) {
    throw new ApiError(
      400,
      `Address already exist for the user and ${profile}`
    );
  }
  const address = await Address.create({
    street,
    village,
    city,
    state,
    pincode,
    mobile,
    profile,
    addressHolder: userId,
  });

  const addressData = await Address.findById(address._id).select(
    "-createdAt -updatedAt -__v"
  );

  if (!addressData) {
    throw new ApiError(500, "Something went wrong while saving address");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, addressData, "address is saved"));
});

const getAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const listOfAddress = await Address.find({ addressHolder: userId }).select(
    "-createdAt -updatedAt -__v"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, listOfAddress, "address fetched successfully"));
});

const updateAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let { street, village, city, state, pincode, mobile, profile } = req.body;

  if (!profile) {
    throw new ApiError(400, "Address proflie is missing");
  }

  const validMobileNumber = isMobileNumberValid(mobile);

  if (!validMobileNumber) {
    throw new ApiError(400, "Please enter a valid mobile number");
  }

  const address = await Address.findOne({ addressHolder: userId, profile });

  if (street) {
    address.street = street;
  }
  if (village) {
    address.village = village;
  }
  if (city) {
    address.city = city;
  }
  if (state) {
    address.state = state;
  }
  if (pincode) {
    address.pincode = pincode;
  }
  if (mobile) {
    address.mobile = mobile;
  }

  address.save({ validateBeforeSave: false });
  const updatedAddress = await Address.findOne({
    addressHolder: userId,
    profile,
  }).select("-createdAt -updatedAt -__v");
  return res
    .status(200)
    .json(new ApiResponse(200, updatedAddress, "address updtaed successfully"));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.addressId;
  if (!addressId) {
    throw new ApiError(400, `address id is required`);
  }
  const address = await Address.findById(addressId);
  if (!address) {
    throw new ApiError(400, `No saved address with the id: ${addressId}`);
  }
  await Address.findByIdAndDelete(addressId);
  const confirmDelete = await Address.findById(addressId);
  if (confirmDelete) {
    throw new ApiError(500, "Something went wrong while deleting address");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "address deleted successfully"));
});

export { addAddress, getAddress, updateAddress, deleteAddress };
