// Import required modules
import express from 'express';
const router = express.Router();
import Dish
 from '../models/dishes.js';
// POST endpoint to add a new dish
router.post('/createdish', async (req, res) => {
  try {
    // Extract dish details from request body
    const { dishName, price, category, description , imageUrl } = req.body;
    // Create a new dish object
    const newDish = new Dish({
      dishName,
      price,
      category,
      description,
      imageUrl
    });

    // Save the new dish to the database
    await newDish.save();

    // Respond with success message
    res.status(201).json({ message: 'Dish added successfully', dish: newDish });
  } catch (error) {
    // Handle errors
    console.error('Error adding dish:', error);
    res.status(500).json({ message: 'Failed to add dish' });
  }
});


router.get('/getalldishes', async (req, res) => {
    try {
      // Fetch all dishes from the database
      const dishes = await Dish.find();
  
      // Respond with the array of dishes
      res.status(200).json({ dishes });
    } catch (error) {
      // Handle errors
      console.error('Error fetching dishes:', error);
      res.status(500).json({ message: 'Failed to fetch dishes' });
    }
  });

export { router as DishRouter}
