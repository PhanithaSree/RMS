import express from 'express';
import Order from '../models/orders.js'; // Import the Order model

const router = express.Router();

// POST route to create a new order
router.post('/orders/:userId', async (req, res) => {
    try {
        // Extract userId from request parameters
        const { userId } = req.params;

        // Extract order details from the request body
        const { products, totalAmount } = req.body;

        // Create a new order document
        const newOrder = new Order({
            userId,
            products,
            totalAmount,
            status: 'completed' // Set initial status to 'pending'
        });

        // Save the new order to the database
        const savedOrder = await newOrder.save();

        // Respond with the newly created order data
        res.status(201).json(savedOrder);
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
});

// GET /api/orders/:userId
router.get('/orders/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; // Extract userId from request parameters

        // Find orders by userId
        const orders = await Order.find({ userId });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { router as OrderRouter}
