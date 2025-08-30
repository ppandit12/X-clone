import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
 clerkId:{
    type: String,
    required: true,
    unique: true
 },
 email:{
    type: String,
    required: true,
    unique: true
 },
 firstName:{
    type: String,
    required: true
 },
 lastName:{
    type: String,
    required: true
 },
 username:{
    type: String,
    required: true,
    unique: true
 },
 profilePicture:{
    type: String,
    required: true,
    default:""
 },
 bio:{
    type: String,
    maxLength: 160,
    default:""
 },
 location:{
    type: String,
    default:""
 },
 followers:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
],
following:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
],
},{timeseries: true});



const User = mongoose.model("User", userSchema);

export default User;
