const Herramientas = {
	/**
	 * ### Encuentra un nombre unico para uno que entra sujerido.
	 * @param {*} strAux 
	 * @returns 
	 */
	_get_secuencial_dom(strAux = IDLINK_XDEF) {
		//Validacion de los argumentos:.............>
		if (!strAux || typeof (strAux) != 'string') return false;
		//
		//Working Procedure:........................>
		for (let i = 0; ; i++)  
			if (!document.getElementById(strAux + '_' + i)) 
				return (strAux + '_' + i);
	},
	/** 🌈 🪑 
	 * ### Devuelve un color aleatorio de la lista de colores.
	 * @returns {string} Un color en formato RGB.
	 */
	randomColor() {
		const colores = [
		// ROSAS - Oscuros y contrastantes
		"rgba(180, 40, 100, 0.9)",    // Rosa oscuro intenso
		"rgba(160, 30, 90, 0.9)",     // Rosa vino profundo
		
		// VERDES - Oscuros y contrastantes
		"rgba(20, 100, 60, 0.9)",     // Verde bosque oscuro
		"rgba(10, 80, 50, 0.9)",      // Verde abeto profundo
		"rgba(0, 70, 40, 0.9)",       // Verde pino intenso
		
		// AZULES - Oscuros y contrastantes
		"rgba(20, 60, 120, 0.9)",     // Azul marino
		"rgba(10, 50, 100, 0.9)",     // Azul medianoche
		
		// NARANJAS - Oscuros y contrastantes
		"rgba(180, 80, 20, 0.9)",     // Naranja óxido
		"rgba(160, 70, 10, 0.9)",     // Naranja terracota
		
		// MARRONES - Oscuros y contrastantes
		"rgba(100, 60, 30, 0.9)",     // Marrón chocolate
		"rgba(80, 50, 25, 0.9)",      // Marrón café
		"rgba(60, 40, 20, 0.9)",      // Marrón ébano
		
		// MORADOS - Oscuros y contrastantes
		"rgba(80, 30, 100, 0.9)",     // Morado berenjena
		"rgba(70, 25, 90, 0.9)",      // Morado real
		
		// ROJOS - Oscuros y contrastantes
		"rgba(150, 30, 40, 0.9)",     // Rojo vino
		"rgba(130, 25, 35, 0.9)"      // Rojo granate
	];
		const index = Math.floor(Math.random() * (colores.length));
		return colores[index];
	},
	
	

}
// ■■■
// Exportar si usas módulos, si no, simplemente queda definida globalmente
// if (typeof module !== 'undefined' && module.exports) {
	//     module.exports = Herramientas;
// }
// ■■■


// ███
// * C L A S E  Compatibilidad ....... No usada.      IA.
// ███

// ■■■
//  UTIL COMPATIBILIDAD (Feature Detection)  [KISS]
//  ###  Helpers para decidir por capacidades (W3C) en lugar de UA.
// ■■■
const Compatibilidad = {
	/**
     * ## Detecta si es móvil/tablet/Desktop basándose en el window.innerWidth 
     * ### Principio: El diseño responde al ancho, la interacción responde al touch.
	 * ```javascript
	 * 	retorna {tipo: 'MOVIL', es_tactil: true, ancho_ventana: 575}
	 * ```
     */
    _detectar_entorno() {
		const ancho = window.innerWidth;

		// Breakpoints Bootstrap reales
		let tipo = 'DESKTOP';
		if (ancho < 576) {
			tipo = 'MOVIL';
		} else if (ancho < 992) {
			tipo = 'TABLET';
		}

		// Touch = capacidad de interacción, no tipo de dispositivo
		const es_tactil = navigator.maxTouchPoints > 0;
		
		return {
			tipo,
			es_tactil,
			ancho_ventana: ancho
		};
	},
	
	/**
	 * ## Determinar DIMENSIONES INICIALES dependiendo del tipo/ancho de la pantalla. 
	 * ### Columnas ►  Movil = 8 | Tablet = 16 | Destktop = 24
	 */
	_get_dimension_inicial(tipo){
		const dimensiones_iniciales = {
			filas:12,
			columnas:8,
		}
		if (tipo == 'MOVIL') {
			dimensiones_iniciales.columnas = 8;
		} else if (tipo == 'TABLET') {
			dimensiones_iniciales.columnas = 16;
		} else if (tipo == 'DESKTOP'){
			dimensiones_iniciales.columnas = 24;

		}
		return dimensiones_iniciales;
	},
	/**
	 * ### Establece los valores min y max de filas y columnas dependiendo del tipo de dispositivo 
	 * ### El tipo de dispositivo es: DESKTOP, MOVIL, TABLET
	 * ### El tipo de dispositivo se calcula en {@link Compatibilidad _detectar_entorno}
	 */
	_get_limites_max_min(tipo){
		const limites = {
			columnas:{min:8, max:30},
			filas: 	 {min:8, max:100}
		}
		if (tipo == 'MOVIL') {
			limites.columnas.min = 8;
			limites.columnas.max = 8;
		} else if (tipo == 'TABLET') {
			limites.columnas.min = 8;
			limites.columnas.max = 30;
		} else if (tipo == 'DESKTOP'){
			limites.columnas.min = 8;
			limites.columnas.max = 30;
		}
		return limites;
	},

	
	/** @returns {boolean} true si el dispositivo tiene entrada táctil */
	soportaTouch() {
		return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
	},

	/** @returns {boolean} true si el navegador soporta la propiedad/valor CSS */
	soportaCSS(prop, valor = 'initial') {
		return (window.CSS && CSS.supports) ? CSS.supports(prop, valor) : false;
	},	
		
	/** @returns {object} info básica no sensible (idioma, plataforma, online) */
	infoBasica() {
		return { idioma: navigator.language, plataforma: navigator.platform, online: navigator.onLine };
	},


}
// ■■■
// Exportar si usas módulos, si no, simplemente queda definida globalmente
// if (typeof module !== 'undefined' && module.exports) {
	//     module.exports = Compatibilidad;
// }
// ■■■
