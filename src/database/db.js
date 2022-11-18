const mysql = require('mysql');
const conexion = mysql.createConnection({
  host     : 'localhost',
  user     : 'admin',
  password : '1234567',
  database : 'crucigrama',
  port: 3307
});
conexion.connect((error)=>{
  if (error) {
    console.error('El error de conexión es: ' + error);
    return;
  }
  console.log('¡Conectado a la Base de Datos!');
});



module.exports=conexion