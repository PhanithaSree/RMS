import express from 'express';
import Reservation from '../models/reservation.js';

const router = express.Router();

// POST endpoint to create a new reservation
router.post('/reservations/:userId', async (req, res) => {
    try {
      // Destructure data from request body
      const { firstName, lastName, email, phone, guests, date, time } = req.body;
      const userId = req.params.userId;
  
      // Split the time string into hours and minutes
      const [hours, minutes] = time.split(':');
  
      // Combine date and time into a single dateTime value
      const combinedDateTime = new Date(date);
      combinedDateTime.setUTCHours(hours);
      combinedDateTime.setUTCMinutes(minutes);

      const today = new Date();
      if (combinedDateTime < today) {
        return res.status(400).json({ error: 'Reservations for past dates are not allowed' });
      }
  
      // Create a new reservation document
      const reservation = new Reservation({
        userID: userId,
        firstName,
        lastName,
        email,
        phone,
        guests,
        dateTime: combinedDateTime
      });
  
      // Save the reservation to the database
      const savedReservation = await reservation.save();
  
      // Return the saved reservation in the response
      res.status(201).json(savedReservation);
    } catch (error) {
      console.error('Error creating reservation:', error);
      res.status(500).json({ error: 'Could not create reservation' });
    }
  });


  
  export { router as reservationRouter }
