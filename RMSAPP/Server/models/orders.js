import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    products: [
        {
            dishId: {
                type: Schema.Types.ObjectId,
                ref: 'Dish' // Reference to the Dish model
            },
            dishName: String, // Add dishName field
            imageUrl: String, // Add imageUrl field
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

const Order = model('Order', orderSchema);

export default Order;
