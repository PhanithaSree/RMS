import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { UserRouter } from './routes/user.js'
import { DishRouter } from "./routes/dishes.js";
import { CartRouter } from "./routes/cart.js";
import {OrderRouter} from "./routes/order.js"
import dotenv from 'dotenv'
import { reservationRouter } from "./routes/reservation.js";

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors({
    origin : ["http://localhost:5173"],
    credentials : true
}))
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/Restaurant');

app.use('/auth', UserRouter);
app.use('/dish' , DishRouter);
app.use('/' ,CartRouter);
app.use('/' , OrderRouter);
app.use('/',reservationRouter);

app.listen(3001 , () => {
    console.log("Server is Running!!");
});
