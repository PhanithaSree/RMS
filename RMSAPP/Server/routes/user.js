import express from 'express';
import bcrypt from 'bcrypt';
import UserModel
 from '../models/user.js';
 import jwt from 'jsonwebtoken'

 const router = express.Router();


 router.post('/signup', async (req, res) => {
    const { fullname ,username, email, password ,role} = req.body;

    try {
        // Check if user with the given email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(406).json({ message: "User already exists" });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is salt value here
        // Create a new user instance
        const newUser = new UserModel({
            fullname : fullname,
            username : username,
            email : email,
            password: hashedPassword,
            role : role
        });
        // Save the new user to the database
        await newUser.save();   
        return res.json({ status : true ,message: "User registered successfully" , newUser});
    } catch (error) {
        console.error("Error occurred while signing up:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export { router as UserRouter}


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User is not registered" });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Incorrect Password" });
        }
        
        const token = jwt.sign({ username: user.username }, process.env.KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        console.log(user);
        return res.json({ status: true, token, message: "Login successful", user: user });
    } catch (error) {
        console.error("Error occurred while logging in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/update/adress/:userId" , async (req , res) => {
    const userId = req.params.userId;
    const { streetAddress, state, city, pinCode, phoneNumber } = req.body;

    try {
        const user = await UserModel.findById(userId);
  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if the user's address already exists
        const existingAddress = user.address.find(address => 
            address.streetAddress === streetAddress &&
            address.state === state &&
            address.city === city &&
            address.pinCode === pinCode &&
            address.phoneNumber === phoneNumber
        );

        if (existingAddress) {
            // If the address already exists, send a success response
            return res.status(200).json({ message: 'Address already exists', user });
        }

        // Create new address object
        const newAddress = {
            streetAddress,
            state,
            city,
            pinCode,
            phoneNumber
        };
  
        // Add new address to user's address array
        user.address.push(newAddress);
  
        // Save user with updated address
        await user.save();
  
        return res.status(200).json({ message: 'Address added successfully', user });
    } catch (error) {
        console.error('Error adding address:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});




router.get("/addresses/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by ID and populate the addresses field
        const user = await UserModel.findById(userId).populate('address');

        // If the user is found, send the addresses
        if (user) {
            res.json(user.address);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})


router.get("/logout" , (req,res) => {
    res.clearCookie('token')
    res.clearCookie('refreshToken')
    return res.json({status : true})
})