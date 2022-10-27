const express = require("express")
const app = express()
const path = require("path");
app.set('view engine', 'ejs');

const conexion = require('./src/database/db.js');


app.listen(3000, ()=>{
    console.log("servidor funcionandoo!")
})

app.use(express.static('src/'));
app.use('/', require('./src/router'));






