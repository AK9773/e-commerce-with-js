import mongoose, { Schema } from "mongoose";

const CartSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", CartSchema);
