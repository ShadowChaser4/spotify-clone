const app = require('./app'); 
const User = require('./db'); 
const path = require("path")
const bcrypt = require("bcrypt");
const passport = require('passport');
const LocalStrategy = require("passport-local")



///////////////passport config////////////
passport.use(new LocalStrategy((function verify(username, passowrd_from_user ,cb){
     User.findOne({username:username}, (err, result)=>{
        if(err){
            console.log("in error of database")
            return cb(err)}
        const {password} = result
        console.log(password)
        if(!result){ console.log("no results found")
            return cb(null, false, {message:"Email doesn't exist"})}
        bcrypt.compare(passowrd_from_user, password,(err, result)=>{
            console.log("comparing passwords")
            if(err){return cb(err)}
            if(result) {cb(null, username)}
            if(!result) {cb(null, false, {message:"Password doesn't match"})}
        })
    })  }
 )
)
)

passport.serializeUser((user, cb)=>{
    process.nextTick(function(){
        cb(null, {id:user.id, username: user.username})
    })
})



passport.deserializeUser((user, cb)=>{
    process.nextTick(()=>{
        return cb(null, user)
    })
})


try{

    app.get("/", (req, res)=>{
    
        const thau = path.resolve("../Public/LandinPage/Index.html")
        res.sendFile(thau)
    })
    
    
    app.get("/login", (req,res)=>{
        const thau  = path.resolve("../Public/LoginPage/login.html")
        res.sendFile(thau)
    })
    
    app.post("/login", passport.authenticate('local', {
        successRedirect: '/spotify',
        failureRedirect: '/login'
      }))
    
    
    app.get("/logout", (req, res)=>{
         req.logout();
         res.redirect('/')
    })
    
    
    app.get("/spotify", (req, res)=>{
        if(req.isAuthenticated()){
            console.log("authenticated"); 
            res.send("Authencitaed")
        }
        else{
            res.redirect('/login')
        }
    })
    
    app.get("/register", (req, res)=>{
       const thau  = path.resolve("../Public/Register/register.html")
        res.sendFile(thau)
    
    })
    
}
catch(e)
{
    console.log(e)
}
app.listen(3000, ()=>{
    console.log("app is listening in port 3000")
})


app.post("/register", async(req, res)=>{
    const {username, password} = req.body
    console.log(req.body)
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(password, salt, (err, hash)=>{
            const user = new User({
                username:username, 
                password:hash
            })
            user.save((err, ack)=>{
                if(err)
                {
                    console.log(err.message)
                }
                else{
                    console.log(ack)
                    res.redirect('/login')
                }
            })
        })
    })
       
   
})
