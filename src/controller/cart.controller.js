import { Cart } from "../model/cart.model.js";
import { Product } from "../model/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import mongoose, { Types } from "mongoose";

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let { productId, quantity } = req.body;

  if (!productId) {
    throw new ApiError(400, "product id is required");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(400, "Product id is incorrect");
  }

  if (!quantity) {
    quantity = 1;
  }

  const cartItem = await Cart.create({
    buyer: userId,
    product: productId,
    quantity,
  });

  const savedCartItem = await Cart.findById(cartItem._id);

  if (!savedCartItem) {
    throw new ApiError(500, "Error in adding cartItem");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        savedCartItem,
        "Product added successfully to cart",
        "cart"
      )
    );
});

const findByUserId = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const listOfCartItems = await Cart.aggregate([
    {
      $match: {
        buyer: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $addFields: {
        productDetails: {
          $first: "$productDetails",
        },
      },
    },
    {
      $project: {
        buyer: 1,
        quantity: 1,
        "productDetails.name": 1,
        "productDetails.owner": 1,
        "productDetails.thumbnail": 1,
        "productDetails.price": 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        listOfCartItems,
        "Cart items fetched successfully",
        "carts"
      )
    );
});

const updateProductQuantity = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { quantity, cartId } = req.body;
  if (!quantity) {
    throw new ApiError(400, "Quantity is required");
  }

  if (!cartId) {
    throw new ApiError(400, "cartId is required");
  }

  const cartItem = await Cart.findById(cartId);

  if (!cartItem) {
    throw new ApiError(400, "invalid cart Id");
  }

  const updatedCart = await Cart.findByIdAndUpdate(
    cartId,
    {
      $set: {
        quantity,
      },
    },
    { new: true }
  );

  if (!updatedCart) {
    throw new ApiError(500, "Spmething went wrong while updating quantity");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCart,
        "Successfully updated the quantity",
        "cart"
      )
    );
});

const deleteByCartId = asyncHandler(async (req, res) => {
  const cartId = req.params.cartId;

  const cartItem = await Cart.findById(cartId);

  if (!cartItem) {
    throw new ApiError(400, "invalid cart Id");
  }

  await Cart.findByIdAndDelete(cartId);
  const cartItemExist = await Cart.findById(cartId);

  if (cartItemExist) {
    throw new ApiError(
      500,
      "Something went wrond while deleting the cart item"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "cart item deleted successfully", ""));
});

export { addToCart, findByUserId, updateProductQuantity, deleteByCartId };
