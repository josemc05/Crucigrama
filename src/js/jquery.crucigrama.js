

(function($){
	$.fn.crossword = function(entryData) {
			
			
			var crucigrama = {}; // Arreglo para almacenar los datos del crucigrama
			crucigrama.data = entryData;
			
			// Aqui se crea el la etiqueta div que almacena la tabla con los datos del crucigrama 
			this.after('<div id="puzzle-clues"><h2>Horizontales</h2><ol id="across"></ol><h2>Verticales</h2><ol id="down"></ol></div>');
			
			var tbl = ['<table id="puzzle">'],
			    crucigramaContenido = this,
				pistas = $('#puzzle-clues'),
				pistasElementos,
				coords,
				cantidadPreguntas = crucigrama.data.length,
				elementos = [], 
				rows = [],
				cols = [],
				resuelta = [],
				$actual,
				posicionActual = 0,
				preguntaActual = 0,
				orientacionActual,
				mode = 'interacting',
				marcaResuelto = false,
				z = 0;

			var puzInit = {
				
				init: function() {
					orientacionActual = 'across'; 
					
					// Se ordenan los datos del arreglo con la informacion del crucigrama de manera ascendente
					crucigrama.data.sort(function(a,b) {
						return a.position - b.position;
					});

					//Manejamos que al insertar un caracter en una casilla, se mueva el cursor a la casilla correspondiente a la orientacion de la pregunta
					crucigramaContenido.delegate('input', 'keyup', function(e){
						mode = 'interacting';
						
						
						
						switch(e.which) {
							case 39:
							case 37:
								orientacionActual = 'across';
								break;
							case 38:
							case 40:
								orientacionActual = 'down';
								break;
							default:
								break;
						}
						
						if ( e.keyCode === 9) {
							return false;
						} else if (
							e.keyCode === 37 ||
							e.keyCode === 38 ||
							e.keyCode === 39 ||
							e.keyCode === 40 ||
							e.keyCode === 8 ||
							e.keyCode === 46 ) {			
												

							
							if (e.keyCode === 8 || e.keyCode === 46) {
								orientacionActual === 'across' ? nav.siguienteCasilla(e, 37) : nav.siguienteCasilla(e, 38); 
							} else {
								nav.siguienteCasilla(e);
							}
							
							e.preventDefault();
							return false;
						} else {
							
							console.log('input keyup: '+marcaResuelto);
							
							puzInit.comprobarRespuesta(e);

						}

						e.preventDefault();
						return false;					
					});
			
				
					
					// Se maneja que se resalte la pregunta en la que se esta desarrollando dentro de la matriz (se ve en la matriz)
					crucigramaContenido.delegate('input', 'click', function(e) {
						mode = "setting ui";
						if (marcaResuelto) marcaResuelto = false;

						
					
						nav.actualizarPosicion(e);
						e.preventDefault();
									
					});
					
					
					// Manejamos que al darle click a una pregunta resalte la seccion en la matriz correspondiete
					pistas.delegate('li', 'click', function(e) {
						mode = 'setting ui';
						
						if (!e.keyCode) {
							nav.clickCasilla(e);
						} 
						e.preventDefault(); 
					});
					
					
					// Permite que se pueda dar click en cualquier casilla de las palabras y editarlas
					crucigramaContenido.delegate('#puzzle', 'click', function(e) {
						$(e.target).focus();
						$(e.target).select();
					});
					
					
					puzInit.obtenerCoordenadas();
					
					// se agregan las preguntas al documento HTML que muestra el aplicativo y resalta la primera pregunta
					pistasElementos = $('#puzzle-clues li');
					$('#' + orientacionActual + ' li' ).eq(0).addClass('clues-active').focus();
				
					// DELETE FOR BG
					puzInit.crearMatriz();
					puzInit.insertarElementos();
										
				},
				
				//Funcion que ordena mediante coordenadas la matriz de acuerdo a la direccion y cantidad de letras de la palabras
				obtenerCoordenadas: function() {
					for (var i = 0, p = cantidadPreguntas; i < p; ++i) {		
						elementos.push(i);
						elementos[i] = [];

						for (var x=0, j = crucigrama.data[i].answer.length; x < j; ++x) {
							elementos[i].push(x);
							coords = crucigrama.data[i].orientation === 'across' ? "" + crucigrama.data[i].startx++ + "," + crucigrama.data[i].starty + "" : "" + crucigrama.data[i].startx + "," + crucigrama.data[i].starty++ + "" ;
							elementos[i][x] = coords; 
						}

						$('#' + crucigrama.data[i].orientation).append('<li tabindex="1" data-position="' + i + '">' + crucigrama.data[i].clue + '</li>'); 
					}				
					
					// 
					for (var i = 0, p = cantidadPreguntas; i < p; ++i) {
						for (var x=0; x < elementos[i].length; x++) {
							cols.push(elementos[i][x].split(',')[0]);
							rows.push(elementos[i][x].split(',')[1]);
						};
					}

					rows = Math.max.apply(Math, rows) + "";
					cols = Math.max.apply(Math, cols) + "";
		
				},
				
				//Funciones que arma la matriz 
				crearMatriz: function() {
					for (var i=1; i <= rows; ++i) {
						tbl.push("<tr>");
							for (var x=1; x <= cols; ++x) {
								tbl.push('<td data-coords="' + x + ',' + i + '"></td>');		
							};
						tbl.push("</tr>");
					};

					tbl.push("</table>");
					crucigramaContenido.append(tbl.join(''));
				},
				
				insertarElementos: function() {
					var crucigramaCasillas = $('#puzzle td'),
						resaltador,
						$Resaltados,
						hasOffset = false,
						positionOffset = cantidadPreguntas - crucigrama.data[crucigrama.data.length-1].position; // diff. between total elementos and highest POSITIONS
						
					for (var x=1, p = cantidadPreguntas; x <= p; ++x) {
						var letters = crucigrama.data[x-1].answer.split('');

						for (var i=0; i < elementos[x-1].length; ++i) {
							resaltador = $(crucigramaCasillas +'[data-coords="' + elementos[x-1][i] + '"]');
							
							if(x > 1 ){
								if (crucigrama.data[x-1].position === crucigrama.data[x-2].position) {
									hasOffset = true;
								};
							}
							
							if($(resaltador).empty()){
								$(resaltador)
									.addClass('entry-' + (hasOffset ? x - positionOffset : x) + ' position-' + (x-1) )
									.append('<input maxlength="1" val="" type="text" tabindex="-1" />');
							}
						};
						
					};	

					for (var i=1, p = cantidadPreguntas; i < p; ++i) {
						$Resaltados = $('.entry-' + i);
						if(!$('.entry-' + i +':eq(0) span').length){
							$Resaltados.eq(0)
								.append('<span>' + crucigrama.data[i].position + '</span>');
						}
					}	
					
					util.resaltarCasilla();
					util.resaltarPregunta();
					$('.active').eq(0).focus();
					$('.active').eq(0).select();
										
				},
				
				
				//Función que revisa si la respuesta es correcta, sino devuelve a la primera letra de la palabra a responder
				comprobarRespuesta: function(e) {
					
					var valorRevisar, valorActual;
					
					util.obtenerPosicion($(e.target));
				
					valorRevisar = crucigrama.data[posicionActual].answer.toLowerCase();

					valorActual = $('.position-' + posicionActual + ' input')
						.map(function() {
					  		return $(this)
								.val()
								.toLowerCase();
						})
						.get()
						.join('');
	
					if(valorRevisar === valorActual){	
						$('.active')
							.addClass('done')
							.removeClass('active');
					
						$('.clues-active').addClass('clue-done');

						resuelta.push(valorRevisar);
						marcaResuelto = true;
						return;
					}
					
					orientacionActual === 'across' ? nav.siguienteCasilla(e, 39) : nav.siguienteCasilla(e, 40);
					
				

				}				


			}; 
			

			var nav = {
				
				siguienteCasilla: function(e, override) {

					var len = $actual.length,
						seleccionada = override ? override : e.which,
						el = $(e.target),
						p = el.parent(),
						ps = el.parents(),
						selector;
				
					util.obtenerPosicion(el);
					util.resaltarCasilla();
					util.resaltarPregunta();
					
					$('.current').removeClass('current');
					
					selector = '.position-' + posicionActual + ' input';
					
		
					switch(seleccionada) {
						case 39:
							p
								.next()
								.find('input')
								.addClass('current')
								.select();

							break;
						
						case 37:
							p
								.prev()
								.find('input')
								.addClass('current')
								.select();

							break;

						case 40:
							ps
								.next('tr')
								.find(selector)
								.addClass('current')
								.select();

							break;

						case 38:
							ps
								.prev('tr')
								.find(selector)
								.addClass('current')
								.select();

							break;

						default:
						break;
					}
															
				},
	
				clickCasilla: function(e) {
					var target;
					
					$('.clues-active').removeClass('clues-active');
					$('.active').removeClass('active');
					$('.current').removeClass('current');
					currIndex = 0;

					target = e.target;
					posicionActual = $(e.target).data('position');
					
					util.resaltarCasilla();
					util.resaltarPregunta();
										
					$('.active').eq(0).focus();
					$('.active').eq(0).select();
					$('.active').eq(0).addClass('current');
					
					orientacionActual = $('.clues-active').parent('ol').prop('id');
										
					preguntaActual = $(pistasElementos).index(e.target);
					
					
				},
			
				
				actualizarPosicion: function(e, next) {
					var classes, next, clue, e1Ori, e2Ori, e1Cell, e2Cell;
					
					if(e.keyCode === 9 || next){
							
						preguntaActual = preguntaActual === pistasElementos.length-1 ? 0 : ++preguntaActual;
					
						$('.clues-active').removeClass('.clues-active');
												
						next = $(pistasElementos[preguntaActual]);
						orientacionActual = next.parent().prop('id');
						posicionActual = $(next).data('position');
												
						
						util.getSkips(preguntaActual);
						posicionActual = $(pistasElementos[preguntaActual]).data('position');
						
																								
					} else {
						preguntaActual = preguntaActual === pistasElementos.length-1 ? 0 : ++preguntaActual;
					
						util.obtenerPosicion(e.target);
						
						clue = $(pistasElementos + '[data-position=' + posicionActual + ']');
						preguntaActual = $(pistasElementos).index(clue);
						
						orientacionActual = clue.parent().prop('id');
						
					}
						
						util.resaltarCasilla();
						util.resaltarPregunta();
						
						
				}
				
			}; 

			
			var util = {
				resaltarCasilla: function() {
					
					$actual = $('.active');
					$actual.removeClass('active');
					$actual = $('.position-' + posicionActual + ' input').addClass('active');
					$actual.eq(0).focus();
					$actual.eq(0).select();
				},
				
				resaltarPregunta: function() {
					var clue;				
					$('.clues-active').removeClass('clues-active');
					$(pistasElementos + '[data-position=' + posicionActual + ']').addClass('clues-active');
					
					if (mode === 'interacting') {
						clue = $(pistasElementos + '[data-position=' + posicionActual + ']');
						preguntaActual = $(pistasElementos).index(clue);
					};
				},
				
				getClasses: function(resaltador, type) {
					if (!resaltador.length) return false;
					
					var classes = $(resaltador).prop('class').split(' '),
					classLen = classes.length,
					positions = []; 

					for(var i=0; i < classLen; ++i){
						if (!classes[i].indexOf(type) ) {
							positions.push(classes[i]);
						}
					}
					
					return positions;
				},

				obtenerPosicion: function(el){

						classes = util.getClasses($(el).parent(), 'position');

						if(classes.length > 1){
							
							e1Ori = $(pistasElementos + '[data-position=' + classes[0].split('-')[1] + ']').parent().prop('id');
							e2Ori = $(pistasElementos + '[data-position=' + classes[1].split('-')[1] + ']').parent().prop('id');

							e1Cell = $('.position-' + classes[0].split('-')[1] + ' input').index(el);
							e2Cell = $('.position-' + classes[1].split('-')[1] + ' input').index(el);

							if(mode === "setting ui"){
								orientacionActual = e1Cell === 0 ? e1Ori : e2Ori; }

							if(e1Ori === orientacionActual){
								posicionActual = classes[0].split('-')[1];		
							} else if(e2Ori === orientacionActual){
								posicionActual = classes[1].split('-')[1];
							}
						} else {
							posicionActual = classes[0].split('-')[1];						
						}
						
						
						
				},
				
				revisarRespuesta: function(valorRevisar) {
					for (var i=0, s=resuelta.length; i < s; i++) {
						if(valorRevisar === resuelta[i]){
							return true;
						}

					}
				},
				
			
				
			}; 	
			puzInit.init();				
	}
	
})(jQuery);