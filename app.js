const express = require("express")
const app = express()
const path = require("path");
const router = express.Router();
app.set('view engine', 'ejs');

const conexion = require('./src/database/db.js');


app.listen(3000, ()=>{
    console.log("servidor funcionandoo!")
})

app.use(express.static('src/'));

// app.get('/info', (req, res)=>{
//     res.status(200).json({info: "texto"})
// })

app.get('/info', (req, res)=>{     
    conexion.query('SELECT * FROM crossword',(error, results)=>{
        if(error){
            throw error;
        } else {                       
            res.send(results)           
        }   
    })
})





