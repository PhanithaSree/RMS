import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AddressSchema = new Schema({
    streetAddress: String,
    state: String,
    city: String,
    pinCode: String,
    phoneNumber: String
});

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "visitor"
    },
    address: [AddressSchema] // Array of addresses
});

const UserModel = model("users", UserSchema);

export default UserModel;
