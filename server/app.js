const express = require('express'); 
const app = express();
const bodyparser = require('body-parser'); 
const passport = require('passport');
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session);
const cors = require("cors")


app.use(cors())

app.use(bodyparser.urlencoded({extended:true})); 
app.use(express.static("../Public"))
//set up session
const store = new  MongoStore({
    url :'mongodb://localhost:27017/Spotify', 
    ttl: 12*24*60*60 
 })
app.use(
    session({
        store:store ,
        secret:"This is my kind little secret",
        resave:false, 
        saveUninitialized:true,
        cookie:{
            maxAge:(12*21*60*60)
        }
    })
)
//setup passport
app.use(passport.initialize()); 
app.use(passport.session())
app.use(passport.authenticate('session'))


module.exports = app;
