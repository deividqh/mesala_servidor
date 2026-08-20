/**
 * Convierte entre índices, coordenadas y nombres de celda.
 *
 * Esta clase solo realiza cálculos: no conoce Salon, el DOM ni los rangos.
 * Los límites de la matriz se reciben mediante la dimensión para que sus
 * resultados sean fáciles de probar y no dependan del estado de la interfaz.
 */
class Celda_Mapper {
	/**
	 * Convierte un índice lineal en coordenadas {fila, columna}.
	 * Si se indican las filas, también valida que el índice esté en la matriz.
	 */
	indice_a_coordenadas(indice, columnas, filas = null) {
		const indice_numero = Number(indice);
		const columnas_numero = Number(columnas);

		if (!Number.isInteger(indice_numero) || indice_numero < 0) {
			throw new Error(`Índice inválido: ${indice_numero}. Debe ser un entero mayor o igual a cero.`);
		}
		if (!Number.isInteger(columnas_numero) || columnas_numero <= 0) {
			throw new Error(`Columnas inválidas: ${columnas_numero}. Debe ser un entero mayor a cero.`);
		}

		if (filas !== null) {
			if (!Number.isInteger(filas) || filas <= 0) {
				throw new Error(`Filas inválidas: ${filas}. Debe ser un entero mayor a cero.`);
			}
			if (indice_numero >= filas * columnas_numero) {
				throw new Error(`Índice fuera de límites: ${indice_numero}. El máximo permitido es ${(filas * columnas_numero) - 1}.`);
			}
		}

		return {
			fila: Math.floor(indice_numero / columnas_numero),
			columna: indice_numero % columnas_numero,
		};
	}

	/** Convierte coordenadas válidas en un índice lineal. */
	coordenadas_a_indice(fila, columna, dimension) {
		if (!this._es_dimension_valida(dimension)) return null;
		if (!Number.isInteger(fila) || !Number.isInteger(columna)) return null;
		if (fila < 0 || columna < 0) return null;
		if (fila >= dimension.filas || columna >= dimension.columnas) return null;

		return fila * dimension.columnas + columna;
	}

	/** Convierte coordenadas de base cero en una referencia como A0, B3 o AA1. o null */
	coordenadas_a_celda(fila, columna) {
		if (!Number.isInteger(fila) || fila < 0) return null;
		if (!Number.isInteger(columna) || columna < 0) return null;

		return `${this._numero_a_columna(columna)}${fila}`;
	}

	/** Convierte una referencia como A0, B3 o AA1 en {fila, columna}. */
	celda_a_coordenadas(celda) {
		if (typeof celda !== 'string') return null;

		const coincidencia = celda.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
		if (!coincidencia) return null;

		const fila = Number.parseInt(coincidencia[2], 10);
		let columna = 0;

		for (const letra of coincidencia[1]) {
			columna = columna * 26 + letra.charCodeAt(0) - 64;
		}

		return { fila, columna: columna - 1 };
	}

	/** Convierte un índice en 'A0', 'B1', 'C2', etc. */
	indice_a_celda(indice, columnas, filas = null) {
		const coordenadas = this.indice_a_coordenadas(indice, columnas, filas);
		return this.coordenadas_a_celda(coordenadas.fila, coordenadas.columna);
	}

	_numero_a_columna(columna) {
		let numero = columna + 1;
		let resultado = '';

		while (numero > 0) {
			const resto = (numero - 1) % 26;
			resultado = String.fromCharCode(65 + resto) + resultado;
			numero = Math.floor((numero - 1) / 26);
		}

		return resultado;
	}

	_es_dimension_valida(dimension) {
		return Boolean(
			dimension
			&& Number.isInteger(dimension.filas)
			&& dimension.filas > 0
			&& Number.isInteger(dimension.columnas)
			&& dimension.columnas > 0
		);
	}
}




/**
 * ## Working_Celdas representa una celda en una matriz_plana.
 * ### Permite convertir entre coordenadas (fila, columna) o indice y referencias estilo Excel (A1, B2, etc.)
 * @example let celda = new Working_Celdas(this, fila, columna);
 */
class Working_Celdas {
	// ■■
	// * C L A S E  "Working_Celdas" ► representa una celda en una matriz_plana.
	// * Permite convertir entre coordenadas (fila, columna) o indice y referencias estilo Excel (A1, B2, etc.)
	// * example: (Matriz_Plana)  let celda = new Working_Celdas(this, fila, columna);
	// ■■
	constructor(instancia_Salon = null) {
		
		this.ref_Salon = instancia_Salon;

		this.celda_mapper = new Celda_Mapper();

	}

	/**
	 * ## Convierte un índice de array unidimensional a coordenadas bidimensionales (fila, columna).
	 * @param {number} indice - El índice del elemento en el array unidimensional (empezando en 0).
	 * @param {number} columnas - El total de columnas de la matriz bidimensional.
	 * @param {number} [filas] - (Opcional) El total de filas para validar los límites de la matriz.
	 * [RETORNO] {Object} Objeto con la {fila, columna} correspondiente.
	 */
	_get_celda(indice, dimension = null) {
		try {			
			return this.celda_mapper.indice_a_celda(indice, dimension.columnas, dimension.filas);
		} catch {
			return null;
		}
	}	
	
	/**
	 * ## Devuelve el indice en  this.matriz_plana si lo encuentra, o false si no encuentra.
	 * {@link X_to_indice} ■ 
	 * ```javascript
	 * const indice = celda._get_indice_(2, 3); // fila 2, columna 3 ► indice = 14
	 * const indice = celda._get_indice_(2, 3000); // fila 2, columna 3000 ► indice = false
	 * ```	*/
	_get_indice(fila, columna) {
		const dimension_matriz = this.ref_Salon?.get_dimension_matriz?.();
		const indice = this.celda_mapper.coordenadas_a_indice(fila, columna, dimension_matriz);
		if(indice !== null && indice < this.ref_Salon.matriz_plana.length){
			return indice;
		}
		return false;
	}
	

	/**
	 * ### Normaliza un valor para que sea un índice válido (entero positivo).
	 * @param {*} valor 
	 * @returns {number} índice normalizado o 0 si no es válido.
	 */
	_AZ_to_numcol(columna_en_AZ = '') {
		const coordenadas = this.celda_mapper.celda_a_coordenadas(`${columna_en_AZ}0`);
		return coordenadas?.columna ?? null;
	}

	/**
	 * ### Formatea la celda en estilo Excel (A1, B2, etc.).
	 * @param {number} row numero de fila.
	 * @param {number} col numero de columna.
	 * @returns {string} representación en estilo Excel de la celda.
	*/
	_fc_to_celda(row , col ) {
		if (!this.is_OK(row, col)) return null;
		const celda = this.celda_mapper.coordenadas_a_celda(row, col);
		return celda ? celda : null;
	}

	/**
	 * ### Parsea una referencia de celda en estilo Excel (A1, B2, etc.) o un objeto con fila y columna.
	 * @param {*} celda 'A1', {fila: 2, columna: 3}, {fila:3, columna:'C'}
	 * @returns {Object|null} {fila: 2, columna: 3} | null
	*/
	_celda_to_fc(celda = null) {
		let coordenadas = null;

		if (typeof celda === 'string') {
			coordenadas = this.celda_mapper.celda_a_coordenadas(celda);
		
		} else if (celda && typeof celda === 'object') {
			const columna = typeof celda.columna === 'string'
				? this._AZ_to_numcol(celda.columna)
				: celda.columna;
			coordenadas = { fila: celda.fila, columna };
		}
		const is_ok = this._fila_columna_OK(coordenadas) || false;
		return is_ok ? coordenadas : null;
	}

	/**
	 * ## Obtiene el índice lineal de la matriz a partir de cualquier formato de entrada.
	 * ### Devuelve el índice (0 a N).... si es valido o false/inválido.
	 * @param {number|string|Working_Celdas} arg1 - Puede ser: índice directo (int), fila (int), "A1" (string) o objeto Working_Celdas.
	 * @param {number|null} arg2 - Si arg1 es fila, arg2 es la columna. Si no, es null.
	 * ```javascript
	 *	matriz.X_to_indice(5); ► (Indice) Devuelve 5 si es válido
	 *	matriz.X_to_indice(2, 3); ► (row-col) Devuelve el índice de fila 2, columna 3
	 *	matriz.X_to_indice("B3"); ► (str) Devuelve el índice de la celda B3
	 *	matriz.X_to_indice({1, 4}); ► Devuelve el índice de la celda (1,4)
	 * ``` 
	*/
    X_to_indice(arg1, arg2 = null) {        
		let fila, col;
		try {
			// ■ CASO 1: Índice directo (un solo número)
			if (typeof arg1 === 'number' && arg2 === null) {
				if (this.is_OK(arg1)) return arg1;            
				return false;
			}
			// ■ CASO 2: Texto tipo Celda ("B3")
			if (typeof arg1 === 'string') {
				const coords = this._celda_to_fc(arg1);            
				if (!coords) return false;            
				fila = coords.fila;
				col  = coords.columna;
			}        
			// ■ CASO 3: Coordenadas (fila, columna)
			else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
				fila = arg1;
				col  = arg2;
			}        
			// ■ CASO 4: arg1 es un objeto {fila, columna}
			else if (typeof arg1 === 'object' && arg2 === null && arg1.fila!=null && arg1.columna!=null) {
				fila = arg1.fila;
				col  = arg1.columna;
			}
			
			// ■ CASO 5: Ninguno de los anteriores
			else {
				return false; // Entrada no reconocida
			}
		} catch (error) {
			// console.warn(`Error en _get_indice_universal${error.message}`);
			return false;
		}
		if ( !this.is_OK(fila, col) ) return false;
		// ■ RETORNO
		return this._get_indice(fila, col);
    }
	
	/**
	 * ### Convierte un indice de entrada(arg1) en un objeto {fila, columna} (coordenada).
	 * @param {object|number|string} arg1  actua como coordenada = { 3 , 4 }  ■  actua como fila = 4  ■  actua como celda = 'C3'
	 * @param {number} arg2 actua como columna = 3
	 */
	X_to_fc(arg1, arg2=null){
		// Valida
		const indice = this.X_to_indice(arg1, arg2);
		if (indice===false) return null;
		// Calcula coordenadas
		const dim = this.ref_Salon?.get_dimension_matriz?.();
		if (!dim) return null;
		const { fila, columna } = this.celda_mapper.indice_a_coordenadas(indice,dim.columnas,dim.filas,);
		// ■ RETORNO
		return this.is_OK(fila, columna) ? {fila, columna} : null;
	}

	/** 
	 * ## Devuelve una celda excel o null.
	 * @param {number|String|object} arg1 1-indice | 2-fila | 3- {fila, columna} | 4-celda ► 'B2' 
	 * @param {number|null} arg2 1-columna
	 * ```javascript
	 * 		X_to_celda(5);  	► C3, el indice 5 corresponde con C3 en esta matriz.
	 * 		X_to_celda(4, 2);  	► B3, '4' es la fila(0, 1, 2, 3) y '2' es la columna B ► B3
	 * 		X_to_celda({3, 2}); ► B2, '3' es la fila(0, 1, 2) y '2' es la columna B ► B3
	 * 		X_to_celda('B2');  	► B2  
	 * ```	 */
	X_to_celda(arg1, arg2=null){
		try {
			// Valida
			const indice = this.X_to_indice(arg1, arg2);
			if (indice === false) return null;
			//Saca Coordenadas
			const coordenada = this.X_to_fc(indice);
			// Lo pone en formato celda y retorna.... _fc_to_celda también valida is_OK ;)
			const celda = this._fc_to_celda(coordenada.fila, coordenada.columna);
			return celda || null;			
		} catch (error) {
			console.log(error);
			return null;
		}
	}
	
	/** Normaliza "3x4", {filas: 3, columnas: 4} o los argumentos (3, 4). 
	 * @param {string|number|object} arg1 - Puede ser una cadena de texto (ej. '3x4'), un número (filas) o un objeto {filas, columnas}.
	 * @param {number|null} arg2 - Si arg1 es un número (filas), arg2 es el número de columnas. Si no, es null.
	 * @returns {{filas: number, columnas: number} | null} 
	*/
	_normalizar_dimension(arg1 = null, arg2 = null) {
		let filas;
		let columnas;
		if (typeof arg1 === 'string') {
			const partes = arg1.trim().toLowerCase().match(/^(\d+)x(\d+)$/);
			if (!partes) return null;
			filas = Number(partes[1]);
			columnas = Number(partes[2]);
		} else if (arg1 && typeof arg1 === 'object') {
			({ filas, columnas } = arg1);
		} else {
			filas = arg1;
			columnas = arg2;
		}
		// Ahora Valido los límites de la matriz.
		const Salon = this.ref_Salon;
		const limites = Salon?.get_dimension_matriz?.();
		if (!limites) return null;
		if (filas <= limites.filas && columnas <= limites.columnas){
			return Number.isInteger(filas) && filas > 0
				&& Number.isInteger(columnas) && columnas > 0
				? { filas, columnas }
				: null;
		}
	}
	
	// ■■
	// ■■ VALIDADORES
	// ■■
	
	/**
	 * ### Valida que un indice es Correcto(Entero positivo, en el rango de la matriz.)
	 * @param {number} indice de la matriz. 
	*/
	_indice_OK(indice){
		const MatriZ = this.ref_Salon.matriz_plana;
		// ■ Validación que exista la matriz
		if (!MatriZ || !Array.isArray(MatriZ)) return false;		
		// ■ Validación de parámetros: NUMERO - ENTERO - POSITIVO
		if (typeof indice !== 'number') return false;
		if (!Number.isInteger(indice) ) return false;
		if ( indice < 0) return false;				
		// ■ Validación de rango válido en la matriz
		if (indice >= MatriZ.length) return false;				
		return true
	}
	
	/**
	 * ### Valida que fila y columna son OK y están en el límite de las filas y columnas del Salón.  */
	_fila_columna_OK({ fila, columna } = {}) {
		if (!Number.isInteger(fila) || fila < 0) return false;
		if (!Number.isInteger(columna) || columna < 0) return false;

		const limites = this.ref_Salon?.get_dimension_matriz?.();
		if (!limites) return false;

		return fila < limites.filas && columna < limites.columnas;
	}

	/**
	 * ### Valida celda (B3, A1, ...) ✔️ 	 */
	_celda_OK(celda = null) {
		const coordenada = this._celda_to_fc(celda);
		if (!coordenada) return false;                
		return this._fila_columna_OK(coordenada);
	}

	/** ### recibe una dimesinion y verifica que es valida en el Salon. */
	_dimension_OK(dimension){
		if (!dimension || typeof dimension !== 'object') return false;
		const { filas, columnas } = dimension;
		if (!Number.isInteger(filas) || filas <= 0) return false;
		if (!Number.isInteger(columnas) || columnas <= 0) return false;

		const limites = this.ref_Salon?.get_dimension_matriz?.();
		if (!limites) return false;

		return filas <= limites.filas && columnas <= limites.columnas;
	}

	/**
	 * ### Valida si una celda en cualquier formato es correcta o no. ✔️
	 * @param {number|string|Working_Celdas} arg1 - Puede ser: índice directo (int), fila (int), "A1" (string) o objeto Working_Celdas.
	 * @param {number|null} arg2 - Si arg1 es fila, arg2 es la columna. Si no, es null.
	 * @returns {Boolean} - true si es una celda de la matriz. false si no es una celda de la matriz.
	 * @example is_OK(5); ■ is_OK(2, 3); ■ is_OK("B3"); ■ is_OK( {1, 4} ); 
	*/
	is_OK(arg1, arg2 = null) {
		const _normaliza_coordenada = (valor) => {
			const numero = Number(valor);
			return Number.isInteger(numero) && numero >= 0 ? numero : null;
		};
		// ■ CASO 1: Índice directo (un solo número)
		if (typeof arg1 === 'number' && arg2 === null) {
				return this._indice_OK(arg1);
		}
		// ■ CASO 2: Texto tipo Excel ("B3")
		if (typeof arg1 === 'string') {
				return this._celda_OK(arg1);
		}
		// ■ CASO 3: Coordenadas (fila, columna)
		if (typeof arg1 === 'number' && typeof arg2 === 'number') {
				return this._fila_columna_OK({ fila: arg1, columna: arg2 });
		}
		// ■ CASO 4: arg1 es un objeto {fila, columna}
		if (arg1 && typeof arg1 === 'object' && arg2 === null) {
				const fila = _normaliza_coordenada(arg1.fila);
				let columna = arg1.columna;
				if (typeof columna === 'string' && isNaN(columna)) {
					columna = this._AZ_to_numcol(columna);
				}
				columna = _normaliza_coordenada(columna);
				return this._fila_columna_OK({ fila, columna });
		}

		// ■ CASO 5: Ninguno de los anteriores
		return false;
    }

	// ■■
	// ■■ HERRAMIENTAS DE LA CLASE
	// ■■
	/**
	 * ### Añade un valor al índice de la celda pasada como argumento y devuelve el resultado.
	 * @param {String|Object} arg1, puede ser String 'B2' o Object {3, 2} o number-indice (5)
	 * @param {*} plus Lo que se le añade al indice de celda. puede ser positivo o negativo
	 * ### [RETORNO] {String} nueva celda o false si no es válida.
	 * ```javascript
	 * plus('B7', 3); ► a la celda B7 le añade 3 al indice
	 * plus({fila:3, columna:2}, 1); ► a la celda fila = 2, columna = 1 le añade 1 al indice
	 * plus(5, 3); ► a la celda situada en el indice 5 le añade 3 al indice
	 * ```	 */
	plus(arg1='A0', plus = 0) {
		// Valida
		if (!Number.isInteger(plus)) plus=1;		
		// Convierte la celda a indice
		const indice = this.X_to_indice(arg1);
		if(indice === false) return false;
		// Suma el plus al indice
		const indice_plus = indice + plus;		
		const new_celda = this.X_to_celda( indice_plus );
		
		return this.is_OK(new_celda) ? new_celda : false;
	}
	
	/**
	 * Añade una fila y/o columna a la celda pasada como argumento y devuelve el resultado.
	 * @param {String|Object} arg1, puede ser String 'B2' o Object {3, 2} o number-indice (5)
	 * @param {*} plus_row Lo que se le añade a la fila de celda. puede ser positivo o negativo
	 * @param {*} plus_col Lo que se le añade a la columna de celda. puede ser positivo o negativo
	 * @returns {String} celda  nueva o false si no es válida.
	 * @example suma_fc('B7', 3, 0); "► a la celda B7 le añade 3 filas y 0 columnas"
	 * 			suma_fc({fila:3, columna:2}, 0, 1); "► a la celda fila = 2, columna = 1 le añade 0 filas y 1 columnas."
	 * 			suma_fc(5, 3, 0); "► a la celda situada en el indice 5 le añade 3 filas y 0 columnas"
	 */
	suma_fc(arg1='A0', plus_row = 0, plus_col = 0) {
		// Valida
		const indice = this.X_to_indice(arg1);
		if(indice === false) return false;
		
		const coordenada = this.X_to_fc(indice);		
		const row = coordenada.fila;
		const col = coordenada.columna;
		
		const new_row = row + (Number.isInteger(plus_row) ? plus_row : 0);
		const new_col = col + (Number.isInteger(plus_col) ? plus_col : 0);

		const new_celda = this.X_to_celda(new_row, new_col);
		return this.is_OK(new_celda) ? new_celda : false;

	}
	
}


// ◘◘◘◘◘◘
// ◘◘◘◘◘◘ PRUEBAS  CON RANGOS 
// ◘◘◘◘◘◘
/**
 ```javascript
 ▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️ PRUEBAS CON RANGOS
 
  ■ suma_fc (suma una fila o columna a partir de una celda)
 const celda_suma = this.W_R.suma_fc('C3', 0, 1); 
 const celda_suma_mat = this.W_R.suma_fc({fila:3, columna:2}, 0, 1); 
 if(celda_suma && celda_suma_mat) 
 	console.log(`▶️ SUMA_FC ► ${celda_suma} , SUMA_FC MATRICIAL► ${celda_suma_mat}`);
 
  ■■■■■■■■ PLUS() (suma un indice a una celda), devuelve celda, siempre da una celda ok dentro del rango excepto en los extremos.
 const celda1 = 'C3'; 
 const plus = 7;
 const celda_plus = this.W_R.plus(celda1, plus); 
 if(celda_plus) 
 	console.log(`▶️ PLUS celda: ${celda1} - plus: ${plus} ► ${celda_plus}`);
 
  ■■■■■■■■ RESERVAS-A-RANGOS()
 const rangos_reserva = this.W_R._reservas_a_rangos(dicc_api_foto.reservas);
 console.log(`▶️ RANGOS RESERVA ► \n${JSON.stringify(rangos_reserva)}`);
 
  ■■■■■■■■ LISTAR() - RANGOS CREADOS
 console.log(`▶️ RANGOS CREADOS \n ${this.W_R.listar()}`);
 
  ■■■■■■■■ GET_ITEMS() (Baldosas) (objetos myDivs)
 const elementos = this.W_R._get_items();
 if (elementos) console.log(`▶️ ELEMENTOS EN BALDOSAS ${Object.keys(elementos).length} elementos`);
  console.log(`ELEMENTOS EN BALDOSAS \n ${JSON.stringify(elementos)}`);
 
  ■■■■■■■■ GET_BOOLEAN_VALUES()
 const rango = 'rango_pares';
 let contenido = this.W_R?._get_boolean_values(rango, true);	 contenido es un diccionario {id_contenido:booleano,....}
 console.log(`▶️ DICC BOOLEANO DE RANGO '${rango}' ►\n  ${JSON.stringify(contenido)}`);
 
  ■■■■■■■■ VALUES - CONTENIDO
 contenido = this.W_R?._get_values(rango, false);			 contenido es un diccionario {id_contenido:booleano,....}
 console.log(`▶️ DICC CONTENIDO(EN BALDOSA) EN RANGO '${rango}' ►\n  ${JSON.stringify(contenido)}`);
 
  ■■■■■■■■ VALORES DE LAS CELDAS: 
 const celda = 'F0';
 contenido = this.W_R?._get_celda_value(celda);
 if(contenido){
 	console.log(`▶️ CELDA '${celda}' contenido id ► '${contenido.id}'`); ► 'mesa_0'
 }else{
 	console.log(`▶️ CELDA '${celda}' vacia :(`);
 }		
  ■■■■■■■■ contenido-to-celda-R
 const id_contenido = 'silla_7';
 const celda_de_contenido = 	this.W_R?._search_celda(id_contenido);
 console.log(`▶️ CONTENIDO '${id_contenido}' está en CELDA ► '${celda_de_contenido}'`);
 
  ■■■■■■■■ IS_R_VACIO??
 const es_vacio = this.eRdS?._is_vacio(rango);
 console.log(`▶️ RANGO '${rango}' está vacio? ► ${es_vacio}`);
 
  ■■■■■■■■ BUSCAR RANGO LIBRE
 const dimension = '4x5';
 const celda_inicio = 'A0';
 const rango_free = this.eRdS?._busca_dimension_free(dimension, celda_inicio);
 if (rango_free)
 	console.log(`✅ RANGO LIBRE en dimension ${dimension} , desde Celda ${celda_inicio} ► ${rango_free.celda_inicio} - ${rango_free.celda_fin}`);
 else
	 	console.log(`❌ NO HAY RANGO LIBRE en dimension ${dimension} , desde Celda ${celda_inicio}`);

  ■■■■■■■■ UNION / INTERSECCION
const celdas_union = RnG._get_union('rango_fila_0','rango_fila_1');
const celdas_intersección = RnG._get_interseccion('rango_columna_1','rango_fila_0');
const celdas_intersección_2 = RnG._get_interseccion('rango_columna_1','rango_columna_2');
const celdas_intersección_3 = RnG._get_interseccion('rango_columna_1','rango_columna_1');
console.log(`• CELDAS-UNION: ${celdas_union} ➿ ${RnG._is_continuos(celdas_union)}`);
console.log(`• CELDAS-INTERSECCION:${celdas_intersección} ➿ ${RnG._is_continuos(celdas_intersección)}`);
console.log(`• CELDAS-INTERSECCION NULL:${celdas_intersección_2} ➿ ${RnG._is_continuos(celdas_intersección_2)} `);

  ■■■■■■■  👀 ES RANGO CONTINUO??
RnG._is_continuos(celdas_union);

  ■■■■■■■  👀 ADD RANGO "A MANO"
RnG.registrar_ficha('rango_prueba', rango_from_reservas_bdd[0]);

  ■■■■■■■ 👻👻 Tengo un Fantasma!!!! 👻👻
  // Crea un rango solo con dimension, sin celda_inicio, ni celda_fin, me permite DINAMISMO. 
  // juega con to_pull para cargarlo de datos.
  // 
const nombre_ghost = this.crear_$marco({filas:3,columnas:4});
this.ghost_s[nombre_ghost];

 ▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️▶️ FIN PRUEBAS CON RANGOS
```
*/
/**
 * ### Centraliza el acceso a los distintos diccionarios de rangos.
 * ### Conserva las referencias originales: no copia ni transforma los rangos.
 * ### Las fuentes son los diccionarios: 'rangos', 'reservas', ... que se registran en "_Working_Rangos".
 * ### 'reservas' ... que se registra en "el_Rango_del_Salon".
 */
class Rango_Repository {
	constructor() {
		this.fuentes = {};
	}

	registrar_fuente(nombre_fuente, diccionario) {
		if (typeof nombre_fuente !== 'string' || nombre_fuente.trim() === '') return false;
		if (!diccionario || typeof diccionario !== 'object' || Array.isArray(diccionario)) return false;

		this.fuentes[nombre_fuente] = diccionario;
		return true;
	}

	/**
	 * @param {*} nombre_rango 
	 * @param {*} nombres_fuente ['rangos', 'reservas'] por ejemplo.
	 * @returns 
	 */
	obtener(nombre_rango, nombres_fuente = Object.keys(this.fuentes)) {
		if (typeof nombre_rango !== 'string' || nombre_rango.trim() === '') return null;

		for (const nombre_fuente of nombres_fuente) {
			const diccionario = this.fuentes[nombre_fuente];
			if (diccionario && Object.prototype.hasOwnProperty.call(diccionario, nombre_rango)) {
				return diccionario[nombre_rango];
			}
		}

		return null;
	}

	/** Crea un rango o reemplaza por completo uno existente. 
	 * const rango = this.rango_repository.guardar('rangos', 'nombre_rango', ficha);
	*/
	guardar(nombre_fuente, nombre_rango, rango) {
		const diccionario = this.fuentes[nombre_fuente];
		if (!diccionario || typeof nombre_rango !== 'string' || nombre_rango.trim() === '') return false;
		if (!rango || typeof rango !== 'object' || Array.isArray(rango)) return false;

		diccionario[nombre_rango] = rango;
		return rango;
	}

	/**
	 * ### Elimina un rango de un diccionario específico.
	 * @param {String} nombre_fuente nombre del diccionario (normalmente 'rangos' o 'reservas')
	 * @param {String} nombre_rango nombre del rango a eliminar (ejemplo: 'rango_fila_3')
	 * @returns la ficha del rango eliminado o null si no existe.
	 */
	eliminar(nombre_fuente, nombre_rango) {
		const diccionario = this.fuentes[nombre_fuente];
		if (!diccionario || !Object.prototype.hasOwnProperty.call(diccionario, nombre_rango)) return null;

		const rango = diccionario[nombre_rango];
		delete diccionario[nombre_rango];
		return rango;
	}

	/**
	 * ### Obtiene un diccionario de rangos por su nombre.
	 * @param {String} nombre_fuente nombre del diccionario (normalmente 'rangos' o 'reservas')
	 * @returns {Object|null} el diccionario de rangos o null si no existe.
	 */
	obtener_fuente(nombre_fuente) {
		return this.fuentes[nombre_fuente] || null;
	}

	/**
	 * ### Obtiene el nombre de la fuente dado su diccionario.
	 * @param {Object} diccionario 
	 * @returns {String|null} el nombre de la fuente o null si no se encuentra.
	 */
	obtener_nombre_fuente(diccionario) {
		for (const [nombre, fuente] of Object.entries(this.fuentes)) {
			if (fuente === diccionario) return nombre;
		}
		return null;
	}
}

/** */
class Working_Rangos  extends Working_Celdas{
        // ■■
        // * C L A S E  "Rango"
        // ■■
        constructor(instancia_matriz_plana = null) {			
			if (!instancia_matriz_plana) return null;
			
			// ■■
			super(instancia_matriz_plana);	
			// ■■ rango_fila_3: {celda_inicio:'A3',celda_fin:'H3',dimension:'1x8',geo:{*},items:{*},values:{*}}
			
			this.d_rangos = {};							
			// ■■ rango_repository se encarga de los diccionarios de rangos y rangos-reservas.
			this.rango_repository = new Rango_Repository();
			this.rango_repository.registrar_fuente('rangos', this.d_rangos);
			
			// ■■ Inicializa los rangos FIX y los registra en this.d_rangos.
			this._init_rangos_basicos(true, true, true);
        }
		
		/** ### Crea nombre secuencial del nombre_rango. Empieza la cuenta en rango_0  */
		_get_nombre_rango(nombre_rango, dicc_to_read=null){
			if(!nombre_rango) nombre_rango = 'rango';
			if (dicc_to_read==null) {
				dicc_to_read = this.d_rangos;			
			}
			nombre_rango = nombre_rango.trim();               
			const nombres_existentes = Object.keys(dicc_to_read);				
			
			let indice = 0;
			let candidato = nombre_rango+'_0';
			
			while (nombres_existentes.includes(candidato)) {
				candidato = `${nombre_rango}_${indice}`;
				indice += 1;
			}
			return candidato;
		}

		/** ### devuelve las coordenadas de la celda fin en {fila, columna}	 */
        _get_celda_fin(celda_inicio, dimension) {
			try {
				const inicio = this._celda_to_fc(celda_inicio);
				const dimension_fc = this._normalizar_dimension(dimension);
				if (!inicio || !dimension_fc) return null;
				const fin = {
					fila: inicio.fila + dimension_fc.filas - 1,
					columna: inicio.columna + dimension_fc.columnas - 1
				};
				return this._celda_to_fc(fin);				
			} catch (error) {
				return null;
			}			
        }
		
		/**
         * ### Devuelve la [ dimensión ] entre dos celdas en formato 'string' u 'object' {filas:int,columnas:int}
         * ### • 'celda_inicio' {String} y celda_fin {String} ► 'A0', 'B2', 'H0', 'M4', ...
         * ### • 'is_str' {Boolean} si es true devuelve la dimensión como cadena "filasxcolumnas". si false devuelve un objeto {filas:int, columnas:int}
		 * ```javascript
		 * const dim_str = this._get_dimension('B2', 'D4');  ► "3x3"
		 * const dim_obj = this._get_dimension('B2', 'D4', false); ► { filas: 3, columnas: 3 }
		 * const dim_obj = this._get_dimension('B2000', 'D4', false); ► null (celda inválida)
		 * ```   */
        _get_dimension(celda_inicio = 'A0', celda_fin = 'A0', b_get_str = true) { 
			try {
				const inicio = this._celda_to_fc(celda_inicio);
				const fin = this._celda_to_fc(celda_fin);
	
				if (!inicio || !fin) return null;
				if (!this._celda_OK(inicio) || !this._celda_OK(fin)) return null;
				// VARIABLES DE RETORNO
				const filas = Math.abs(fin.fila - inicio.fila) + 1;
				const columnas = Math.abs(fin.columna - inicio.columna) + 1;
				const dimension = { filas, columnas };
				// RETORNO
				return b_get_str ? `${filas}x${columnas}` : dimension;				
			} catch (error) {
				return null;
			}               
        }
		/** ### Crea un nuevo rango en el sistema 🌡️🌡️🌡️🌡️
		 * ### Retorna el rango creado o null si hay error	 */  
		crear_rango(nombre_rango = '', celda_inicio = 'A0', dimension = '1x1') {
			if (typeof nombre_rango !== 'string' || nombre_rango.trim() === '') {
				nombre_rango = this._get_nombre_rango('rango', this.d_rangos);
			}
				
			const ficha = this._crear_ficha_rango(celda_inicio, dimension);
			if (!ficha) return null;

			const rango = this.rango_repository.guardar('rangos', nombre_rango, ficha) || null;
			return rango;
		}

		/**
		 * ### Devuelve un rango.	
		 * @param {string} nombre_rango - El nombre del rango a leer.
		 * @param {Array<string>} dicc_to_read - Una lista de diccionarios  a leer.
		 * @returns {Object|null} - El rango encontrado o null si no se encuentra.
		 */
		read_rango(nombre_rango , dicc_to_read = null) {
			if (!nombre_rango) return null;
			if(!dicc_to_read) dicc_to_read = 'rangos';
			const rango = this.rango_repository.obtener(nombre_rango, [dicc_to_read]) || null;
			return rango;
        }		
		
			
		/**
		 * ### Elimina un rango de this.dicc_rangos_	 
		 * ### Retorna el rango eliminado o null si hay error*/
		eliminar_rango(nombre_rango, dicc_to_delete = null) {
			if (!nombre_rango) return null;
			const nombre_fuente = dicc_to_delete === null
				? 'rangos'
				: this.rango_repository.obtener_nombre_fuente(dicc_to_delete);
			return nombre_fuente
				? this.rango_repository.eliminar(nombre_fuente, nombre_rango)
				: null;
        }		

		/**
		 * ### Devuelve el contenido de this.dicc_rangos_ 
		 * console.log(`◘ RANGOS CREADOS \n ${this.eRdS.listar()}`);
		 */
        listar(dicc_to_list) {
			if(!dicc_to_list) dicc_to_list = this.d_rangos;
			console.log( JSON.stringify(dicc_to_list, 2) );
        }

		/** ## Carga los valores 'desde' matriz_principal 'hasta' el Rango.values 
		 * ### Es conveniente hacer to_pull__ antes de operar con la propiedad 'values' del Rango porque el rango
		 * ### cuando se crea obtiene los valores de la matriz, pero [NO se actualiza]. to_pull__ corrige esto.
		 * ```javascript
		 * const valores = this._matriz_to_rango_('rango_matriz'); ► Actualiza d_rangos['rango_matriz'].values
		 * console.log(valores); ► {A0:'silla_0', A1:'mesa_0', B1:'silla_1'}
		 * ``` */
		to_pull(nombre_rango, show_all=true){
			try {
				const rango_en_d = this.read_rango(nombre_rango);
				if(!rango_en_d) throw(`Rango: ${nombre_rango} Not Found`)
				
				// Obtiene los valores de la matriz(hijos??).
				values_rango = this._get_values(nombre_rango , show_all);					
				// Reasignación para obtener los datos actualizados. 
				rango_en_d.values = values_rango || {};				

				return values_rango;			
			} catch (error) {
				console.log(error);
			}
		}	

		/** ### Hace pull a todos los Rangos Registrados */
		pull_all(){
			Object.keys(this.d_rangos).forEach(nombre_rango => { this.to_pull(nombre_rango); });
		}	
		
		/** ## Crea una entrada directa a d_rangos con la ficha. 
		 * ### • nombre_rango (string) ► nombre del rango. Si ='', crea un nombre 'rango_X' único para el rango.
		 * ### • ficha ► es una ficha-rango completa.
		 * ### ■ devuelve 'nombre_rango' si se completó con exito y false si no se completó con exito. 	*/
		registrar_ficha(nombre_rango, ficha){
			if(ficha && ficha.celda_inicio && ficha.celda_fin && ficha.geo && ficha.items  ){		
				if(!nombre_rango || typeof nombre_rango != 'string' || nombre_rango.trim() === ''){
					nombre_rango = this._get_nombre_rango('rango', this.d_rangos);
				}
				const rango = ficha;
				return this.rango_repository.guardar('rangos', nombre_rango, rango) ? nombre_rango : false;
			}		
		}

		/**
		 * ### Devuelve el elemento_div de la baldosa que corresponde a una celda.
		 * @param {string} celda Referencia de celda, por ejemplo: 'B0', 'C3' o 'H15'.
		 * @returns {HTMLElement|null} El div de la baldosa o null si la celda no es válida.
		 */
		celda_to_baldosa(celda){
			if (typeof celda !== 'string') return null;

			const indice = this.X_to_indice(celda);
			if (indice === false) return null;

			return this.ref_Salon?.matriz_plana?.[indice]?.elemento_div ?? null;
		}

		/** ## Hace una Copia de un rango registrado. 
		 * ### Devuelve el nuevo rango si ok y null si algo va mal. */
		_copy_rango(nombre_rango, new_nombre_rango, diccionario_to_inspect){
			// ┌• Seleccionamos el rango sobre el que trabajar.
			if (!diccionario_to_inspect)  diccionario_to_inspect = this.d_rangos;					
			// ┌• Valida si existe en this.d_rangos.
			const rango_a_copiar = this.read_rango(nombre_rango);
			if (!rango_a_copiar) return null;

			//┌• Asigno el rango de uno al Nuevo Rango.
			diccionario_to_inspect[new_nombre_rango] = rango_a_copiar;	

			//
			return diccionario_to_inspect[new_nombre_rango];
		}

		
		
		/**
		 * ### Genera los rangos FIXED solicitados: Filas, Columnas, Matriz.
		 * ### Se debe llamar tras crear la matriz o si cambian sus dimensiones drásticamente.
		 * @param {Boolean} b_rango_matriz , true, crea rango_matriz 
		 * @param {Boolean} filas , true, crea rango_fila_[0,1,2...]  , un rango_fila por cada fila de la matriz_plana. 
		 * @param {Boolean} columnas , true, crea rango_columna_[0,1,2...]  , un rango_fila por cada columna de la matriz_plana. 
		 */
		_init_rangos_basicos(b_rango_matriz=true, filas=true, columnas = true) {
			const MatriZ = this.ref_Salon.matriz_plana;
			if (MatriZ.length === 0) return;
			const { filas: total_filas, columnas: total_cols } = this.ref_Salon.get_dimension_matriz();
			const ultimo_indice = MatriZ.length - 1;

			// ┌■ RANGO MATRIZ COMPLETA ... Desde (0,0) hasta la última celda real ocupada
			if (b_rango_matriz) {
				const celda_i = this.X_to_celda(0, 0);
				const celda_f = this.X_to_celda(ultimo_indice);
				const dimension = this._get_dimension(celda_i, celda_f);
				this.crear_rango('rango_matriz', celda_i, dimension, true);
			}
			
			// ┌■ RANGOS POR COLUMNA
			if (columnas) {
				for (let c = 0; c < total_cols; c++) {
					const inicio = this.X_to_celda(0, c);
					let fin = inicio;
					for (let f = total_filas - 1; f >= 0; f--) {
						const indice = this.X_to_indice(f, c);
						if (indice !== false) {
							fin = this.X_to_celda(indice);
							break;
						}
					}
					// guardar_rango(`rango_columna_${c}`, inicio, fin);
					
					const dimension = this._get_dimension(inicio, fin);
					this.crear_rango(`rango_columna_${c}`, inicio, dimension, true);
				}
			}
			
			// ┌■ RANGOS POR FILA
			if (filas) {
				for (let f = 0; f < total_filas; f++) {
					const inicio = this.X_to_celda(f, 0);
					let fin = inicio;
					
					for (let c = total_cols - 1; c >= 0; c--) {
						const indice = this.X_to_indice(f, c);
						if (indice !== false) {
							fin = this.X_to_celda(indice);
							break;
						}
					}
					const dimension = this._get_dimension(inicio, fin);
					this.crear_rango(`rango_fila_${f}`, inicio, dimension, true);
				}
			}

			
			// ■ Log
			console.log("​​​🧩​ Rangos Básicos ​Generados  • • • ✔️   listar() para ver");
			
	}

	/** ## Obtiene una Matriz relativa a un Rango que contiene la geometría del rango. . . 
	 * Usada en  {@link crear_rango}  para la formación de un rango.
	 * ```javascript
	 * { 
	 * 'A0': { fila: 0, columna: 0, delta_y: 0, delta_x: 0 },
	 * 'B0': { fila: 0, columna: 1, delta_y: 0, delta_x: 1 },
	 * 'C0': { fila: 0, columna: 2, delta_y: 0, delta_x: 2 }, . . . }
	 * ```
	 */
	_get_geo(nombre_rango = '') {
		// ┌• Si 'nombre_rango' entra vacio el rango es toda la matriz.
		if (!nombre_rango || typeof nombre_rango !== 'string') nombre_rango = 'rango_matriz';
		// ┌• Y lo valido:
		const rango = this.read_rango(nombre_rango);
		if (!rango) return null;
		// Cacho los datos que necesito para recorrer el bucle
		const fc_i = this._celda_to_fc(rango.celda_inicio);
		const fc_f = this._celda_to_fc(rango.celda_fin);
		if (!fc_i || !fc_f) return null;

		// ┌• Preparo el parametro de retorno y recorro el bucle:
		let dicc_retorno = {};		
		for (let fila = fc_i.fila; fila <= fc_f.fila; fila++) {
			for (let columna = fc_i.columna; columna <= fc_f.columna; columna++) {
				const celda = this._fc_to_celda(fila, columna);
				const ficha_geo = {
					// fila: fila,
					// columna: columna,
					delta_y: fila - fc_i.fila,
					delta_x: columna - fc_i.columna
				};
				dicc_retorno[celda] = ficha_geo
			}
		}

		return dicc_retorno;
	}

	/**
	 * ## Devuelve un diccionario {celda:myDiv}  con los objetos myDivs (Baldosas) del rango solicitado. 
	 * ### • Si una celda no tiene elemento asociado en this.matriz_plana se devuelve null.
	 * @param {String} nombre_rango Nombre del rango sobre el que vamos a trabajar.
	 * ```javascript
	 * const elementos = this.eRdS._get_items_(); ► ► {A0:myDiv, A1:myDiv, A2:myDiv, B0:myDiv, . . . ,H14:myDiv }
	 * const elementos_2 = this.eRdS._get_items_('rango_fila_2'); ► {B0:myDiv, B1:myDiv, B2:myDiv, C0:myDiv, . . . }
	 * ```	 */
	_get_items(nombre_rango = '', b_get_mydiv=false) {
		
		const MatriZ = this.ref_Salon.matriz_plana;

		if (!nombre_rango || typeof nombre_rango != 'string') 
			nombre_rango = 'rango_matriz';

		const rango_en_d = this.read_rango(nombre_rango.trim());
		if (!rango_en_d) return null;
		
		// ┌■■ Rangos rectangulares
		const inicio = this._celda_to_fc(rango_en_d.celda_inicio);
		const fin = this._celda_to_fc(rango_en_d.celda_fin);

		if (!inicio || !fin) return null;

		const fila_inicio = Math.min(inicio.fila, fin.fila);
		const fila_fin = Math.max(inicio.fila, fin.fila);
		const col_inicio = Math.min(inicio.columna, fin.columna);
		const col_fin = Math.max(inicio.columna, fin.columna);

		const resultado = {};

		for (let fila = fila_inicio; fila <= fila_fin; fila++) {
			for (let col = col_inicio; col <= col_fin; col++) {
				const celda = this._fc_to_celda(fila, col);
				const indice = this.X_to_indice(fila, col);
				// ┌• Si el indice es false, la celda no pertenece a la matriz y devuelve null.
				// ┌• Si el indice es válido, devuelve el elemento myDiv o null si no existe.
				const elemento = (indice === false) ? null : (MatriZ[indice] ?? null);

				if(b_get_mydiv){
					// ┌• Meto el objeto myDiv 
					resultado[celda] = elemento;
				}else{
					// ┌• Meto el id del elemento. (A0:'gran_salon_0')
					resultado[celda] = elemento.elemento_div.id;
				}	
			}
		}

		return resultado;
	}
	/**
	 * ### • Devuelve un dicc con el 'id del contenido' o el elemento en cada celda del rango.
	 * ### • Las celdas sin contenido devuelven false y las que no existen, null.
	 * ### • NOTA: b_get_elemento = true para los elementos ghost, no para los rangos ordinarios.
	 * ### • ES UN METODO FUNDACIONAL DE LOS 'RANGOS'
	 * @param {String} nombre_rango Nombre del rango del que queremos contenido.
	 * @param {Boolean} b_show_all Indica si se muestran todas las celdas (true) o solo las que tienen contenido (false).
	 * @param {Boolean} b_get_elemento true=devuelve el elemento y no el id. false=devuelve el id no el elemento.
	 * [RETORNO] diccionario o null si el rango no existe.
	 * ```javascript
	 * 1) const pares = this._get_values('rango_pares', false); // ►{E0:"mesa_9",G1:"silla_12",G2:"mesa_22",G3:"silla_5",C6:"silla_1"}
	 * 2) const nones = this._get_values('rango_nones', true); //  ►{A0:false,C0:false,E0:"mesa_9",G0:false,A1:false,C1:false,E1:false,...
	 * 3) const values = this._get_values('rango_1', false, true); // ► { A0:<element>,B0:<element>,E0:<element>, . . . }
	 * 4) const values = this._get_values('rango_1', true, true);  // ► { A0:<element>,A1:false,A2:false, B0:<element>, . . . }
	 * 5) const values = this._get_values('rango_1'); //  ► { A0:'silla_0',A1:false,A2:false, B0:'mesa_0', . . . }
	 * ```	 */
	_get_values(nombre_rango = '', b_show_all = true, b_get_elemento=false) {
		const dicc_celda_idbaldosa = this._get_items(nombre_rango);
		if (!dicc_celda_idbaldosa) return null;
		const d_values = {};
		for (const [celda, id_baldosa] of Object.entries(dicc_celda_idbaldosa)) {
			if (!id_baldosa) {
				d_values[celda] = false;
				continue;
			}
			const baldosa = document.getElementById(id_baldosa);
			if(!baldosa) continue;
			const el_sobre_ella = baldosa?.firstElementChild;
			if (b_show_all == true) {
				d_values[celda] = el_sobre_ella instanceof HTMLElement ? (el_sobre_ella?.id) : false;							
			}else if (b_show_all == false) {
				if (el_sobre_ella instanceof HTMLElement) {
					if(b_get_elemento)
						d_values[celda] = el_sobre_ella;
					else
						d_values[celda] = el_sobre_ella.id;
				}
			}
		}
		return d_values;
	} 

	// ◘◘◘◘
	// ◘◘◘◘ FUNCIONES DE RANGOS 
	// ◘◘◘◘
	/**
	 * ## Informa si cada celda de un rango tiene contenido dentro del objeto myDiv.
	 * ### • Si la celda no pertenece a la matriz devuelve null en su lugar.
	 * @param {String} nombre_rango Nombre del rango a recuperar.
	 * @param {Boolean} b_show_all true, Indica si se muestran todas las celdas del rango | false devuelve solo las celdas que tienen contenido.
	 * @returns {Object|null} Diccionario { celda: true|false } | null si el rango no existe.
	 * ```javascript
	 * let contenido = this._get_boolean_values(rango, false); ►{"E0":true,"G1":true,"G2":true,"G3":true,"C6":true}
	 * contenido = this._get_boolean_values(rango, true);  ►{"A0":false,"C0":false,"E0":true,"G0":false,"A1":false,"C1":false,"E1":false,...
	 */
	_get_boolean_values(nombre_rango = '', b_show_all = true) {
		const dicc_celda_idbaldosa = this._get_items(nombre_rango);
		if (!dicc_celda_idbaldosa) return null;
		const resultado = {};
		for (const [celda, id_baldosa] of Object.entries(dicc_celda_idbaldosa)) {
			if (id_baldosa === null) {
					resultado[celda] = null;
					continue;
			}
			const baldosa = document.getElementById(id_baldosa);
			if(!baldosa) continue;
			const nodo = baldosa?.elemento_div;
			if (b_show_all == true) {
				resultado[celda] = nodo instanceof HTMLElement ? nodo.childElementCount > 0 : false;
			}else if (b_show_all == false) {
				if (nodo.childElementCount > 0) resultado[celda] = true;				
			}
		}
		return resultado;
	}

	/**
	 * ### Devuelve el contenido (primer hijo) de la celda indicada o null si está vacía o no existe.
	 * @param {String} celda Nombre de la celda en cualquier notación válida heredada de Working_Celdas.
	 * @returns {HTMLElement|null} id del elemento contenido en la celda o null si no hay contenido o la celda no pertenece a la matriz.
	 * @example contenido = this._get_value_celda_('B7'); 	► 'silla_3'
	 */
	_get_celda_value(celda = '') {
		if (!celda || typeof celda !== 'string') return null;

		const indice = this.X_to_indice(celda);
		if (indice === false) return null;

		const myDiv = this.matriz_plana?.[indice];
		if (!myDiv || !myDiv.elemento_div) return null;

		const contenido = myDiv.elemento_div.firstElementChild;
		return contenido instanceof HTMLElement ? contenido : null;
	}

	/**
	 * ### Busca un id de contenido dentro de la matriz y devuelve la celda donde se encuentra.
	 * @param {String} id_contenido Identificador del contenido a localizar.
	 * @returns {String|null} Celda en formato "A0", "B7"... o null si no se encuentra.
	 */
	_search_celda(id_contenido = '') {
		if (!id_contenido || typeof id_contenido !== 'string') return null;
		const buscado = id_contenido.trim();

		const MatriZ = this.ref_Salon.matriz_plana;		

		if (!Array.isArray(MatriZ) || MatriZ.length === 0) return null;
		for (let i = 0; i < MatriZ.length; i++) {
			const myDiv = MatriZ[i];
			if (!myDiv || !myDiv.elemento_div) continue;
			const contenido = myDiv.elemento_div.firstElementChild;
			if (contenido instanceof HTMLElement && contenido.id === buscado) {
				return this.X_to_celda(i);
			}
		}
		return null;
	}
	
	/**
	 * ### Indica si todas las celdas del rango están vacías (sin id de contenido).
	 * @param {String} nombre_rango Nombre del rango a comprobar.
	 * @returns {Boolean|null} true si todas las celdas son null, false si hay algún id, null si el rango no existe.
	 * @example const isEmpty = this._is_vacio('rango_libre'); ► true = vacio | false = con contenido | null = rango no existe
	 */
	_is_vacio(nombre_rango = '') {
		const contenidos = this._get_values(nombre_rango);
		if (!contenidos) return null;
		return Object.values(contenidos).every((valor) => valor === false);
	}

	/**
	 * ### "Busca, el primer rango-free (sin hijos) de 'esta' dimensión, a partir de 'esta' celda".
	 * @param {String} dimension Texto con formato 'filasXcolumnas' (por ejemplo, '3x4').
	 * @param {String} celda_inicio Celda desde la que comenzar la búsqueda (por ejemplo, 'C2').
	 * ### Coordenadas de inicio y fin del rango libre, o null si no se encuentra.
	 * ```javascript 
	 * const rango_free = this._busca_dimension_free('3x4', 'C2'); ► { celda_inicio: 'D4', celda_fin: 'F6'
	 * ``` 	 */
	_busca_dimension_free(dimension = '', celda_inicio = 'A0') {
			// ■ Obtiene dimensiones del rango y celda de inicio en formato fila/columna
			const dimension_fc = this?._normalizar_dimension(dimension);
			const coord_ci = this?._celda_to_fc(celda_inicio);
	
			// ■ Valida datos
			if (!dimension_fc || !coord_ci) return null;
	
			// ■ Cacha totales de la clase matriz_plana (ref_matriz_plana)
			// const total_filas 	 = this.ref_Salon.total_filas();
			// const total_columnas = this.ref_Salon.columnas;
			const { total_filas, total_columnas } = this.ref_Salon.get_dimension_matriz();
	
			// ■ Valida dimension
			if (!Number.isInteger(total_filas) || !Number.isInteger(total_columnas)) return null;
			if (dimension_fc.filas <= 0 || dimension_fc.columnas <= 0) return null;
			if (dimension_fc.filas > total_filas || dimension_fc.columnas > total_columnas) return null;
	
			// ■ Proceso_Busqueda: Recorre todas las posibles posiciones de inicio del bloque
			for (let fila = coord_ci.fila; fila <= total_filas - dimension_fc.filas; fila++) {
				const columna_inicio = fila === coord_ci.fila ? coord_ci.columna : 0;
				for (let columna = columna_inicio; columna <= total_columnas - dimension_fc.columnas; columna++) {
					if (this.__es_bloque_libre(fila, columna, dimension_fc.filas, dimension_fc.columnas)) {
						const celda_i = this._fc_to_celda(fila, columna);
						const celda_f = this._fc_to_celda(fila + dimension_fc.filas - 1, columna + dimension_fc.columnas - 1);
						return { celda_inicio: celda_i, celda_fin: celda_f };
					}
				}
			}
			// ■ Si no se encuentra ningún bloque libre, devuelve null
			return null;
	}

	/**
	 * ### Recorre el rango pasado como argumento y comprueba si todas las celdas estan vacias. 
	 * ### usado en {@link _busca_dimension_free}
	 * @param {*} fila_inicio fila de la celda de inicio del rango.
	 * @param {*} columna_inicio columna de la celda de inicio del rango.
	 * @param {*} dim_rows altura del rango (número de filas).
	 * @param {*} dim_cols num_cols del rango (número de columnas).
	 * @returns true, si todas las celdas del rango estan vacias, false si alguna tiene contenido o no existe.
	 * ```javascript
	 * const is_free = this.__es_bloque_libre_(2, 3, 4, 5); ► true|false
	 * ```
	 */
	__es_bloque_libre(fila_inicio = 0, columna_inicio = 0, dim_rows = 1, dim_cols = 1) {
		// ┌•• Cachamos la MatriZ
		const MatriZ = this.ref_Salon.matriz_plana;

		if (dim_rows <= 0 || dim_cols <= 0) return false;

		for (let fila = fila_inicio; fila < fila_inicio + dim_rows; fila++) {
			for (let columna = columna_inicio; columna < columna_inicio + dim_cols; columna++) {
				// 1. Obtener índice matricial
				const indice = this.X_to_indice(fila, columna);
				if (indice === false) return false;
				// 2. Obtener el objeto MyDiv directamente de la referencia a la matriz
				const myDiv = MatriZ[indice];					
				// 3. Chequeo: Si encontramos UNA sola celda ocupada o inválida, el bloque no sirve.					
				const is_myDiv_vacio = Boolean(myDiv.elemento_div.children.length === 0);
				if (!is_myDiv_vacio) 
					return false; 				
			}
		}
		return true;
	}	
	/**
	 * ### Verifica de manera agnóstica si una baldosa (MyDiv) está vacía.
	 * ### Se considera vacía si el elemento DOM asociado no tiene hijos (Elementos HTML).
	 * @param {MyDiv} myDiv - El objeto de la estructura de datos (matriz_plana[i]).
	 * @returns {Boolean} true si está vacía, false si tiene contenido (mesa/silla) o error.
	 */
	_is_myDiv_vacio(myDiv) {
		// 1. Validaciones de seguridad (KISS: si no existe, no está vacía, es un error)
		if (!myDiv || !myDiv.elemento_div) return false;

		// 2. Comprobación de contenido DOM.
		// Usamos 'children.length' en lugar de 'hasChildNodes()'.
		// ¿Por qué? 'hasChildNodes' devuelve true si hay saltos de linea (texto vacío).
		// 'children' solo cuenta Elementos HTML (<div>, <img>, etc), que es lo que nos importa (Mesas/Sillas).
		return Boolean(myDiv.elemento_div.children.length === 0);
	}

	/** ## Devuelve: celda_i | celda_f | geo.delta_x | geo.delta_y | dimension.filas | dimension.columnas | celdas_valor | celdas_baldosa */
	__print_all_info(nombre_rango){
		const rango = this.read_rango(nombre_rango);
		if(!rango) return null;
		const ficha = {
			celda_inicio:rango.celda_inicio,
			celda_fin:rango.celda_fin,
			dimension: {filas: rango.dimension.filas, columnas:rango.dimension.columnas},
			geo: {delta_x: rango.geo.delta_x, delta_y: rango.geo.delta_y},
			values: rango.values,
			items: rango.items,			
		}
		console.log(`${ficha.celda_inicio}`)
	}

	/** 
	 * ## Genera y Devuelve una ficha de cada reserva, aportando informacion de RANGOS. Fase Previa de RE-POSICIONAR.
	 * ### • Crea rangos temporales (prev_X) y calcula geometría relativa ( delta ).
	 * ### • (delta) = distancia desde la esquina superior izquierda del rango temporal y el elemento. Esto permite reposicionar los elementos en su posicion-original.
	 * @param {Array} foto_reservas Array-json de objetos reserva [{mesas:[], sillas:[]}]
	 * {@link api_re_posicionar}
	 * ```javascript
	 * [ { nombre_rango: "prev_0", num_rows: 1, num_cols: 2, 
	 *	items: [
	 *	{id: "mesa_0", elemento_dom: {},delta_y: 0, delta_x: 1,},
	 *	{id: "silla_1",elemento_dom: {},delta_y: 0,delta_x: 0,},  ], },
	 *	{ nombre_rango: "prev_1", num_rows: 1,num_cols: 3,
	 *	items: [
	 *	{id: "silla_2",elemento_dom: {},delta_y: 0,delta_x: 0,},
	 *	{id: "silla_0",elemento_dom: {},delta_y: 0,delta_x: 1,},
	 *	{id: "silla_3",elemento_dom: {},delta_y: 0,delta_x: 2,},  ] , } , ]
	 * ``` */
	_get_geometria_relativa(foto_reservas) {
		const arr_retorno = [];

		foto_reservas.forEach((reserva, i) => {
			
			// ┌• Cacho todos los IDs de la reserva			
			const reservadores = Array.isArray(reserva?.reservadores) ? reserva.reservadores : [];
			const clientes = Array.isArray(reserva?.clientes) ? reserva.clientes : [];
			const ids_items = [...reservadores, ...clientes].filter(Boolean);
			if (ids_items.length === 0) return [];

			// ┌••   •••••••••••••  •••••••••••••••••••
			// ┌■■ Caso especial: reservas sin mesas. Las sillas se agrupan en línea
			// para compactar la geometría y facilitar el re_posicionamiento.
			if (reservadores.length === 0 && clientes.length > 0) {
				const items_geometria = [];
				clientes.forEach((id, index) => {
					const elemento_dom = document.getElementById(id);
					if (!elemento_dom) return [];
					items_geometria.push({
						id: id,
						elemento_dom: elemento_dom,
						delta_y: 0,
						delta_x: index
					});
				});

				if (items_geometria.length === 0) return [];
				arr_retorno.push({
					nombre_rango: `rango_temp_${i}`,
					num_rows: 1,
					num_cols: items_geometria.length,
					items: items_geometria
				});
				return [];
			}

			// ┌••   •••••••••••  •••••••••••••••••••
			// ┌■■ Caso normal: Reservas Rectangulares.
			// ┌•• Calcular Mínimos y Máximos para definir el rango
			let minF = Infinity, maxF = -Infinity, minC = Infinity, maxC = -Infinity;
			const elementos_con_coordenadas = [];
			
			// ┌•• Recolectar coordenadas 
			ids_items.forEach(id => {
				// ┌•• Clase Rango para consultar la celda. Si la matriz está vacía, no se procesa.
				const celda = this._search_celda(id); 
				if (celda) {
					const fc = this._celda_to_fc(celda);
					if (fc.fila < minF) minF = fc.fila;
					if (fc.fila > maxF) maxF = fc.fila;
					if (fc.columna < minC) minC = fc.columna;
					if (fc.columna > maxC) maxC = fc.columna;
					
					// Guardamos temporalmente la celda original para el mapa invertido posterior
					elementos_con_coordenadas.push({id, celda, fc});
				}
			});

			// ┌•• Si no encontramos coordenadas para NINGÚN elemento (salón limpio), SALIMOS	
			if (elementos_con_coordenadas.length === 0) return [];

			// ┌•• Crear Rango Temporal 'prev_i' y obtener el mapa invertido
			const nombre_rango = `rango_temp_${i}`;
			
			// ┌•• Los elementos ya tienen coordenadas. Creamos el mapa invertido
			const mapa_invertido = {};
			elementos_con_coordenadas.forEach(item => {
				mapa_invertido[item.id] = item.celda;
			});
			
			// ┌•• ••••••••                       •••••
			// ┌■■ Calcular posiciones relativas (Deltas) 🧠🧠
			const items_geometria = [];			
			ids_items.forEach(id => {
				const celda_original = mapa_invertido[id]; 
				const elemento_dom = document.getElementById(id); // Referencia viva al DOM

				if (celda_original && elemento_dom) {
					// ┌•• Usamos la celda original para calcular el delta
					const fc_item = this._celda_to_fc(celda_original);
					
					// ┌•• Calculamos el Delta (Distancia desde la esquina superior izquierda del rango)
					const delta_y = fc_item.fila - minF;
					const delta_x = fc_item.columna - minC;

					items_geometria.push({
						id: id,
						elemento_dom: elemento_dom,
						delta_y: delta_y,
						delta_x: delta_x
					});
				}
			});

			// ┌■■  Ficha GEOMETRÍA RELATIVA ♟️
			arr_retorno.push({
				nombre_rango: nombre_rango,
				num_rows: (maxF - minF) + 1,
				num_cols: (maxC - minC) + 1,
				items: items_geometria
			});
		});		
		// console.log(" ▶️ Geometría PREV:", arr_retorno);
		return arr_retorno;
	}	

	/** ## Devuelve un array de los nombres de las celdas de un rango RECTANGULAR 
	 * * @param {String} nombre_rango  'rango_matriz', 'rango_fila_2', etc.
	*/
	_get_celdas(nombre_rango = 'rango_matriz'){
		if(String(nombre_rango).trim() === '') 
			return [];
		
		// ┌• Valida si existe en this.d_rangos.
		const rango = this.read_rango(nombre_rango);
		if (!rango) return null;
		
		// ┌• Obtiene las celdas ya asociadas a la ficha.
		if (rango?.items && typeof rango.items === 'object') {
			return Object.keys(rango.items);
		}
		
		// ┌• X Si viene como nombre del rango
		const items = this._get_items(nombre_rango);
		return items ? Object.keys(items) : null;
	}	

	/**	### Entra un 'array de nombres de celda' y devuelve el menor izquierdo y el mayor derecho 
	 * ### No tiene en cuenta si las celdas son contiguas o si forman un rango rectangular o array.
	 * ### return {celda_inicio, celda_fin} || {};
	 */
	__get_cicf_from_celdas(array_celdas){
		const ficha = this._get_ficha_vacia();
		
		// ■ Reserva con mesas: calculo el rango que abarca todas sus celdas.
		let minFila = Infinity; let maxFila = -Infinity; let minCol = Infinity; let maxCol = -Infinity;

		// ┌■ LOCALIZANDO LOS 'BORDES' DE LA CAJA: 
		// ┌• (minFila, minCol) = celda superior izquierda 
		// ┌• (maxFila, maxCol) = celda inferior derecha
		array_celdas.forEach(celda => {
			const fc = this._celda_to_fc(celda);
			if (!fc) return;
			if (fc.fila < minFila) minFila = fc.fila;
			if (fc.fila > maxFila) maxFila = fc.fila;
			if (fc.columna < minCol) minCol = fc.columna;
			if (fc.columna > maxCol) maxCol = fc.columna;
		});
		if (!Number.isFinite(minFila) || !Number.isFinite(minCol)) return;
		const celda_inicio = this._fc_to_celda(minFila, minCol);
		const celda_fin = this._fc_to_celda(maxFila, maxCol);
		const dimension = this._get_dimension(celda_inicio, celda_fin, false);
		if(celda_inicio && celda_fin && dimension) 
			return {celda_inicio, celda_fin};
		else
			return {};
	}

	/** ## De una celda-inicio y celda-fin conseguimos la dimensión y devolvemos un 'rango continuo' del Salon */
	_get_rango_from_cicf(celda_inicio = 'A0', celda_fin = 'C4'){
		const dimension = this._get_dimension(celda_inicio, celda_fin, false);
		return dimension ? this._crear_ficha_rango(celda_inicio, dimension) : null;
	}

	/**
	 * Construye una ficha completa sin registrarla en ningún diccionario.
	 * Lee la matriz actual para completar items y values, pero no modifica el estado.
	 */
	_crear_ficha_rango(celda_inicio = 'A0', dimension = '1x1') {
		const ini_fc = this._celda_to_fc(celda_inicio);
		const fin_fc = this._get_celda_fin(celda_inicio, dimension);
		if (!ini_fc || !fin_fc) return null;

		const celda_fin = this._fc_to_celda(fin_fc.fila, fin_fc.columna);
		const dimension_fc = this._get_dimension(celda_inicio, celda_fin, false);
		if (!celda_fin || !dimension_fc) return null;

		const ficha = this._get_ficha_vacia();
		ficha.celda_inicio = this._fc_to_celda(ini_fc.fila, ini_fc.columna);
		ficha.celda_fin = celda_fin;
		ficha.dimension = dimension_fc;
		// ┌■■ Recorre Todas las celdas  del rango de izda a dcha fila a fila...
		for (let fila = ini_fc.fila; fila <= fin_fc.fila; fila++) {
			for (let columna = ini_fc.columna; columna <= fin_fc.columna; columna++) {
				const celda = this._fc_to_celda(fila, columna);
				const indice = this._get_indice(fila, columna);
				const my_div = indice === false ? null : this.ref_Salon.matriz_plana[indice];
				const cuadrado = my_div?.elemento_div || null;
				// ┌■ Carga la geometría relativa (delta_x, delta_y) respecto a la celda_inicio
				ficha.geo[celda] = {
					delta_y: fila - ini_fc.fila,
					delta_x: columna - ini_fc.columna,
				};				
				// ┌■ Carga las baldosas: 'Gran_Salon_0' por ejem.
				ficha.items[celda] = cuadrado?.id || null;				
				// ┌■ Carga el Valor del DOM: 'silla_3' o 'mesa_0' o null si no hay contenido.
				if (cuadrado?.firstElementChild) {
					ficha.values[celda] = cuadrado.firstElementChild;
				}
			}
		}

		return ficha;
	}

	/** ### Devuelve una ficha_rango con los valores por defecto para ser rellenada. */
	_get_ficha_vacia( ){
		const ficha_rango = {
			celda_inicio:'',
			celda_fin:'',
			dimension: {filas: 0, columnas:0}, 
			geo:{}, 
			items:{}, 
			values:{}, 
		};
		return ficha_rango;
	}	

	registra_rango_matriz(ultimo_indice_matriz){
		const celda_i = this.X_to_celda(0, 0);
		const celda_f = this.X_to_celda(ultimo_indice_matriz);
		const dimension = this._get_dimension(celda_i, celda_f);
		this.crear_rango('rango_matriz', celda_i, dimension, true);
		return this.d_rangos['rango_matriz'] || null;
	}
	registra_rango_columna_s(total_filas, total_cols){
		let contador = 0;
		for (let c = 0; c < total_cols; c++) {
			const inicio = this.X_to_celda(0, c);
			let fin = inicio;
			for (let f = total_filas - 1; f >= 0; f--) {
				const indice = this.X_to_indice(f, c);
				if (indice !== false) {
					fin = this.X_to_celda(indice);
					break;
				}
			}
			const dimension = this._get_dimension(inicio, fin);
			this.crear_rango(`rango_columna_${c}`, inicio, dimension, true);
			contador = c+1;
		}
		return contador;
	}
	registra_rango_filas(){
		let contador = 0;
		for (let f = 0; f < total_filas; f++) {
			const inicio = this.X_to_celda(f, 0);
			let fin = inicio;
			
			for (let c = total_cols - 1; c >= 0; c--) {
				const indice = this.X_to_indice(f, c);
				if (indice !== false) {
					fin = this.X_to_celda(indice);
					break;
				}
			}
			const dimension = this._get_dimension(inicio, fin);
			this.crear_rango(`rango_fila_${f}`, inicio, dimension, true);
			contador = f+1;
		}
		return contador;
	}
	registra_rango_primera_columna(){}
	registra_rango_ultima_columna(){}
	registra_rango_primera_fila(){}
	registra_rango_ultima_fila(){}
	
	// get d_rangos(){ return this.d_rangos || {}; }
	get diccionario(){ return this.d_rangos || {}; }

}	// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ FIN CLASE  WORKING_RANGE


/** ## Crea un Cursor para Los Rangos. */
class Rango_Ghost extends Working_Rangos{
	/**
	 * ## Establece los Rangos Ghost y las operaciones que se pueden realizar con ellos. */
	constructor(instancia_matriz_plana = null) {			
		if (!instancia_matriz_plana) return null;		
		// ┌■ 
		super(instancia_matriz_plana);	
		// ┌■ ghost es un rango que se mueve / copia / corta / pega sobre el Salon.
		this.marco = {};		
		this.accion = 'inicial';	// 'inicial' | 'copiar' | 'cortar' | 'pegar' | 'mover' |
		this.num_pegar = 0;		    // cuenta el numero de pastes realizados desde el ultimo 'cut | copy'
    }

	/** 
	 * ## Un Rango 'marco'(ghost) es un marco 'invisible' que se coloca sobre el Salon Cogiendo, Yendo, Viniendo y Pegando.
	 * ### • El parametro de entrada puede ser:
	 * #### 1- Dimension en formato '3x4' o {filas:int, columnas:int} , y generará un rango de 3 filas y 4 columnas desde 'A0'
	 * #### 2- Nombre_rango(string)  del diccionario de rangos 'lo enmarca' posicionandose encima y tomando sus datos.
	 * #### 3- Una ficha-rango: { celda_inicio:str, celda_fin:str, dimension:{}, geo:{}, items:{}, values:{} }
	 * #### Devuelve el nombre del ghost recien creado o null. 
	 * ```javascript
	 * crear_marco('3x4'); ► Crea un marco con ci('A0')	 de dimension 3x4
	 * crear_marco({filas:3, columnas:4});	► ► Crea un marco con ci('A0')	 de dimension 3x4
	 * crear_marco('rango_fila_2');	► Crea un marco si rango_fila_2 está registrado en this.d_rangos
	 * crear_marco(celda_inicio:'A2', dimension:{filas:3, columnas:4}); ► Crea un marco con ci('A2') de dimension 3x4
	 * ```	 */
	crear_$marco(argumento){
		if(!argumento || Array.isArray(argumento)) return null;
		// ┌••••••••••••••••••••••••••••••••••••••••••
		// ┌• El parametro de entrada puede ser:
		// 		1- una dimension en formato '3x4' o {filas:int, columnas:int} 
		// 		2- nombre_rango(string)  or  un rango anonimo: { celda_inicio:str, celda_fin:str, dimension:{}, geo:{}, items:{}, values:{} }
		let filas =  -1;
		let columnas = -1;
		
		let rango_ori  = null;
		if(typeof argumento === 'string'){
			// ┌■■ Puede ser una dimesión o un nombre de rango.
			const dimension_fc = this._normalizar_dimension(argumento);
			if(dimension_fc) {
				// ■ dimension {filas:3, columnas:4}
				filas = dimension_fc.filas;
				columnas = dimension_fc.columnas;
				this._crear_ghost_desde_dimension(filas, columnas);

			} else { 			
				// ┌■ 'nombre_rango' en d_rangos 
				rango_ori = this.read_rango(argumento);
				if(rango_ori){
					// ┌■ cargo los valores en el Rango, pero solo los que tienen datos.
					this.to_pull(argumento, false);	
					this.marco = rango_ori;

				}else{
					return this._get_ficha_vacia() || null;
				}
			}
		}else if (typeof argumento === 'object'){
			if(argumento.celda_inicio && argumento.celda_fin && argumento.geo ) {
				// ■ Objeto rango.
				rango_ori = argumento;
				this._crear_marco_desde_rango(rango_ori);
			}else if(argumento.filas && argumento.columnas){
				// ■ Objeto dimension.
				filas = argumento?.filas;
				columnas = argumento?.columnas;
				this._crear_ghost_desde_dimension(filas, columnas);
			}
		}

		this.num_pegar = 0;
		this.accion = 'crear';
		this.informe_marco_consola('Crear');
		// ┌■ RETORNO
		return this.marco;
		
	}

	/** ### Crea un marco desde un rango ya creado. 
	 * ### Además convierte los id's de values en objetos  
	 * ### Siempre un Rango Rectangular */
	_crear_marco_desde_rango(ficha_rango){
		// ┌■■ El proceso consiste en llenar de datos this.marco(celda_inicio, celda_fin, dimension, geo, values, items)
		// Para esto creo un rango en d_rangos con crear, esto llena (celda_ini, celda_fin, dimension y geo.). 
		// Luego, reasigno values.
		const celda_s_id = ficha_rango.values;
		if(!celda_s_id){
			this.marco = ficha_rango;
			return this.marco;
		}
		// ┌• Aseguramos que le pasa los elementos en lugar de los id's... 
		// ┌• RECUERDA ► "[marco] maneja elementos, [rangos] maneja id's"			
		let celda_s_element={};
		for (const celda in celda_s_id) {
			const id = celda_s_id[celda];
			celda_s_element[celda] = this.#_normalizar_elemento(id);
		}
		// ┌■■ Re-asigno 'values', pero ahora con los elementos_dom en lugar de con los 'id's'
		this.marco = ficha_rango;
		this.marco.values = celda_s_element;		// this.marco.values = this._get_values(ghost_name, false, true);

		// ┌■■ Retorno
		return this.marco;
	}

	/** Un rango desde una dimension se crea SIEMPRE en 'A0' como celda de inicio */
	_crear_ghost_desde_dimension(filas, columnas){
		// ┌■ El proceso es el siguiente:
		// Se pone el cursor(celda_inicio) en A0. Se calcula la dimension y el rango. Luego se puede calcular geo, items y values
		const new_dimension = {filas:filas, columnas:columnas};
		// ┌■  Cuando llama a crear_$marco solo con dimension situa el cursor en  'A0'
		const ci = 'A0';
		const cf = this._get_celda_fin(ci, new_dimension);
		if(!cf) return null;
		const ghost_name = this._get_nombre_rango('ghost');		
		const ficha = this._get_ficha_vacia();
		
		this.rango_repository.guardar('rangos', ghost_name, ficha);
		// ┌■ Relleno los datos necesarios para obtener geo, items y values. 
		this.d_rangos[ghost_name].celda_inicio = ci;
		this.d_rangos[ghost_name].celda_fin = cf;
		this.d_rangos[ghost_name].dimension = new_dimension;		

		// ┌■ Obtengo geo.
		const geo = this._get_geo(ghost_name);
		// ┌■ Obtengo items.
		const items = this._get_items(ghost_name);
		// ┌■ Obtengo values.(del Salon directamente)
		const values = this._get_values(ghost_name, false , true);
		
		// ┌■ Asigno los valores
		this.d_rangos[ghost_name].geo =  geo ? geo : {};
		this.d_rangos[ghost_name].items = items ? items : {};
		this.d_rangos[ghost_name].values = values ? values : {};
		
		// ┌■ Lo asigno a ghost 
		this.marco = this.d_rangos[ghost_name];
		
		// ┌■ Lo Elimino de d_rangos
		this.eliminar_rango(ghost_name);	
		
		// ┌■ Retorno
		return this.marco;
	}

	/** ### Devuelve el contenido actual del ghost
	 * @param {String} accion  'Mover' | 'Ghost' | 'Cortar' | 'Copiar' | 'Pegar' | 'Volver' | 'Reset' 
	 * @param {Number} separacion  Espacio de separación entre las matrices (La separación dinámica)
	 * @returns {Array}  Array de strings representando la matriz del ghost y el salon
	 */
    informe_marco_consola(accion = '', separacion = 15) {
        const margin = '  ';

        const F = {
            reset: "\x1b[0m",
            bright: "\x1b[1m",
            dim: "\x1b[2m",
            cyan: "\x1b[36m",
            green: "\x1b[32m",
            yellow: "\x1b[33m",
            red: "\x1b[31m",
            gray: "\x1b[90m",
        };
		/** ### Devuelve un array de str con la linea que tiene que escribir, cruza celdas con values en Salon y Rango 
		 * ### • 1 llamada por 'Salon' y otra por 'Rango'		*/
        const representar_matriz = (array_celdas, arr_values=[]) => {
            const array_retorno_str = []
            const filas = [...new Set(array_celdas.map(c => c.replace(/[A-Z]/g, '')))].sort((a, b) => a - b);
            const columnas = [...new Set(array_celdas.map(c => c.replace(/[0-9]/g, '')))].sort();
            
			const ANCHO_CELDA = 3; // Fija la longitud máxima, p.ej. "A10 "
            
			filas.forEach(num => {
                const filaVisual = [];
                columnas.forEach(letra => {
                    const idCelda = `${letra}${num}`;
					const idCeldaPadded = idCelda.padEnd(ANCHO_CELDA, ' '); // Normaliza a 4 caracteres
					const id_celda_padded_centrada = centrar(idCelda, 5, ' ');
                    if (array_celdas.includes(idCelda)) {
                        if(arr_values.includes(idCelda))
                            filaVisual.push(`${F.bright}${F.green}${id_celda_padded_centrada}${F.reset}`);
                        else
                            filaVisual.push(id_celda_padded_centrada);
                    }else{
						// Mantiene la estructura si falta alguna celda intermedia
                        // filaVisual.push(' '.repeat(ANCHO_CELDA));
					}
                });
                const fila_str = `${margin}${filaVisual.join('|')}`;
                array_retorno_str.push(fila_str);
            });
            return array_retorno_str;
        };
		const centrar = (texto, longitud, relleno = " ") => {
			return texto
				.padStart(Math.floor((longitud + texto.length) / 2), relleno)
				.padEnd(longitud, relleno);
		};
		/** ### Entra un str y devuelve la longitud real sin los caracteres de color */
		const get_real_length = (str) => {
			// Esta regex busca el carácter de escape seguido de los corchetes y parámetros
			const ansiRegex = /\x1b\[[0-9;]*m/g;
			return str.replace(ansiRegex, '').length;
		};
		
		const obtener_id = (valor) => {
			if (valor === null || valor === undefined || valor === false) return 'vacío';
			if (typeof valor === 'string' || typeof valor === 'number') return String(valor);
			return valor.id || '(elemento sin id)';
		};
		
		const values_ghost = this.marco.values || {};

		// ┌■■ PREPARACIÓN DE DATOS  		
		// ┌■■ Hay que cachar los datos del Salon y compararlos con los de Ghost:

		// ┌• espacio de separación entre las matrices(La separación dinámica)
		const GAP = ' '.repeat(separacion); 
        
		// ┌• Obtener  values e items  'en Salon'     
        const nombre_marco = this.registrar_marco_en_rangos();
        const d_values_salon  = this._get_values(nombre_marco, false, true);
        const d_items_salon = this._get_items(nombre_marco, false);
        this.eliminar_rango(nombre_marco);

		// ┌• Array de string 'B4:silla_3','A4:mesa_1', . . .   del Salon
		let values_rango = '';
		for (const [celda, valor] of Object.entries(values_ghost)) {
			values_rango += `${celda}: ${obtener_id(valor)}, `;
		}
		// ┌• Array de celdas con valor del Salon(this.marco.values)
		const arr_values = Object.keys(values_ghost);
		
		// ┌• Asegura celda_inicio y celda_fin con el formato correcto
        if(typeof this.marco.celda_inicio == 'object') this.marco.celda_inicio = this.X_to_celda(this.marco.celda_inicio);
        if(typeof this.marco.celda_fin == 'object') this.marco.celda_fin = this.X_to_celda(this.marco.celda_fin);   

        // ┌• Necesito las celdas del 'Rango' para pasarlas a representar_matriz
        let celdas_rango = Object.keys(this.marco.items);		
        
        // ┌• Necesito las celdas del 'Salon' para pasarlas a representar_matriz
		let values_salon = '';
        for (const [celda, valor] of Object.entries(d_values_salon || {})) {
			values_salon += `${celda}: ${obtener_id(valor)}, `;
		}

        let celdas_salon = [];
        for (let celda of Object.keys(d_items_salon)) celdas_salon.push(celda);        
        
        // ┌• Array de str de Salon - 
        const lineas_rango = representar_matriz(celdas_rango, arr_values || []);
		const lineas_salon = representar_matriz(celdas_salon, Object.keys(d_values_salon || {}));
		
		// ┌• Calcular la 'longitud max de las filas' de la MATRIZ
        const filas_totales = Math.max(lineas_rango.length, lineas_salon.length);
		const linea_s_to_print  = []
        for (let i = 0; i < filas_totales; i++) {
            const fila_R = lineas_rango[i] || ''; // Por si una matriz tiene menos filas
            const fila_S = lineas_salon[i] || '';
			const linea = `${fila_S}${GAP}${fila_R}`;			
			linea_s_to_print.push(linea);
        }

		// ■■■ CALCULO DE ANCHOS 		
		// ┌■■ Longitud maxima de cada linea que suma de las matrices "Salon+Separacion+Rango"
		let max_l = 0;
		linea_s_to_print.forEach(linea =>{max_l = Math.max(max_l, get_real_length(linea)) });
		const x_matriz = Math.floor((max_l - separacion) / 2);

		// ■■■ RENDERIZADO     
        const BARRA = `${'■ '.repeat(10+4)}`;
		const LINEA = `${'— '.repeat(10+4)}`;
        const BARRAINI = `${F.bright}${F.green}${BARRA}${F.reset}`;
        const BARRAFIN = `${F.bright}${F.gray}${LINEA}${F.reset}\n`;
		const BASTON = `${F.bright}${F.gray}┌■■${F.reset}`;
		const action = `${BASTON}${F.cyan} ACCION${F.reset}: ${this.accion}`;
		
		// ┌■ Cabecera (Techo)
        console.log(`${BARRAINI} ► " ${F.cyan}${accion}${F.reset} "`);
		
		// ┌■ Imprimir las matrices lado a lado
		linea_s_to_print.forEach(linea =>{console.log(linea)});
		
		// ┌■ Base de las Matrices:
		const under_salon = this.__generar_linea_formateada(x_matriz, 'SALON',  2);
		const under_rango = this.__generar_linea_formateada(x_matriz, 'RANGO',  2);

        console.log(` ${F.bright}${F.gray}${under_salon}${GAP}${under_rango}${F.reset}`);
        
		// ┌■ Metadatos
		const ci = `${BASTON} CELDA_${F.cyan}INI${F.reset}: "${this.marco.celda_inicio}"`;
		const cf = `${BASTON} CELDA_${F.cyan}FIN${F.reset}: "${this.marco.celda_fin}"`;
		const dim = `${BASTON} ${F.cyan}DIM${F.reset}: ( ${this.marco.dimension.filas} x ${this.marco.dimension.columnas} )`;
		const geo = `${BASTON} ${F.cyan}GEO${F.reset}: ${this.marco.geo ? 'Deltas ✔️' : 'NO DATA ⚠️'}`;
		const items = `${BASTON} ${F.cyan}ITEMS${F.reset}: ${this.marco.items ? 'Baldosas ✔️' : 'NO DATA ⚠️'}`;
		const paste = `${F.gray}┌■■${F.reset} Nº ${F.cyan}PASTEs${F.reset}: ${this.num_pegar}`;
		const values_rango_str = `${BASTON} VALUES ${F.cyan}RANGO${F.reset}: ${F.bright}${F.cyan}■ ${F.reset}${values_rango}${F.bright}${F.cyan}█▀▄█${F.reset}`;
		const values_salon_str = `${BASTON} VALUES ${F.cyan}SALON${F.reset}: ${F.bright}${F.cyan}■ ${F.reset}${values_salon}${F.bright}${F.cyan}█▀▄█${F.reset}`;
		// ┌■ Los imprimo.
		console.log(`${ci}  ${cf}  ${dim}  ${geo}  ${items}`);
		console.log(`${action} ${paste}`);
		console.log(`${values_rango_str}`);
		console.log(`${values_salon_str}`);
		console.log(`${BARRAFIN}`);		
    }
	
	/** ## EL FANTASMA 👻 SE MUEVE 
	 * ### Se cambia celda_inicio, celda_fin e items. 'geo' no varia y 'values' mantiene los valores anteriores.
	 * #### • esto provoca que se puedan asignar valores y luego pueda soltarlos. 
	 
	 * ### Luego las acciones que se pueden hacer son cut, copy y paste sobre el Salon.
	 * ### mueves el cursor + cut o copy + mueves el cursor + paste.
	 * ### mueves el cursor + busca_free + mueves el cursor + busca_free....
	 */		
	// ┌• NOTA: "Al mover el cursor no relleno values para que no machaque los datos si antes he copiado o cortado."
	// ┌• Pero si actualizo las nuevas celdas con los valores teniendo en cuenta la posicion.
	// ficha.values = values 	|| {};		
	mover_cursor(celda_destino) {
		if(typeof celda_destino == 'string') celda_destino = celda_destino.trim();
		if(!celda_destino) celda_destino = 'A0';
		// Pre-cálculo de coordenadas base (Optimización: Fuera del bucle)
		const fc_iniciales = this.X_to_fc(this.marco.celda_inicio);
		const fc_destino = this.X_to_fc(celda_destino);
		
		// Contenedores para la nueva estructura
		const new_values = {};
		const new_items = {};
		try {
			// Usamos 'geo' como mapa maestro de la estructura(es el único que tiene siempre todas las celdas del rango)
			// Además cuando se mueve el cursor, cambian las celdas, pero Los deltas permanecen constantes una vez calculados.
			// 'geo' se construye en ghost.
			for (const celda in this.marco.geo) {
				const delta = this.marco.geo[celda];
				
				// --- A. Cálculo de coordenadas ---				
				// Coordenada Antigua (Origen): Para recuperar el valor actual
				const fila_old = fc_iniciales.fila + delta.delta_y;
				const col_old = fc_iniciales.columna + delta.delta_x;
				const celda_old = this.X_to_celda(fila_old, col_old);
	
				// Coordenada Nueva (Destino): Para guardar en la nueva posición
				const fila_new = fc_destino.fila + delta.delta_y;
				const col_new = fc_destino.columna + delta.delta_x;
				const celda_new = this.X_to_celda(fila_new, col_new);
	
				// --- B. Transferencia de VALORES (Payload) ---
				// Si el ghost tiene algo capturado en la posición vieja, lo movemos a la nueva
				new_values[celda_new] = Object.prototype.hasOwnProperty.call(this.marco.values, celda_old)
						? this.marco.values[celda_old]
						: null;
	
				// --- C. Actualización de ITEMS (Grid Destino) ---
				// Calculamos el ID del DOM correspondiente a la nueva celda
				// Asumimos el estándar: ID = "NombreContenedor_" + indice
				const indice = this.X_to_indice(celda_new);
				// Nota: Verifica si tu prefijo es "Gran-Salon_" o variable. 
				// Si es dinámico, úsalo desde this.prefijo o similar. Aquí uso el estándar detectado.
				new_items[celda_new] = `Gran-Salon_${indice}`; 
			}
	
			// Actualización atómica del estado
			this.marco.values = new_values;
			this.marco.items = new_items;
			this.marco.celda_inicio = celda_destino;
			
			// Recalcular celda_fin basándonos en la dimensión y el nuevo inicio
			const fin_f = fc_destino.fila + (this.marco.dimension.filas - 1);
			const fin_c = fc_destino.columna + (this.marco.dimension.columnas - 1);
			this.marco.celda_fin = this.X_to_celda(fin_f, fin_c);
			
			// ┌■ VARIABLES DE ESTADO DEL GHOST 💭💭
			this.accion = 'mover';
			this.informe_marco_consola('Mover');
		
			// ┌• RETORNO
			return true;
			
		} catch (error) {
			console.log(error);
			return false;
		}
	}
	/** ## Pone el cursor en 'A0' con una dimension '1x1' con values {}, solo items y geo y preparado para ser activado por ghost() */
	re_init_$marco(){
		ficha = this._get_ficha_vacia();
		if(!ficha) return null;
		ficha.celda_inicio = 'A0';
		ficha.geo = {delta_y:0, delta_x:0};
		ficha.items = '🔥🔥 PENDIENTE, HAY QUE HACER UN first_baldosa Y UN last-baldosa DE RANGOS BASIC Y ASIGNARLO AQUI 🔥🔥';
		
		this.marco = ficha;
		
		// ┌■ VARIABLES DE ESTADO DEL GHOST 💭💭
		this.num_pegar = 0;
		this.informe_marco_consola('Re-Init');
	}

	/** ## CORTA los 'Valores de Salon' donde está posicionado el ghost	 
	 * ### • Es responsabilidad del programador mover el cursor con 'mover_cursor' para CORTAR valores distintos.
	 * ### • VOY A INTENTAR 'CORTAR' LOS ELEMENTOS DIRECTAMENTE PORQUE GHOST VIVE EN EL DOM. NO SE GUARDA.
	*/	
	cortar_$marco() {
		const nombre_marco = this.registrar_marco_en_rangos();
		try {
			// Obtener los elementos del DOM directamente y no el id del elemento usando el tercer parámetro en true
			const elementos_r = this._get_values(nombre_marco, false, true);
			// Acción de CORTAR: Remover los elementos del DOM + Cachar celda:elemento en d_values.
			const d_values = {};
			Object.keys(this.marco.items || {}).forEach(celda => {
				const elemento = elementos_r?.[celda] || null;
				d_values[celda] = elemento;
				if (elemento?.parentNode) elemento.parentNode.removeChild(elemento);
			});
			// Construir la estructura marco requerida
			// Asumimos que this.celda_inicio, this.celda_fin, this.geo, etc., No cambian, sólo values.
			const $MARCO  = this.marco;
			$MARCO.values = d_values || {};   // AQUI guardamos los elementos DOM extraídos

			// ┌■ VARIABLES DE ESTADO DEL GHOST 💭💭
			this.num_pegar = 0;
			this.accion = 'cortar';
			// 🍏
			this.informe_marco_consola(this.accion);
			this.eliminar_rango(nombre_marco);
			
			return d_values;		
		} catch (error) {
			console.log(error);
			this.eliminar_rango(nombre_marco);
			return false;			
		}
	}

	/** ## COPIA los valores de Salon donde está posicionado el ghost. 
	 * ### • Es responsabilidad del programador mover el cursor con 'mover_cursor' para COPIAR valores distintos.
	 * ### • VOY A 'CLONAR' LOS ELEMENTOS DIRECTAMENTE PORQUE GHOST VIVE EN EL DOM. NO SE GUARDA
	*/
	copiar_$marco(){
		try {
			if(!this.marco || !this.marco.celda_inicio) return null;
			// TENGO QUE COPIAR LOS ELEMENTOS DEL SALON EN 'values', luego me quedo esperando que me muevan con 'mover_cursor'.
			
			const geo = this.marco.geo;
			this.marco.values = {};
			const baldosas = this.marco.items;
			if(!baldosas) return;
			
			// Cacha los elementos del Salon directamente:
			const resultado = {};
			Object.entries(baldosas).forEach(([celda, id_baldosa]) => {
					if (!id_baldosa) {
						resultado[celda] = null;
						return;
					}
					const baldosa = document.getElementById(id_baldosa);
					const contenido = baldosa?.firstElementChild;
					resultado[celda] = contenido instanceof HTMLElement ? contenido : null;					
			});
			// Asigno a ghost: "Copia"
			this.marco.values = resultado ?  resultado : {};

			// ┌■ VARIABLES DE ESTADO DEL GHOST 💭💭
			this.num_pegar = 0;	
			this.accion = 'copiar';	
			// 🍏
			this.informe_marco_consola(this.accion);
			// ┌■ RETORNO
			return resultado;							
		} catch (error) {
			console.log(error);
			return false;	
		}
	}

	/**
	 * Tiene que retornar celda_elemento= {'C1':<obj_C1>, 'C2':<obj_C2> , 'D1':<obj_D1>, ....}
	 * Cortar conserva los mismos nodos.
	 * Copiar crea nodos nuevos en cada llamada.
	 * Crear, cuando se crea un ghost, se activa la accion='crear'
	 */
	get_celda_s_elemento_del_marco() {
		// ┌■ Validacion: 
		if (!this.marco?.values) return null;
		if (!['cortar', 'copiar', 'crear'].includes(this.accion)) return null;
		
		// ┌• CON CORTAR, SOLO SE PEGA UNA VEZ
		if (this.accion === 'cortar' && this.num_pegar > 0) return null;
		
		// ┌■ {B0:<objmesa_1, B1:<objsilla_2>, B3:null, B4:<objsilla_0>,...} 
		const celda_elemento = {};
		
		const celda_s = Object.keys(this.marco.items || this.marco.geo);
		for (const celda of celda_s) {
			const elemento_origen = this.marco.values[celda] || null;
			// ┌■■ Si ghost no tiene valor, asignamos null.
			if (!elemento_origen) {
				celda_elemento[celda] = null;
				continue;
			}
			// ┌■■ un clon del elemento-menu es el que hay que pegar.
			if (this.accion === 'crear') {
				celda_elemento[celda] = this.#_normalizar_elemento(elemento_origen) || null;
				continue;
			}
			// ┌■■ el elemento_dom es el que se tiene que pegar.
			if (this.accion === 'cortar') {
				celda_elemento[celda] = this.#_normalizar_elemento(elemento_origen) || null;
				continue;
			}
			// ┌■■ un clon del elemento_dom es el que se tiene que pegar.
			if (this.accion === 'copiar') {
				const elemento_copiado = elemento_origen.cloneNode(true);
				const id_key = elemento_origen.dataset?.id_key;
				if (!id_key) return null;
				elemento_copiado.id = Herramientas.get_dom_secuency(id_key);				
				
				celda_elemento[celda] = elemento_copiado;
				continue;
			}
		}
		return celda_elemento;
	}


	/** Pega los values del marco en las baldosas dom.
	 * devuleve un array de diccionario {baldosa:<obj_baldosa1, elemento:<obj_silla_5>, .... }
	*/
	pegar_$marco() {
		// ┌■ Previo a Pegar
		const celda_elemento = this.get_celda_s_elemento_del_marco();
		// ┌■ Validacion:
		if (!celda_elemento || typeof celda_elemento !== 'object' || Array.isArray(celda_elemento)) return false;
		
		// ┌■ Proceso:
		const elementos_a_pegar = [];
		for (const [celda, elemento] of Object.entries(celda_elemento)) {
			if (!elemento) continue;
			const cuadrado = this.celda_to_baldosa(celda);
			if (!cuadrado || typeof elemento !== 'object') return false;
			elementos_a_pegar.push({ cuadrado, elemento });
		}
		// ┌■■ Esta es la acción que pega en el Salon los elementos.
		elementos_a_pegar.forEach(({ cuadrado, elemento }) => cuadrado.appendChild(elemento));

		// ┌■ Estado:
		this.num_pegar += 1;
		// ┌■ Informe Consola:
		this.informe_marco_consola('Paste');
		
		// ┌■ Retorna : {baldosa:<obj_baldosa1, elemento:<obj_silla_5>, .... }
		return elementos_a_pegar;
	}
	
	/** ## 4 ACCIONES: mover + cut + mover + paste */
	comb_cut_paste(celda_origen, celda_destino='A0'){
		try {
			const $MARCO = this.marco
			//┌■■  Validamos si tenemos rango ghost
			if(!$MARCO || $MARCO == {} )  throw('Error. No hay Fantasma!!');
			if(!$MARCO.celda_inicio || !$MARCO.celda_fin) throw('Error. No encuentro celda_inicio o celda_fin!!');
			if(!$MARCO.geo  || !$MARCO.items)  throw('Error. No encuentro geometria delta o items!!');
			if(!$MARCO.values || $MARCO.values == {}) throw('Error. No encuentro values!!');
			if(!celda_destino) throw('Error. Para mover y pegar tienes que tener celda_destino');
			if(celda_destino === celda_origen ) return;

			// ┌■■ Proceso: 
			let ok = false;
			ok = this.mover_cursor(celda_origen)
			if(!ok) throw Error(`Error en "Mover" a celda-origen ${celda_origen}`);
			ok = this.cortar_$marco();
			if(!ok) throw Error(`Error en "Cortar" celda-destino: ${celda_destino}`);
			ok = this.mover_cursor(celda_destino);
			if(!ok) throw Error(`Error "Mover" a celda-destino ${celda_destino}`);
			ok = this.pegar_$marco();			
			if(!ok) throw Error(`Error "Paste" en celda-destino ${celda_destino}`);
			return ok;

		} catch (error) {
			console.log(`Error Cut-Paste celda_destino( ${celda_destino} ):::` + error);
			return false;
		}
	}
	/** ## 4 ACCIONES: mover(celda_origen) + copy + mover(celda_destino) + paste 
	 * ### • copy siempre crea elementos nuevos.	
	 * ### De base se Machaca cuando se pega. 
	 * */
	comb_copy_paste(celda_origen='A0', celda_destino='A0'){
		try {
			const $MARCO = this.marco
			// ┌■■ Validamos si tenemos rango ghost
			if(!$MARCO || $MARCO == {} )  throw('Error. No hay Fantasma!!');
			if(!$MARCO.celda_inicio || !$MARCO.celda_fin) throw('Error. No encuentro celda_inicio o celda_fin!!');
			if(!$MARCO.geo  || !$MARCO.items)  throw('Error. No encuentro geometria delta o items!!');
			if(!$MARCO.values || $MARCO.values == {}) throw('Error. No encuentro values!!');
			if(!celda_destino) throw('Error. Para mover y pegar tienes que tener celda_destino');
			if(celda_destino === celda_origen ) return;

			// ┌■■ Proceso:			
			let ok = false;
			ok = this.mover_cursor(celda_origen)
			if(!ok) throw Error(`Error en "Mover" a celda-origen ${celda_origen}`);
			ok = this.copiar_$marco();
			if(!ok) throw Error(`Error en "Copiar" celda-origen: ${celda_origen}`);
			ok = this.mover_cursor(celda_destino);
			if(!ok) throw Error(`Error en "Mover" a celda-destino ${celda_destino}`);
			ok = this.pegar_$marco();
			if(!ok) throw Error(`Error en "Paste" en celda-destino ${celda_destino}`);
			
			return ok;
		} catch (error) {
			console.log(`❌ Error Copy-Paste 👻, celda-destino ${celda_destino} :::` , error);
			return false;
		}
	}

	/**
	 * ### "Busca, el primer rango-free (sin hijos) de esta dimensión, a partir de esta celda y dentro de un rango".
	 * @param {String} dimension Texto con formato 'filasXcolumnas' (por ejemplo, '3x4').
	 * @param {String} celda_inicio Celda desde la que comenzar la búsqueda (por ejemplo, 'C2').
	 * @param {String} nombre_rango Nombre del rango donde se quiere buscar el bloque libre.
	 * @returns {{celda_inicio: String, celda_fin: String}|null} Coordenadas de inicio y fin del rango libre, o null si no se encuentra.
	 * @example const rango_free = this._buscar__free('3x4', 'C2', 'rango_matriz'); ► { celda_inicio: 'D4', celda_fin: 'F6' }
	 */
	_buscar_free(dimension = '', celda_inicio = 'A0', nombre_rango = 'rango_matriz') {
		const dimension_fc = this?._normalizar_dimension(dimension);
		const coord_ci = this?._celda_to_fc(celda_inicio);
		const celdas_rango = this._get_celdas(nombre_rango);

		if (!dimension_fc || !coord_ci || !Array.isArray(celdas_rango) || celdas_rango.length === 0) return null;

		const celdas_ordenadas = celdas_rango
			.map(celda => ({ celda, fc: this._celda_to_fc(celda) }))
			.filter(item => item.fc)
			.sort((a, b) => (a.fc.fila - b.fc.fila) || (a.fc.columna - b.fc.columna))
			.map(item => item.celda);

		const celdas_set = new Set(celdas_ordenadas);

		for (const celda of celdas_ordenadas) {
			const fc = this._celda_to_fc(celda);
			if (!fc) continue;
			if (fc.fila < coord_ci.fila || (fc.fila === coord_ci.fila && fc.columna < coord_ci.columna)) continue;

			if (this.__is_free(celda, dimension, nombre_rango, celdas_set)) {
				const fc_fin = this._get_celda_fin(celda, dimension);
				const celda_fin = fc_fin ? this._fc_to_celda(fc_fin.fila, fc_fin.columna) : null;
				return celda_fin ? { celda_inicio: celda, celda_fin } : null;
			}
		}

		return null;
	}
	/**
	 * ### Recorre un bloque (por celdas) y comprueba si todas están vacías dentro del rango indicado.
	 * ### usado en {@link _buscar_free}
	 * @param {String} celda_inicio Celda de inicio del bloque.
	 * @param {String} dimension Dimensión del bloque (filasxcolumnas).
	 * @param {String} nombre_rango Nombre del rango donde se valida el bloque.
	 * @param {Set<String>|null} celdas_rango_set (opcional) Set con las celdas del rango para acelerar la validación.
	 * @returns {Boolean} true si todas las celdas del bloque están vacías y pertenecen al rango, false en caso contrario.
	 */
	__is_free(celda_inicio = 'A0', dimension = '', nombre_rango = 'rango_matriz', celdas_rango_set = null) {
		const fin_fc = this._get_celda_fin(celda_inicio, dimension);
		const celda_fin = fin_fc ? this._fc_to_celda(fin_fc.fila, fin_fc.columna) : null;
		if (!celda_fin) return false;

		const rango_obj = this._get_rango_from_cicf(celda_inicio, celda_fin);
		if (!rango_obj || !rango_obj.items) return false;

		const celdas_set = celdas_rango_set instanceof Set
			? celdas_rango_set
			: new Set(this._get_celdas(nombre_rango) || []);

		const celdas_bloque = Object.keys(rango_obj.items);
		if (celdas_bloque.length === 0) return false;

		for (const celda of celdas_bloque) {
			if (!celdas_set.has(celda)) return false;
			// if (!this._is_myDiv_vacio(rango_obj.items[celda])) return false;
			const myDiv = rango_obj.items[celda];
			const es_vacio = Boolean(myDiv.elemento_div.children.length === 0);
			
			// ┌• Devuelve false si tiene datos(no vacío) porque 'NO es rango libre'.
			if (!es_vacio) 
				return false;
		}

		return true;
	}
	
	/**
	 * Genera una línea formateada tipo: ---- texto ----
	 * @param {number} x - La longitud total deseada de la cadena.
	 * @param {string} texto - El texto central (ej. "salon").
	 * @param {number} num_espacios - Cantidad de espacios totales (por defecto 2).
	 */
	__generar_linea_formateada(x, texto, num_espacios = 2) {
		const longitudTexto = texto.length;
		const totalGuiones = Math.max(0, x - longitudTexto - num_espacios);
		const izq = Math.floor(totalGuiones / 2);
		const der = totalGuiones - izq;
		const espacios = " ".repeat(Math.ceil(num_espacios / 2));
		return `${'▬'.repeat(izq)}${espacios}${texto}${espacios}${'▬'.repeat(der)}`;
	}
	
	/** ### • Si entra un "objeto-elemento" [lo retorna], 
	 * ### • Si entra un "id que está en el salon", [retorna el elemento]. 
	 * ### • Si entra un "id que no existe en el salon", [crea el elemento y lo saloniza].	 
	 * ```javascript
	 * const uno = X_to_elemento_(<element div>); // ► devuelve <element div>	
	 * const dos = X_to_elemento_('silla_1'): // ► devuelve <element div> si existe 'silla_1'
	 * const tres = X_to_elemento_('silla_1'); // ► crea <element div>, lo saloniza, lo devuelve.
	 * array_elementos.map(elemento=>{ _crear_y_salonizar(elemento) }); // ► si son ids, ahora son elementos, si son elementos, lo siguen siendo y si no existen los crea.
	 * ```	 * */
	#_normalizar_elemento(elemento){		
		if (typeof this.ref_Salon?.api_normalizar_el_player !== 'function') return null;
		return this.ref_Salon.api_normalizar_el_player(elemento);
	}

	/** ## obtiene las Coordenadas con offset.
	 * ### 'celda'(str) normalmente 'celda_inicio' de un rango.
	 * ### 'delta._y' es el desplazamiento vertical de la nueva-poisicion con respecto a la celda de entrada. 
	 * ### 'delta._x' es el desplazamiento horizontal de la nueva-poisicion con respecto a la celda de entrada. 
	 * ## [RETORNO] la celda resultado de aplicarle ese delta.
	 * ```javascript
	 * this.__get_coord_abs(A0, {delta_y:1, delta_x:0}) ► A1
	 * this.__get_coord_abs(A0, {delta_y:2, delta_x:0}) ► A2
	 * this.__get_coord_abs(A0, {delta_y:0, delta_x:1}) ► B0
	 * ``` 	 */
	_get_coord_abs(celda, delta){
		// USAMOS LA FUNCIÓN NATIVA: Convertimos "A2" -> {fila: 2, columna: 0}
		const pos = this.X_to_fc(celda);
		// Aplicamos el delta geométrico
		const nueva_columna = pos.columna + delta.delta_x;
		const nueva_fila = pos.fila + delta.delta_y;
		// Reconstruimos la coordenada string (0 -> A, 1 -> B...)
		// Nota: Si dispones de una función inversa tipo 'fc_to_X(f, c)', sería ideal usarla aquí.
		// const letra_columna = String.fromCharCode(nueva_columna + 65);
		const celda_retorno = this.X_to_celda(nueva_fila, nueva_columna);
		return celda_retorno ? celda_retorno : '';
	}

	/** 
	 * ### registro la ficha del marco en d_rangos.
	 * ### Este proceso vale para hacer operaciones con el marco como un rango de working_Rangos
	 * */
	registrar_marco_en_rangos(){
		if (this.marco){
			// ┌■ Objeto rango.
			const nombre_marco = this._get_nombre_rango('marco');		
			this.registrar_ficha(nombre_marco, this.marco);
			// ┌■
			return nombre_marco;
		}else{
			return '';
		}
		
	}
	
}

/** ◘ ◘ ◘ ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘
 * ### CLASE HIJA DE RANGOS. Operaciones Especiales. 
 *  ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘
*/
class Wedding_Rangos extends Rango_Ghost{
	/**
	 * ## Trata las operaciones que se pueden hacer con dos rangos. Macro de Trabajo sobre Rangos.
	 * ### Union, Intersección, _is_continuos, 	 */
	constructor(instancia_matriz_plana = null) {			
		if (!instancia_matriz_plana) return null;		
		super(instancia_matriz_plana);	

		this.rangos = {app:{}, temp:{}, basic:{}};		
    }	
	
	/**
	 * ## Calcula la unión de dos rangos y la devuelve como colección de celdas conectadas.
	 * ### • La salida no es un rango único, sino una colección de rangos.
	 * @param {String} nombre_rango_a
	 * @param {String} nombre_rango_b
	 * @returns {Array<Array<String>>|null} Colección de rangos (listas de celdas) o null si falla.
	 */
	_get_union(nombre_rango_a = '', nombre_rango_b = '') {
		// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘
		// const celdas_a__ = obtener_celdas(nombre_rango_a);
		const celdas_a = this._get_celdas(nombre_rango_a);

		const celdas_b = this._get_celdas(nombre_rango_b);
		// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘

		if (!celdas_a || !celdas_b) return null;

		const set_a = new Set(celdas_a);
		const set_b = new Set(celdas_b);

		// ┌■■ LOGICA DEL NEGOCIO:
		// ┌■ Cacha las celdas compartidas.
		const compartidas = celdas_a.filter(celda => set_b.has(celda));
		
		// ┌■ Tiene Compartidas ❌ ► Devuelve un array de array con las celdas de cada rango. Esto preserva los rangos.
		if (compartidas.length === 0) {
			return [celdas_a, celdas_b];
		}		

		// ┌■ Tienen Compartidas ✔️ +  Totalmente Contenido ❔
		const a_en_b = celdas_a.every(celda => set_b.has(celda));
		const b_en_a = celdas_b.every(celda => set_a.has(celda));
		
		// ┌■ Tienen Compartidas ✔️ + Totalmente Contenido ✔️ ► Devuelve un Array con el Rango contenedor.
		if (a_en_b) return [celdas_b];
		if (b_en_a) return [celdas_a];	

		// ┌■ Tienen Compartidas ✔️ + Totalmente Contenido ❌ ► Devuelve todas las celdas en un array. No repetidos
		const union = [...new Set([...celdas_a, ...celdas_b])];
		return [union];
	}

	/**
	 * ## Calcula la intersección de dos rangos y la devuelve como colección de celdas conectadas.
	 * ### • La salida no es un rango único, sino una colección de rangos.
	 * @param {String} nombre_rango_a
	 * @param {String} nombre_rango_b
	 * @returns {Array<Array<String>>|null} Colección de rangos (listas de celdas) o null si falla.
	 */
	_get_interseccion(nombre_rango_a = '', nombre_rango_b = '') {

		// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘
		const celdas_a = this._get_celdas(nombre_rango_a);		
		const celdas_b = this._get_celdas(nombre_rango_b);
		// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘

		if (!celdas_a || !celdas_b) return null;

		const set_b = new Set(celdas_b);
		const compartidas = celdas_a.filter(celda => set_b.has(celda));

		if (compartidas.length === 0) return null;

		const set_a = new Set(celdas_a);
		const a_en_b = celdas_a.every(celda => set_b.has(celda));
		const b_en_a = celdas_b.every(celda => set_a.has(celda));

		if (a_en_b || b_en_a) {
			const rango_grande = a_en_b ? celdas_b : celdas_a;
			const rango_pequeno = a_en_b ? celdas_a : celdas_b;
			const set_pequeno = new Set(rango_pequeno);
			const diferencia = rango_grande.filter(celda => !set_pequeno.has(celda));
			return diferencia.map(celda => [celda]);
		}

		return [compartidas];
	}

	/**
	 * ## Comprueba si un array de celdas forma un bloque continuo (sin saltos).
	 * @param {Array} array_celdas Ej: ['A0', 'A1', 'B0', 'B1']
	 * @returns {Boolean} true si es continuo, false en caso contrario.
	 */
	_is_continuos(array_celdas = []) {
		if (!Array.isArray(array_celdas) || array_celdas.length === 0) return false;

		const celdas_planas = array_celdas.flat();
		if (celdas_planas.length === 0) return false;

		const celdas = celdas_planas.filter(celda => typeof celda === 'string' && this.is_OK(celda));
		if (celdas.length !== celdas_planas.length) return false;

		const celdas_unicas = new Set(celdas);
		if (celdas_unicas.size !== celdas.length) return false;

		let minFila = Infinity;
		let maxFila = -Infinity;
		let minCol = Infinity;
		let maxCol = -Infinity;

		celdas.forEach(celda => {
			const fc = this._celda_to_fc(celda);
			if (!fc) return;
			if (fc.fila < minFila) minFila = fc.fila;
			if (fc.fila > maxFila) maxFila = fc.fila;
			if (fc.columna < minCol) minCol = fc.columna;
			if (fc.columna > maxCol) maxCol = fc.columna;
		});

		if (!Number.isFinite(minFila) || !Number.isFinite(minCol)) return false;

		const total_celdas = (maxFila - minFila + 1) * (maxCol - minCol + 1);
		if (total_celdas !== celdas.length) return false;

		for (let fila = minFila; fila <= maxFila; fila++) {
			for (let col = minCol; col <= maxCol; col++) {
				const celda = this._fc_to_celda(fila, col);
				if (!celda || !celdas_unicas.has(celda)) return false;
			}
		}
		return true;
	}

	/** ### Devuelve celdas_comunes, celdas_no_comunes, celdas_totales(celdas implicadas) de dos rangos */
    _celdas_comunes(rango_a, rango_b) {
        const a = this.api_read_diccionarios(rango_a);
        const b = this.api_read_diccionarios(rango_b);

        if (!a || !b) return null;

        // const celdas_rango_a = rango_a?.geo ? Object.keys(rango_a.geo) : [];
        // const celdas_rango_b = rango_b?.geo ? Object.keys(rango_b.geo) : [];
		const celdas_rango_a = Object.keys(a.geo || {});
        const celdas_rango_b = Object.keys(b.geo || {});

        // Casos base: si un rango no tiene celdas, el resultado es el otro rango
        if (celdas_rango_a.length > 0 && celdas_rango_b.length === 0) {
            return { comunes: [], totales: celdas_rango_a, no_comunes: celdas_rango_a };
        }
        if (celdas_rango_a.length === 0 && celdas_rango_b.length > 0) {
            return { comunes: [], totales: celdas_rango_b, no_comunes: celdas_rango_b };
        }

        const set_a = new Set(celdas_rango_a);
        const set_b = new Set(celdas_rango_b);

        // 1. Celdas Comunes: Intersección (presentes en ambos)
        const celdas_comunes = celdas_rango_a.filter(celda => set_b.has(celda));

        // 2. Celdas Totales: Unión (todas las celdas implicadas sin repetición)
        const celdas_totales = [...new Set([...celdas_rango_a, ...celdas_rango_b])];

        // 3. Celdas No Comunes: Diferencia Simétrica (en A o B, pero no en ambos)
        const set_comunes = new Set(celdas_comunes);
        const celdas_no_comunes = celdas_totales.filter(celda => !set_comunes.has(celda));

        return {
            comunes: celdas_comunes,
            totales: celdas_totales,
            no_comunes: celdas_no_comunes
        };
    }

	/** ### Analiza la relación espacial entre dos rangos 
	 * ```javascript
	 * const parentesco = this._get_tipo_relacion_('rango_matriz', rango_b); ► un nombre de rango y un objeto_rango
	 * const parentesco = this._get_tipo_relacion_('rango_matriz', 'rango_b'); ► dos nombres de rango
	 * const parentesco = this._get_tipo_relacion_(rango_a, rango_b); 	► dos object rango	 
	 * if(parentesco.type === 'CONTENIDO') {console.log(`MAYOR: ${parentesco.mayor} ■ MENOR: ${parentesco.menor}`)}
	 * else if(parentesco.type === 'SOLAPADOS'){console.log('Estan Solapados, tienen celdas en comun.')}
	 * else if(parentesco.type === 'ADYACCENTES'){console.log('Juntitos pero no Revueltos. No celdas en comun.')}
	 * else if(parentesco.type === 'SEPARADOS'){console.log('con Espacio de por medio. No celdas en comun.')}
	 * else {console.log('Typo de Relacion No Registrado')}
	 * ```
	*/
    _get_tipo_relacion(rango_a, rango_b) {
		
		const a = this.api_read_diccionarios(rango_a);
		const b = this.api_read_diccionarios(rango_b);
		if (!a || !b) return null;
		
		const analisis = this._celdas_comunes(rango_a, rango_b);
        if (!analisis) return null;

        const { comunes } = analisis;
        const celdas_a = Object.keys(a.geo || {});
        const celdas_b = Object.keys(b.geo || {});

        // CASO 1: Hay celdas compartidas (Contenido o Solapado)
        if (comunes.length > 0) {
            // Si las comunes son igual al tamaño de alguno de los rangos, uno está dentro del otro
            if (comunes.length === celdas_a.length || comunes.length === celdas_b.length) {
                const a_es_mayor = celdas_a.length >= celdas_b.length;
                return {
                    type: "CONTENIDO",
                    mayor: a_es_mayor ? "rango_a" : "rango_b",
                    menor: a_es_mayor ? "rango_b" : "rango_a"
                };
            }
            return { type: "SOLAPADOS" };
        }

        // CASO 2: No hay celdas compartidas (Adyacentes o Separados)
        // Verificamos si alguna celda de A toca el borde de alguna de B
		const celdas_b_set = new Set(celdas_b);
		const son_adyacentes = celdas_a.some(celda => {
			const coordenada = this._celda_to_fc(celda);
			if (!coordenada) return false;

			const vecinos = [
				this._fc_to_celda(coordenada.fila - 1, coordenada.columna),
				this._fc_to_celda(coordenada.fila + 1, coordenada.columna),
				this._fc_to_celda(coordenada.fila, coordenada.columna - 1),
				this._fc_to_celda(coordenada.fila, coordenada.columna + 1)
			].filter(Boolean);

			return vecinos.some(vecino => celdas_b_set.has(vecino));
		});

        return {
            type: son_adyacentes ? "ADYACENTES" : "SEPARADOS"
        };
    }	
	/** ## Devuelve la ficha rango. Si viene como nombre, Busca por todos los rangos   */
	api_read_diccionarios(rango){
		// ┌• Viene como ''. Le devuelvo todos los rangos de app.
		if(!rango) 
			return this.rangos.app
		if (typeof rango === 'string') {
			return this.rango_repository.obtener(rango, ['rangos']);
		}
		// ┌• Viene como ficha
		if(typeof rango === 'object' && rango.celda_inicio && rango.celda_fin && rango.dimension && rango.geo){
			return rango;
		}
		return null;
	}
	
	/** 🔥🔥
	 * ## Devuelve un sub-rango dentro del rango indicado, con dimensión y celda de inicio dadas.
	 * ### • Valida que la celda de inicio y la dimensión caben dentro del rango base.
	 * ### • Retorna el formato estándar de rango (get_ficha_vacia).
	 * @param {String} nombre_sub_rango Nombre del sub rango.
	 * @param {Object} dimension_sub {filas:int, columnas:int}
	 * @param {String} celda_inicio_sub Celda dentro del rango base.
	 * @returns {Object|null} Ficha de rango o null si no es válido.
	 */
	sub_rango(nombre_sub_rango = '', dimension_sub = { filas: 1, columnas: 1 }, celda_inicio_sub = 'A0') {
		try {
			if (!nombre_sub_rango || typeof nombre_sub_rango !== 'string') throw Error('Nombre de sub-rango no válido');
			nombre_sub_rango = nombre_sub_rango.trim();
			// Who Is sub-rango??? 🔥 🔥 
			
			// Cachamos la dimensión.
			const dimension_fc = this._normalizar_dimension(dimension_sub);
			if (!dimension_fc) throw Error('Dimensión no válida');
						
			// Cachamos 'celda-inicio' y 'celda-fin'
			const fc_inicio = this._celda_to_fc(celda_inicio_sub);
			const fc_fin = this._get_celda_fin(celda_inicio_sub, `${dimension_fc.filas}x${dimension_fc.columnas}`);
			if (!fc_inicio || !fc_fin) throw Error('Celdas no válidas');
			
			// ┌• •••••    ••••• •••••                         •••••••••
			// ┌• Cacho el Rango-Base Sobre el que devolver el sub-rango. 
			const r_matriz = this.read_rango('rango_matriz');
			// Convertimos a {fila,columna} 
			const fc_base_inicio = this._celda_to_fc(r_matriz.celda_inicio);
			const fc_base_fin = this._celda_to_fc(r_matriz.celda_fin);
			if (!fc_base_inicio || !fc_base_fin) throw Error('Celdas del rango base no válidas');

			// Cachamos los límites de la caja(rango-base).
			const minFila = Math.min(fc_base_inicio.fila, fc_base_fin.fila);
			const maxFila = Math.max(fc_base_inicio.fila, fc_base_fin.fila);
			const minCol = Math.min(fc_base_inicio.columna, fc_base_fin.columna);
			const maxCol = Math.max(fc_base_inicio.columna, fc_base_fin.columna);

			//┌■ Funcion anonima para validar que las celdas de inicio y 
			//┌■ fin del sub-rango están dentro de los límites del rango base.
			const dentro_base = (fc) => (
				fc.fila >= minFila
				&& fc.fila <= maxFila
				&& fc.columna >= minCol
				&& fc.columna <= maxCol
			);
			if (!dentro_base(fc_inicio) || !dentro_base(fc_fin)) throw Error('El sub-rango excede los límites del rango base');

			// ┌• • •  Cuando paso por aquí, ya tengo validado que la dimensión y la celda de inicio y fin del sub-rango son correctas y están dentro del rango base. Ahora sólo me queda cachar las celdas que hay dentro de ese sub-rango para devolver su ficha completa.

			const celda_fin = this._fc_to_celda(fc_fin.fila, fc_fin.columna);
			if (!celda_fin) throw Error('No puedo Calcular celda_fin del sub-rango');


			const _sub_rango = this._get_rango_from_cicf(celda_inicio_sub, celda_fin);

			// ┌■ Retorno
			return _sub_rango ? _sub_rango : this._get_ficha_vacia();

		} catch (error) {
			console.log(`❌ Error ::: sub_rango() ::: ${error}`);
			return null;
		}
	}	

	// ■ El parametro de entrada puede ser:
	// 		1- una dimension en formato string '3x4'  o {filas:int, columnas:int}
	// 		2- nombre_rango(string)  
	//   	3- un rango anonimo: { celda_inicio:str, celda_fin:str, dimension:{}, geo:{}, items:{}, values:{} }
	//   	4- un array de rangos (union, pares, nones, interseccion, sillas_ronin)
	// DEVUELVE SIEMPRE UN RANGO (con su ficha completa) O ficha-vacía. 🔥🔥
	X_to_rango(argumento){
		let Ran = null;
		// ┌■■ Validacion de vacío
		if(!argumento) 
			return this._get_ficha_vacia();
		
		// ┌■■ Entra un ARRAY de Rangos
		if (Array.isArray(argumento)) {
			// ┌•• Puede ser: 'union' / 'pares' / 'nones' / 'sillas_ronin' / 'interseccion'
			Ran = this._crear_ghost_desde_array(argumento);
		}else if(typeof argumento === 'string'){
			
			const dimension_fc = this._normalizar_dimension(argumento);

			if(dimension_fc) {
				// ■ dimension '3x4'
				Ran = this._crear_ghost_desde_dimension(dimension_fc.filas, dimension_fc.columnas);
			} else{
				// ■ 'nombre_rango' en d_rangos
				Ran = this._crear_marco_desde_rango(argumento);
			}
		}else if(typeof argumento === 'object' && argumento.celda_inicio && argumento.celda_fin && argumento.geo){
			// ■ Rango Anonimo con ficha completa.
			Ran = this._crear_marco_desde_rango(argumento);
		}else{
			// ■ No se reconoce el formato de entrada.
			return this._get_ficha_vacia();		
		}

		return Ran ? Ran : this._get_ficha_vacia();
	}

	get basics(){return this.rangos.basic;}
	get app(){return this.rangos.app};
}


/**
 * ### Convierte reservas en rangos sin conocer Salon ni los diccionarios internos.
 * ### La creación de la ficha completa se delega para conservar el formato actual.
 */
class Reserva_Range_Mapper {
	/** 
	 * @param {Object} dependencias - Funciones necesarias para mapear reservas a rangos.
	 * @param {Function} dependencias.indice_a_celda - Función que convierte un índice a una celda.
	 * @param {Function} dependencias.crear_ficha - Función que crea una ficha de rango.
	 * @param {Function} dependencias.celdas_a_limites - Función que calcula los límites de un conjunto de celdas.
	 * @param {Function} dependencias.calcular_dimension - Función que calcula la dimensión entre dos celdas.
	*/
	constructor({ indice_a_celda, crear_ficha, celdas_a_limites, calcular_dimension, }) {
		const dependencias = { indice_a_celda, crear_ficha, celdas_a_limites, calcular_dimension };
		for (const [nombre, dependencia] of Object.entries(dependencias)) {
			if (typeof dependencia !== 'function') {
				throw new TypeError(`Reserva__Range_Mapper necesita la función '${nombre}'.`);
			}
		}
		this.func_indice_a_celda = indice_a_celda;
		this.func_crear_ficha = crear_ficha;
		this.func_celdas_a_limites = celdas_a_limites;
		this.func_get_dimension_ci_cf = calcular_dimension;
	}

	/** ### Las reservas del Salon se convierten en un array de rangos.
	 * @param {Array} reservas - [{ reservadores: ['mesa_0'], clientes: ['silla_1', 'silla_2'] }, ...]
	 * @param {Object} indices - mesa_0: 5, silla_1: 6, silla_2: 7, ...
	 * @param {Object} dimension - {filas: 10, columnas: 10}
	 */
	reservas_a_rangos(reservas, indices, dimension) {
		if (!Array.isArray(reservas) || reservas.length === 0) return [];
		if (!indices || typeof indices !== 'object' || Object.keys(indices).length === 0) return [];
		if (!dimension || !Number.isInteger(dimension.filas) || !Number.isInteger(dimension.columnas)) return [];

		const celda_elemento = this._crear_indice_de_celdas(indices, dimension);
		const rangos = [];

		for (const reserva of reservas) {
			const reservadores = Array.isArray(reserva?.reservadores) ? reserva.reservadores : [];
			const clientes = Array.isArray(reserva?.clientes) ? reserva.clientes : [];
			// ┌■■ Es ronin?
			if (reservadores.length === 0 && clientes.length > 0) {
				const rangos_ronin = this._crear_rangos_ronin(clientes, celda_elemento);
				if (rangos_ronin.length > 0) rangos.push(rangos_ronin);
				continue;
			}
			// ┌■■ Todos los elementos de la reserva en un array.
			const elementos = [...reservadores, ...clientes].filter(Boolean);
			if (elementos.length === 0) continue;
			const rango = this._crear_rango_de_reserva( elementos, celda_elemento);	
				
			if (rango) rangos.push(rango);
		}

		return rangos;
	}

	/**
	 * Crea un índice de celdas a partir de los índices y la dimensión.
	 * @param {*} indices 
	 * @param {*} dimension 
	 * @returns 
	 */
	_crear_indice_de_celdas(indices, dimension) {
		// Primero conservamos la relación histórica celda -> elemento. Si dos
		// elementos comparten índice, el último es el que ocupa esa celda.
		const celda_elemento = {};

		for (const [elemento, indice] of Object.entries(indices)) {
			const celda = this.func_indice_a_celda(indice, dimension);
			if (celda) celda_elemento[celda] = elemento;
		}

		return celda_elemento;
	}

	/**
	 * ### ronin son los clientes sin reservadores.
	 * ### Se devuelve un array de rangos de 1x1(cada cliente).
	 * @param {Array} clientes - ['silla_1', 'silla_2', ...]
	 * @param {Object} celda_elemento - {B0: 'silla_1', B1: 'mesa_0', ...}
	 * @returns {Array} - 
	 */
	_crear_rangos_ronin(clientes, celda_elemento) {
		const rangos_ronin = [];

		for (const cliente of clientes) {
			const entrada = Object.entries(celda_elemento)
				.find(([, elemento]) => elemento === cliente);
			if (!entrada) continue;
			const [celda] = entrada;

			const rango = this.func_crear_ficha(celda, '1x1');
			if (!rango) continue;

			rango.values = { [celda]: cliente };
			rangos_ronin.push(rango);
		}

		return rangos_ronin;
	}

	/**
	 * Crea un rango para una reserva dada.
	 * @param {Array} elementos - ['silla_1', 'mesa_0', ...]
	 * @param {Object} celda_elemento - {B0: 'silla_1', B1: 'mesa_0', ...}
	 * @returns {Object|null} - Rango creado o null si no es válido.
	 */
	_crear_rango_de_reserva(elementos, celda_elemento) {
		const elementos_reservados = new Set(elementos);	// Quita duplicados.
		// // dict: {'B0': 'silla_1', 'B1': 'mesa_0', ...}
		const values = Object.fromEntries(
			Object.entries(celda_elemento)
				.filter(([, elemento]) => elementos_reservados.has(elemento)),
		);

		const celdas = Object.keys(values);
		if (celdas.length === 0) return null;

		const limites = this.func_celdas_a_limites(celdas);
		if (!limites) return null;

		const dimension = this.func_get_dimension_ci_cf(limites.celda_inicio, limites.celda_fin);
		if (!dimension) return null;

		const rango = this.func_crear_ficha(limites.celda_inicio, dimension);
		if (!rango) return null;

		rango.values = values;	// dict: {'B0': 'silla_1', 'B1': 'mesa_0', ...}
		return rango;
	}


	
}


/** ## Clase para trabajar con Rangos especificamente de salon(reservas_a_rangos__ por ejemplo) */
class El_Rango_del_Salon extends Wedding_Rangos{
	constructor(instancia_Salon = null){
		if (!instancia_Salon) return null;		
		// ┌■ Llamamos al padre.
		super(instancia_Salon);

		/** ###  [ diccionario de rangos ] de las reservas creadas en Salon
		 
		### • NOTA: Tienen que ser rangos 'temporales' pq las reservas son dinamicas... hay que "gestionarlo" 
		 */
		this.d_reservas = {};
		this.rango_repository.registrar_fuente('reservas', this.d_reservas);
		this.reserva_range_mapper = new Reserva_Range_Mapper({
			indice_a_celda: (indice, dimension) => this._get_celda(indice , dimension),
			crear_ficha: (celda_inicio, dimension) => this._crear_ficha_rango(celda_inicio, dimension),
			celdas_a_limites: this.__get_cicf_from_celdas.bind(this),
			calcular_dimension: (celda_inicio, celda_fin) => this._get_dimension(celda_inicio, celda_fin, false),
		});
	}

	registrar_rangos_reservas(rangos, prefijo = 'reserva') {
	/** Registra de forma explícita rangos ya construidos para una reserva. */
		if (!Array.isArray(rangos)) return [];
		const nombres = [];
		for (const rango of rangos.flat()) {
			if (!rango || typeof rango !== 'object') continue;
			const nombre = this._get_nombre_rango(prefijo, this.d_reservas);
			
			if (this.rango_repository.guardar('reservas', nombre, rango)) 
				nombres.push(nombre);
		}
		return nombres;
	}

	/** ### Convierte un array de reservas en un array de rangos. */
	_reservas_a_rangos(arr_reservas = [], dicc_indices = {}, dimension_aplicada = null) {
		try {
			const dimension_fc = this._normalizar_dimension(dimension_aplicada);
			if (!dimension_fc) {
				return [];
			}
			return this.reserva_range_mapper.reservas_a_rangos(arr_reservas, dicc_indices ,dimension_fc);
		} catch (error) {
			console.log(`❌ Error ::: reservas_a_rangos() ::: ${error}`);
			return [];
		}
	}

	// Este metodo es de pruebas y tiene que ser borrado. aquí voy a poner todos los metodos llamados desde 
	// cargar_elementos_salon 
	__pruebas_union_interseccion(){
		
		// 👀 Quiero convertir la union en un rango.
		const celdas_union = this._get_union('rango_fila_0','rango_fila_1');

		celdas_union.forEach(ele =>{
			const ci_cf = this.__get_cicf_from_celdas(ele);
			if(ci_cf){
				const union_range = this._get_rango_from_cicf(ci_cf.celda_inicio , ci_cf.celda_fin);
				if(union_range){
					const union_name = this._get_nombre_rango('union');
					this.registrar_ficha(union_name , union_range);
				}
			}
		});

		// 👀 ┌• interseccion fila - columna = 'Celda'
		const celdas_intersección = this._get_interseccion('rango_columna_1','rango_fila_0');
		// 👀 ┌• rangos que no tienen en comun = null
		const celdas_intersección_2 = this._get_interseccion('rango_columna_1','rango_columna_2');
		// 👀 ┌• rango con sigo = []
		const celdas_intersección_3 = this._get_interseccion('rango_columna_1','rango_columna_1');
		
		// 👀 ES RANGO CONTINUO.
		const es_rng_continuous =  this._is_continuos('rango_prueba');
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■	
		console.log('👀👀👀 PRUEBAS UNION-INTERSECCION 👀👀👀 ')
		console.log(`• CELDAS-UNION: ${celdas_union} ➿ ${this._is_continuos(celdas_union)} 
• CELDAS-INTERSECCION-1:${celdas_intersección} ➿ ${this._is_continuos(celdas_intersección)} 
• CELDAS-INTERSECCION-2 NULL:${celdas_intersección_2} ➿ ${this._is_continuos(celdas_intersección_2)}
• CELDAS-INTERSECCION-3 []:${celdas_intersección_3} ➿ ${this._is_continuos(celdas_intersección_3)} `);
	}

	
	/** ## Sobre-Escribe el método de la clase 'Wedding_Rangos' añadiendo el diccionario de reservas   */
	api_read_diccionarios(rango){
		// ┌■ Viene como ''. 
		if(!rango) return null;
		// ┌■ Viene como nombre de rango. 
		if (typeof rango === 'string') {
			return this.rango_repository.obtener(rango, ['rangos', 'reservas']);
		}		
		// ┌■ Viene como objeto rango. Lo devuelvo tal cual.
		if(typeof rango === 'object' && rango.celda_inicio && rango.celda_fin && rango.dimension && rango.geo){
			return rango;
		}
		return null;
	}
	/** ### SOBRE-ESCRIBE de Working_Rangos Hace pull a todos los Rangos Registrados */
	pull_all(){
		// this.super();
		super.pull_all();
		Object.keys(this.d_reservas).forEach(nombre_rango => { this.to_pull(nombre_rango); });
		return true;
	}	

	/** ### Entra una reserva y devuelve las baldosas del rango de la reserva.
	* ### Tengo que pasar la reserva a rango  y 
	* ### en el rango.items con los ids de las baldosas */
	get_baldosas_reserva(id_el){
	}
	
	
}

// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ FIN CLASE  WORKING_RANGE
