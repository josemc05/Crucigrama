const express = require("express")
const app = express()
const path = require("path");


app.listen(3000, ()=>{
    console.log("servidor funcionandoo!")
})

app.use(express.static(__dirname + '/'));

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname+"/index.html"))
})


const conexion = require('../src/database/db.js');
console.log(conexion)

