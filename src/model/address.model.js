import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema(
  {
    street: {
      type: String,
      required: true,
    },
    village: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    addressHolder: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profile: {
      type: String,
      enum: ["home", "office", "other"],
      default: "home",
    },
  },
  { timestamps: true }
);

export const Address = mongoose.model("Address", AddressSchema);
