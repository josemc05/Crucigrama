const express = require('express');
const router = express.Router();
const conexion = require('../src/database/db.js');

// router.get('/index.html', (req,res)=>{
//     res.render('index.html');
// })

// module.exports = router;

router.get('/info', (req, res)=>{     
    conexion.query('SELECT * FROM crossword',(error, results)=>{
        if(error){
            throw error;
        } else {                       
            res.send(results)           
        }   
    })
})

module.exports = router;