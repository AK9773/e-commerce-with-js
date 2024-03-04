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
      validate: {
        validator: function (v) {
          return /^\+?(91)?[789]\d{9}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid Indian mobile number!`,
      },
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
