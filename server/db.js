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
    requested: Number
})

const albumSchema = new mongoose.Schema({
    album_name : String, 
    artist: String, 
    viewed: Number, 
    label:String,
    songs: Array
})
userSchema.plugin(passportLocalMongoose)
module.exports = User = mongoose.model("User", userSchema)
module.exports = Album = mongoose.model("Album", albumSchema);