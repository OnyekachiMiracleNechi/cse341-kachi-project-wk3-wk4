const Order = require('../models/orders');

// GET all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products.product');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single order
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('products.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
};

// CREATE a new order
const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    const populatedOrder = await order.populate('user').populate('products.product');
    res.status(201).json(populatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE an order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user').populate('products.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE an order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAllOrders, getSingleOrder, createOrder, updateOrder, deleteOrder };
