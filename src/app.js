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


// var mysql = require('mysql');
// var conexion = mysql.createConnection({
//     host: '127.0.0.1',
//     database: 'crucigrama',
//     user: 'root',
//     password: ''
// });
// conexion.connect(function(error){
//     if(error){
//         throw error;
//     } else{
//         console.log('CONEXIÓN EXITOSA');
//     }
// });
// conexion.end();