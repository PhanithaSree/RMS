import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reservationSchema = new Schema({

    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    firstName: {
      type: String,
      required: true
    },
    lastName : {
        type : String,
        required : true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    guests: {
      type: Number,
      required: true
    },
    dateTime: {
      type: Date,
      required: true
    },
   
  });
  
  const Reservation = model('Reservation', reservationSchema);

export default Reservation;
