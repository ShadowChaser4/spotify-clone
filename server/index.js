const app = require('./app'); 
const User = require('./db'); 
const path = require("path")
const bcrypt = require("bcrypt");
const passport = require('passport');
const LocalStrategy = require("passport-local")
const Album = require('./db');
const fs = require('fs')


///////////////passport config////////////
passport.use(new LocalStrategy((function verify(username, passowrd_from_user ,cb){
     User.findOne({username:username}, (err, result)=>{
        if(err){
            console.log("in error of database")
            return cb(err)}
        const {password} = result
        if(!result){ console.log("no results found")
            return cb(null, false, {message:"Email doesn't exist"})}
        bcrypt.compare(passowrd_from_user, password,(err, result)=>{
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
//////////////passport config//////////////////


//////////routes////////////////////

    app.get("/", (req, res)=>{
    
        const thau = path.resolve("../Public/LandinPage/Index.html")
        res.sendFile(thau)
    })
    
    
    app.get("/login", (req,res)=>{
        if (req.isAuthenticated())
        {
            res.redirect('/spotify')
        }
        else
        {
            const thau  = path.resolve("../Public/LoginPage/login.html")
            res.sendFile(thau)
        }
        
    })
    
    app.post("/login", passport.authenticate('local', {
        successRedirect: '/spotify',
        failureRedirect: '/login'
      }))
    
    
    app.get("/logout", (req, res)=>{
         req.logout((err)=>{
                if(err)
                {
                    console.log(err)
                }
         });
         res.redirect('/')
    })
    
    
    app.get("/spotify", (req, res)=>{
        if(req.isAuthenticated()){
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

app.get('/music/:musicname', (req, res)=>{
      const music = path.resolve('../music/test/Jenny.mp3'); 
      const stat = fs.statSync(music); 
      range = req.headers.range
      var readStream ; 
      if(range !== undefined)
      {

        //////////nothing complex checking headers for byte split//////////////
        var parts = range.replace('/bytes=/', "").split('-'); 
        var partial_start = parts[0]; 
        var partial_end = parts[1]; 

        ///////////////////sending error if bytes aren't in numbers/////////////
        if(((isNaN(partial_start)) && (partial_start.length) >1)||(isNaN(partial_end)&& partial_end.length >1))
        {
            return res.sendStatus(500); 
        }

        ////////////setting start and end of file////////////////////
        var start = parseInt(partial_start, 10); 
        var end = partial_end?parseInt(partial_end, 10): stat.size -1; 


        var content_length = (end - start) + 1; 
        res.status(206).header({
            'Content-Type': "audio/mpeg",
            'Content-Length': content_length,
            'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
        }); 
        ////////////creating readstream/////////////////////////////
        readStream = fs.createReadStream(music, {start: start, end: end}); 
      }
      else{
        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        })
        readStream = fs.createReadStream(music); 
      }
      //////////piping the readstream to res/////////////////////
      readStream.pipe (res)

})
    
app.get("/albums/type/:albumtype", (req, res)=>{
       const {albumtype}= req.params
       Album.find({label: albumtype}, (err, ack)=>{
        if(err)
        {
            console.log(err)
            res.status(500)
        }
        else {
            res.send(ack)
        }
       })
})

app.get("/albums/:albumid", (req, res)=>{
    const {albumid} = req.params; 
    try {
        Album.find({album_name: albumid}, (err, ack)=>{
            if (err)
            {
                console.log(er)
                res.status(500)
            }
            else{
                console.log(ack)
                const {album_name, artist, viewed, label, songs} = ack[0]
                res.send({name: album_name, artist: artist, viewed: viewed, label: label, songs: songs}); 
            }
        })
    
    }
    catch(e)
    {
        res.status(500)
        res.send(e.message)
    }
})
    


    
///////////routes//////////////////

app.listen(2000, ()=>{
    console.log("app is listening in port 2000")
})


