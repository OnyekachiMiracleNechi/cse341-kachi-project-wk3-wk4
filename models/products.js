const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    description: String,
    price: { type: Number, required: [true, 'Price is required'] },
    stock: { type: Number, default: 0 },
    category: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema, 'products');
