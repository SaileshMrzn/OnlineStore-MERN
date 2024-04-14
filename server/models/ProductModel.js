import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  prod_id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export const Product = mongoose.model("Product", productSchema);
