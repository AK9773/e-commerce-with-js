import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },

    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "cancelled", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
