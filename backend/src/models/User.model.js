import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    },
    profileImage: {
        type: String,
        default: ""
    },
    clerkId: {
        type: true,
        required: true,
        unique: true      //reference to clerk
    }
},{timestamps: true});

const User = mongoose.model("User",user)

export default User;