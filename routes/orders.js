const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const authenticate = require('../middlewares/auth'); // JWT middleware

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Operations for orders
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders (public)
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get('/', ordersController.getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get a single order by ID (public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id', ordersController.getSingleOrder);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order (protected)
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: body
 *         name: order
 *         description: Order object to create
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: string
 *             products:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product:
 *                     type: string
 *                   quantity:
 *                     type: number
 *             total:
 *               type: number
 *             status:
 *               type: string
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticate, ordersController.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     tags: [Orders]
 *     summary: Update an order (protected)
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *       - in: body
 *         name: order
 *         description: Order object to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: string
 *             products:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product:
 *                     type: string
 *                   quantity:
 *                     type: number
 *             total:
 *               type: number
 *             status:
 *               type: string
 *     responses:
 *       200:
 *         description: Order updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 */
router.put('/:id', authenticate, ordersController.updateOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete an order (protected)
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Order deleted
 *       404:
 *         description: Order not found
 */
router.delete('/:id', authenticate, ordersController.deleteOrder);

module.exports = router;
