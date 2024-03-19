import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { Order } from "../model/order.model.js";
import mongoose, { Schema } from "mongoose";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { Address } from "../model/address.model.js";

const addOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { profile, amount, products } = req.body;

  if (!profile || !amount) {
    throw new ApiError(400, "Required Field is missing");
  }

  const address = await Address.findOne({
    addressHolder: userId,
    profile,
  }).select("_id addressHolder");

  const orderDetails = await Order.create({
    amount,
    buyer: userId,
    address: address._id,
    products,
  });
  const confirmOrder = await Order.findById(orderDetails._id).select(
    "-updatedAt -__v"
  );

  if (!confirmOrder) {
    throw new ApiError(500, "something went wrong while placing order");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        confirmOrder,
        "Order is placed successfully",
        "order"
      )
    );
});

const getOrderByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const listOfOrder = await Order.aggregate([
    {
      $match: {
        buyer: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "buyer",
        foreignField: "_id",
        as: "buyer",
      },
    },
    {
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "address",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "products",
        foreignField: "_id",
        as: "productsDetail",
      },
    },
    {
      $addFields: {
        buyer: {
          $first: "$buyer",
        },
        address: {
          $first: "$address",
        },
        productsDetails: "$productsDetail",
      },
    },
    {
      $project: {
        amount: 1,
        "address.street": 1,
        "address.village": 1,
        "address.city": 1,
        "address.state": 1,
        "address.pincode": 1,
        "address.mobile": 1,
        "buyer.username": 1,
        "buyer.fullName": 1,
        "buyer.email": 1,
        "productsDetails._id": 1,
        "productsDetails.name": 1,
        "productsDetails.thumbnail": 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        listOfOrder,
        "Orders detail fetched successfully",
        "orders"
      )
    );
});

const cancelOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  if (!orderId) {
    throw new ApiError(400, "order id is required");
  }
  const orderData = await Order.findById(orderId);
  if (!orderData) {
    throw new ApiError(400, "order id is not correct");
  }
  orderData.orderStatus = "cancelled";
  orderData.save({ validateBeforeSave: false });

  const updatedData = await Order.findById(orderId);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedData, "order cancelled", "order"));
});

const deliverOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  if (!orderId) {
    throw new ApiError(400, "order id is required");
  }
  const orderData = await Order.findById(orderId);
  if (!orderData) {
    throw new ApiError(400, "order id is not correct");
  }

  orderData.orderStatus = "delivered";
  orderData.save({ validateBeforeSave: false });

  const updatedData = await Order.findById(orderId);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedData, "order delivered", "order"));
});

export { addOrder, getOrderByUserId, cancelOrder, deliverOrder };
