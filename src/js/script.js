const url = 'http://localhost:3000/info'
let modulo = 0

function getRandomInt(max) {//Funcion que genera numero aleatorio entre 1 y 2
	let alternativa=0
	alternativa=Math.floor(Math.random() * max);
	while(alternativa==0){
		alternativa=Math.floor(Math.random() * max);
	}
  return alternativa}

//setModulo1()//Coloca el crucigrama 1 de predeterminado

function setModulo1(){
	if (document.getElementById("puzzle-wrapper").innerHTML==''){
		b.then(value => {//Aqui se pueden traer los valores bien para manejarlos y colocar logica dentro
			console.log(value)
			crucigramas(value, 1, getRandomInt(3))
			console.log('Esto se imprime dentro del valor del promise')
		  }).catch(err => {
			console.log(err);
		  });
		}else{//Limpia la pantalla en caso de que haya ya un crucigrama y crea uno nuevo
			document.getElementById("puzzle-wrapper").innerHTML=''
			document.getElementById("puzzle-clues").innerHTML=''
			setModulo1();
		}
	}

	
function setModulo2(){
	if (document.getElementById("puzzle-wrapper").innerHTML==''){
		b.then(value => {//Aqui se pueden traer los valores bien para manejarlos y colocar logica dentro
			console.log(value);
			crucigramas(value, 2, getRandomInt(3))
			console.log('Esto se imprime dentro del valor del promise')
		  }).catch(err => {
			console.log(err);
		  });
		}else{//Limpia la pantalla en caso de que haya ya un crucigrama y crea uno nuevo
			document.getElementById("puzzle-wrapper").innerHTML=''
			document.getElementById("puzzle-clues").innerHTML=''
			setModulo2();
		}
	}

async function getModulo(){ //Funcion asincrona que trae la consulta de la bd
	const res = await fetch(url,{
		method: 'GET'
	})
	const data = await res.json()
return data}

const b = Promise.resolve(getModulo())//variable que resuelve y almacena la funcion

window.onload= b.then(value => {//Aqui se pueden traer los valores bien para manejarlos y colocar logica dentro
	console.log(value)
	crucigramas(value, 1, getRandomInt(3))
  }).catch(err => {
	console.log(err);
  });


/////////////////FUNCION DE CREA EL CRUCIGRAMA/////////////////


function crucigramas(pruebaDatos, modulos, alternativas){	
(function($) {
	$(function() {
		var puzzleData=[] //declaramos arreglo con los datos de las preguntas
		let contador=0
		//establecemos contador
		pruebaDatos.forEach(pruebaDato => { //llenamos el arreglo con la informacion de la base de datos
			if(pruebaDatos[contador].modulo==modulos  && pruebaDatos[contador].alt==alternativas){
				console.log("entra aqui")
				puzzleData.push({
						clue: pruebaDatos[contador].pregunta,
						answer: pruebaDatos[contador].respuesta,
						position: pruebaDatos[contador].position,
						orientation: pruebaDatos[contador].orientation,
						startx: pruebaDatos[contador].posX,
						starty: pruebaDatos[contador].posY
				})
				contador+=1
			}else{
				contador+=1
			}	
		});
	
		$('#puzzle-wrapper').crossword(puzzleData);
		
	})
	
})(jQuery)
}




