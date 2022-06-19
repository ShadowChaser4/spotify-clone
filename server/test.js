const album = require('./db')
const app = require('./app')

app.listen(1000, ()=>{
    console.log("running ")
})




app.post("/", (req, res)=>{
    const {album_name, viewed, songs, label,artist} = req.body

    const Album = new album({
        artist : artist, 
        songs: songs, 
        album_name: album_name, 
        viewed: viewed, 
        label: label
    })
    Album.save((err, rest)=>{
        if(err) res.send(err)
        res.send(rest)
    })
})