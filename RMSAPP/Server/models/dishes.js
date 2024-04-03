import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const dishSchema = new Schema({
    dishName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
        type: String,
        required: true
      },
    isAddedToCart: {
      type: Boolean,
      default: false
    }
  });
  
  const Dish = model('Dish', dishSchema);

  export default Dish ;