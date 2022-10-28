const url = 'http://localhost:3000/info'
let modulo = 0


function getRandomInt(max) {//Funcion que genera numero aleatorio entre 1 y 2
	let alternativa=0
	alternativa=Math.floor(Math.random() * max);
	while(alternativa==0){
		alternativa=Math.floor(Math.random() * max);
	}
  return alternativa}



function setModulo1(){
modulo=1
b.then(value => {//Aqui se pueden traer los valores bien para manejarlos y colocar logica dentro
	crucigramas(value, modulo, getRandomInt(3))
	console.log('Esto se imprime dentro del valor del promise')
  }).catch(err => {
	console.log(err);
  });
}

function setModulo2(){
	modulo=2
	console.log(modulo)
	b.then(value => {//Aqui se pueden traer los valores bien para manejarlos y colocar logica dentro
		//console.log(value[1].pregunta);
		crucigramas(value)
		console.log('Esto se imprime dentro del valor del promise')
	  }).catch(err => {
		console.log(err);
	  });
	}

async function getEjemplo(){ //Funcion asincrona que trae la consulta de la bd
	const res = await fetch(url,{
		method: 'GET'
	})
	const data = await res.json()
return data}

const b = Promise.resolve(getEjemplo()) //variable que resuelve y almacena la funcion




/////////////////FUNCION DE CREA EL CRUCIGRAMA/////////////////


function crucigramas(pruebaDatos, modulos, alternativas){	
(function($) {
	$(function() {
		// provide crossword entries in an array of objects like the following example
		// Position refers to the numerical order of an entry. Each position can have 
		// two entries: an across entry and a down entry.
		var puzzleData=[] //declaramos arreglo con los datos de las preguntas
		let contador=0 //establecemos contador
		pruebaDatos.forEach(pruebaDato => { //llenamos el arreglo con la informacion de la base de datos
			if(pruebaDatos[contador].modulo==modulos  && pruebaDatos[contador].alt==alternativas){
				puzzleData.push({
					clue: pruebaDatos[contador].pregunta,
						answer: pruebaDatos[contador].respuesta,
						position: pruebaDatos[contador].position,
						orientation: "down",
						startx: pruebaDatos[contador].posX,
						starty: pruebaDatos[contador].posY
				})
				contador+=1
			}else{
			}	
		});
	
		$('#puzzle-wrapper').crossword(puzzleData);
		
	})
	
})(jQuery)
}

// crucigramas()



