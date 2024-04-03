import express from 'express';
const router = express.Router();
import Cart from '../models/cart.js';
import Dish from '../models/dishes.js';

router.put('/cart/:userId/updateQuantity/:dishId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const dishId = req.params.dishId;
        const quantity = req.body.quantity;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            // If the cart doesn't exist, create a new one with the provided product and quantity
            cart = new Cart({ userId, items: [{ dishId, quantity: 1 }] });
        } else {
            // Check if the product is already in the cart
            const itemIndex = cart.items.findIndex(item => item.dishId == dishId);
            console.log(itemIndex)
            if (itemIndex !== -1) {
                // If found, update the quantity by adding the provided quantity
                cart.items[itemIndex].quantity = quantity;
            } else {
                // If not found, add the product with the provided quantity
                console.log("in else block")
                cart.items.push({ dishId, quantity: 1 });
            }
        }

        // Save the updated cart
        await cart.save();

        const allQuantitiesZero = cart.items.every(item => item.quantity === 0);
        if (allQuantitiesZero) {
            cart.items = [];
            await cart.save();
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





router.get('/cart/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await Cart.findOne({ userId }).populate('items.dishId');
        if (!cart) {
            // If cart is not found, return an empty array
            return res.status(200).json([]);
        }
        res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST endpoint to create an empty cart for a user
router.post('/cart/createEmptyCart/:userId', async (req, res) => {
    console.log("API IS HITTING")
    try {
        const userId = req.params.userId;
        
        // Check if the cart already exists for the user
        const existingCart = await Cart.findOne({ userId });
        if (existingCart) {
            // If the cart exists, fetch and return the cart details
            return res.status(200).json({ message: "Cart already exists for this user", cart: existingCart });
        }

        // Create a new cart for the user
        const newCart = new Cart({ userId, items: [] });
        await newCart.save();

        res.status(201).json({ message: "Empty cart created successfully", cart: newCart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Endpoint to fetch dish details by user ID
router.get('/dishes/details/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Fetch cart data for the specified user
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found for the user' });
      }
  
      // Extract dishIds and quantities from the cart items
      const dishIds = cart.items.map(item => item.dishId);
      const quantities = cart.items.reduce((acc, item) => {
        acc[item.dishId] = item.quantity;
        return acc;
      }, {});
  
      // Fetch dish details for the retrieved dishIds
      const dishDetails = await Dish.find({ _id: { $in: dishIds } });
  
      // Combine dish details with quantities
      const dishDetailsWithQuantities = dishDetails.map(dish => ({
        dishId: dish._id,
        dishName: dish.dishName,
        imageUrl: dish.imageUrl, // Replace description with imageUrl
        price: dish.price,
        quantity: quantities[dish._id] || 0
      }));
  
      res.json({ dishesInCart: dishDetailsWithQuantities });
    } catch (error) {
      console.error('Error fetching dish details:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });



  router.delete('/cart/:userId/remove/:dishId', async (req, res) => {
    // Extract userId and dishId from request parameters
    const userId = req.params.userId;
    const dishId = req.params.dishId;
  
    try {
        // Find the cart for the user
        let cart = await Cart.findOne({ userId });
  
        // If cart not found, return 404
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for the user' });
        }
  
        // Filter out the dish from the cart items array
        cart.items = cart.items.filter(item => item.dishId.toString() !== dishId);
  
        // Save the updated cart
        await cart.save();
  
        // Return success message
        return res.status(200).json({ message: 'Dish removed from cart successfully' });
    } catch (error) {
        // Handle any errors and return internal server error
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//   / Route to clear the entire cart for a user
router.delete('/cart/:userId/clear', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the cart for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for the user' });
    }

    // Clear the cart
    cart.items = [];

    // Save the updated cart
    await cart.save();

    return res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


export { router as CartRouter}
