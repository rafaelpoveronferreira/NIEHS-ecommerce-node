const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: Object, required: true, unique: true },
    desc: { type: Object, required: true },
    img: { type: Number},
    categories: { type: Array },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 1 },
    featured: {type: Boolean, default: false}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);