const mongoose = require("mongoose"); 
const passportLocalMongoose = require('passport-local-mongoose')

mongoose.connect('mongodb://localhost:27017/Spotify'); 


const userSchema = new mongoose.Schema({
    username: String, 
    password: String
})


const FileSchema = new mongoose.Schema({
    name: String, 
    location: String, 
    album: String, 
    artist: String, 
    requested: Number
})

userSchema.plugin(passportLocalMongoose)
module.exports = User = mongoose.model("User", userSchema)