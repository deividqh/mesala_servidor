// ███████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
// * C L A S E  "MyDiv"  				Clase PARA DEFINIR UNA ESTRUCTURA DE DATOS que se usa en la clase Matriz_to_MyDiv
//											ES UNA BALDOSA DEL LA LISTA/MATRIZ DEL e_Salon 
// ███████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
class MyDiv {
	elemento_div;				// ► el objeto div.

	HOW = {
		Tag: '',			// ► reserva. 			
		Flag: 0         	// bandera reservada
	};
	scan = {
		n: 	false ,		//  Mesa_0 	► es el id
		s: 	false ,     //  Sila_1  ► es el id del div que está al Sur
		e: 	false ,     //  Mesa_1
		w: 	false ,     //  null	 	► Significa que hay baldosa y está free.
		ne: false ,     //  false    	► Significaa que no hay 'ne'. es una esquina(3) o un borde(5). NO HAY BALDOSA.
		nw: false ,     //  Silla_0	► es el id 
		se: false ,     //  Silla_2	► es el id 
		sw: false       //  Silla_3	► es el id 
	}

		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ VARIABLE DE SCANNER.
		// a) Hay que tener en cuenta que no todos los divs de la matriz tienen todas las coordenadas.
		// 		• el div con menos coordendas es una esquina, que tiene 3 coordenadas.
		// 		• un borde tiene 5 coordenadas.
		// 		• un div-central tiene 6 coordenadas.
		// b) Solamente se hace scanner de las mesas del salon.
		// c) Los valores Posibles son: 
		// 		• false ► significa que no hay coordenada.
		// 		• null ► significa que no hay elemento en esa coordenada.
		// 		• id ► del elemento que está en esa coordenada.
	
	constructor(elemento_div = null,  Status = 0, Tag = 0, Flag = 0) {
		this.elemento_div = elemento_div;

		this.HOW.Tag = Tag;			    //estado inicial del Tag (String)
		this.HOW.Flag = Flag;			//estado inicial del Flag (int)
		
		this.scan.n = false;		// false significa que no tiene celdas alrededor.
		this.scan.s = false;		// false significa que no tiene celdas alrededor.
		this.scan.e = false;		// false significa que no tiene celdas alrededor.
		this.scan.w = false;		// false significa que no tiene celdas alrededor.
		this.scan.ne = false;		// false significa que no tiene celdas alrededor.	
		this.scan.nw = false;		// false significa que no tiene celdas alrededor.
		this.scan.se = false;		// false significa que no tiene celdas alrededor.
		this.scan.sw = false;		// false significa que no tiene celdas alrededor.
		
	};
} // ■■■■■■■■■■ FIN CLASE MYDIV



// ███████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
// 1. Listas * (Requieren espacio extra)
	/**
	 * @description 
	 * ### Titulo gran | ### Titulo med | ### Titulo peq ([#, ##, ###] + espacio) Pone tipo titulo.
	 * * Elemento 1 (asterisco + espacio para generar una list de elementos.)
	 * * Elemento 2 (espacio antes y después del asterisco)
	 * 
	 * ```javascript
	 * console.log('ejemplo de codigo en comentarios: triple comilla invertida + lenguaje + \n + codigo')
	 * ```
	 * ⚠️ **IMPORTANTE:** para advertencias.
	 * 💡 **TIP:** para consejos.
	 * 🚫 **DEPRECATED:** para código antiguo.
	 * 
	 *  **Negrita** (Dos espacios aseguran la interpretación)
	 *  
	 *  {@link Nombre_de_una_funcion}
	 */

// ███████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████


const CSS_HREF_LINK  = './css/div_x_div.css';	//Path al archivo .css que gestiona los estilos de Matriz. !!IMPORTANTE

// ███████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
// ███████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

class Work_ClassName {
	// STATIC PARAM 🧍‍♂️
	static CLASSNAME_DIV_BYDEF = 'claseDivXdefecto';					//estilo por defecto para div en div_x_div.css

	/**
	 * ### 
	 * @param {*} path_css
	 * @returns null si no se encuentra el archivo.
	 */
	// constructor(path_css = Work__ClassName.LINK_FILEPATH_XDEF) {
	constructor(path_css = CSS_HREF_LINK) {
		
		// super();															// ■ Llamada a Head_Drive (padre)
		
		if (typeof (path_css) != 'string')  path_css = CSS_HREF_LINK; 
		if (path_css.trim() == '')  		path_css = CSS_HREF_LINK;
		if (path_css == null ) 				path_css = CSS_HREF_LINK;		// Asigna el path por defecto si el usuario no mete path 
	}		
		
	/**
	 * ## 🚫 Solo usado para Logs. 
	 * ### Obtiene el className de un elemento dom 
	 * @param {*} elemento_dom , puede ser un id (string) o un objeto(div) 
	 * @returns {string|boolean} * la cadena className del objeto(string).
	 * 			* false(boolean), si el argumento pasado no se corresponde con un div(ni por id ni por objeto)
	 */
	get_className(elemento_dom = null) {
		if (typeof (elemento_dom) == 'string') {
			if (!document.getElementById(elemento_dom)) {
				return false;
			}
			return document.getElementById(elemento_dom).className;
		} else if (typeof (elemento_dom) == 'object') {
			return elemento_dom.className;
		} else {
			return false;
		}

	}
	
	/**
	 * ### Busca una clase en el className y retorna un booleano SI LA ENCUENTRA.
	 * @param {*} elemento_dom Objeto sobre el que se busca la clase.
	 * @param {*} classNameSearch clase a buscar.
	 * @returns {boolean} 
	 * 		* true, encuentra la clase  
	 * 		* false, no encuentra la clase.
	 */
	is_classname_on(elemento_dom = null, classNameSearch = '') {
		if (typeof (classNameSearch) != 'string') return false;		//classNameSearch debe ser un string
		if (typeof (elemento_dom) != 'object') return false;	//elemento_dom debe ser un objeto
		if (elemento_dom == null) return false;	//elemento_dom no puede ser nulo
		if (classNameSearch.length <= 2) return false;	//mínimo 2 letras.
		// Working Procedure:........................>
		if (elemento_dom.className.indexOf(classNameSearch) < 0) return false;	
		return true;
	}
	
	/**
	 * ### Establece una clase única, sustituyendo todo lo que hubiera antes ....de Un sólo Objeto 
	 * @param {object} elemento_dom elemento del dom. No su id.
	 * @param {string} classname_to_set nombre de la clase que se quiere poner.
	 * @returns {boolean} true/false ( correcto / error )
	 */
	_set_className_unique(elemento_dom, classname_to_set = Work_ClassName.CLASSNAME_DIV_BYDEF) {
		if (typeof (elemento_dom) != 'object') return false;			//elemento_dom debe ser un objeto
		if (elemento_dom == null) return false;						//elemento_dom no puede ser nulo
		if (typeof (classname_to_set) != 'string') return false;	//classname_to_set debe ser un string

		elemento_dom.className = classname_to_set;
		return true;
	}

	/**
	 * ## Añade una o mas clases a las clases a un elemento del Dom
	 * @param {object} elemento_dom elemento del Dom.
	 * @param {string} className_to_add nombre de la clase a añadir.
	 */
	add_className(elemento_dom = null, className_to_add = '') {
		if (typeof (className_to_add) != 'string') return false;
		if (typeof (elemento_dom) != 'object') return false;

		elemento_dom.className += ' ' + className_to_add;
	}

	/** 🚫
	 * ### Alternar entre dos nombres clase ....de Un sólo Objeto 
	 * @param {*} elemento_dom 
	 * @param {*} oldClassName 
	 * @param {*} newClassName 
	 * @returns 
	 */
	switch_className(elemento_dom = null, oldClassName = '', newClassName = '') {
		if (typeof (elemento_dom) != 'object') return false;
		if (typeof (oldClassName) != 'string') return false;
		if (typeof (newClassName) != 'string') return false;
		//______________________
		//Proceso:
		//console.log('Switch Antes)\nclassName de ' + elemento_dom.id + '->' + elemento_dom.className); //borrar
		if (this.is_classname_on(elemento_dom, oldClassName) == true) {
			let classAux = elemento_dom.className;
			let aux = classAux.replace(oldClassName, newClassName);
			elemento_dom.className = aux;
		}
		//console.log('Switch Despues\nclassName de ' + elemento_dom.id + '->' + elemento_dom.className)	//borrar
	}

	/**
	 * ### Elimina una clase ...de Un sólo Objeto:
	 * @param {*} elemento_dom 	objeto del Dom.
	 * @param {*} classname_to_delete nombre de la clase a eliminar.
	 * @returns {boolean} true/false ► correcto/error en el metodo.
	 */
	elimina_one_className(elemento_dom = null, classname_to_delete = '') {
		try {
			if (this.is_classname_on(elemento_dom, classname_to_delete) == true) {
				let a = elemento_dom.className;		// Obtiene el className del elemento
				if (a == '') return false;			// Si no tiene className, no hace nada.
				a = a.replace(classname_to_delete, '');	// Elimina la clase pasada como argumento
				elemento_dom.className = a;			// Asigna el nuevo className al elemento
			}
			return true;
		} catch (error) {
			console.log('Work__ClassName:elimina_one_className: Error--> ' + error.message);
			return false;
		}
	}
	
	/**
	 * ### Elimina el className de un elemento del Dom
	 * @param {object} elemento_dom 
	 */
	className_reset(elemento_dom = null) {
		if (typeof (elemento_dom) != 'object') return false;
		if (elemento_dom == null) return false;

		elemento_dom.className = '';
	}
	
	/** 🚫
	 * ### Asigna el className de un objeto Div a Otro.
	 * @param {*} elemento_dom_origen 
	 * @param {*} elemento_dom_destino 
	 */
	copy_paste_className(elemento_dom_origen, elemento_dom_destino) {
		this.className_reset(elemento_dom_destino);
		let strClassNameModelo = elemento_dom_origen.claseName
		elemento_dom_destino.claseName = strClassNameModelo + '';
	}

} // ■■■■■■■ FIN CLASE Work__ClassName 


// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 
//  									M A T R I C E S
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

/**
 * ## Matriz_Plana define una clase que gestiona un array lineal como una matriz virtual. 
 * 	  Se basa en conocer el número total de items y el número de columnas que queremos para formar una matriz lógica donde pueda obtener fila , columna por número de item ... y viceversa.
 * @param {*}   columnas  El Numero de Columnas que queremos que tenga la matriz. (Oblig)
 * @param {*}   lista_elemento_dom  Si tenemos una lista de elementos Dom ya preparada. (Opc)
 */
class Matriz_Plana extends Work_ClassName {
	//
	matriz_plana = null;              // es una lista que representa al array por sus elementos introducidos.
	columnas = 0;        //numero total de columnas de la matriz(se establece).
	filas = 0;           //numero total de filas actuales(va creciendo segun se introducen divs en la matriz).
	
	/**
	 * @param {*} columnas Numero de columnas que va a tener la matriz... •12 (Oblig)
	 * @param {*} lista_elemento_dom Numero de elementos(items) que va a tener la matriz:
	 * ```javascript
	 * [obj_div_0 , obj_div_1 , obj_div_2 ,....]
	 * [id_div_0  , id_div_1  , id_div_2  ,....]
	 * ```
	 */
	constructor( columnas , lista_elemento_dom = null) {
		try {
			// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
			super(); // Llamada al constructor de Work__ClassName
			// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
			// ■ matriz_plana
			this.matriz_plana = [];
			if (!this._is_lista_OK(lista_elemento_dom)) lista_elemento_dom=[];
			this.matriz_plana = lista_elemento_dom;				// • Si se tiene una lista de elementos. si no se tiene(null): this.matriz_plana = []	
			// ■ Columnas
			if (!Number.isSafeInteger(columnas) || columnas < 0 ) return false;
			this.columnas = columnas;			
			// ■ Hay que calcular las filas siempre que cambien ó cambie el •numero_columnas ó •numero_items.
			const total_filas = this.total_filas();      	
			if (total_filas === false) {
				this.filas = 0;
			}else{
				this.filas = total_filas;}
			
			this.WC = new Working_Celdas(this);
		} catch (e) {
			console.log('❌ ERROR ► contructor Matriz_Plana: \n' + e.message);
			return false;
		}
	}

	// ■■■■■■■■■■■■■■■■■ VALIDADORES
	// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
	/**
	 * ### Valida que un indice es Correcto(Entero positivo, en el rango de la matriz.)
	 * @param {number} indice de la matriz a evaluar.
	*/
	is_indice_OK(indice){
		// ■ Validación que exista la matriz
		if (!this.matriz_plana || !Array.isArray(this.matriz_plana)) return false;		
		// ■ Validación de parámetros: NUMERO - ENTERO - POSITIVO
		if (typeof indice !== 'number') return false;
		if (!Number.isInteger(indice) ) return false;
		if ( indice < 0) return false;				
		// ■ Validación de rango válido en la matriz
		if (indice >= this.matriz_plana.length) return false;				
		return true
	}
	/**
	 * ### Comprueba que desde existe en la matriz, 
	 * ### comprueba que hasta existe en la matriz 
	 * ### y comprueba que desde < hasta.
	 * @param {number} desde indice de inicio
	 * @param {number} hasta indice final
	 * ```javascript 
	 * * is_desdehasta_OK(0,10)  ► desde indice Zero hasta indice 10 ✔️
	 * * is_desdehasta_OK(10,0) ► desde indice 10 hasta indice 0  ❌
	 * ```
	*/
	is_desdehasta_OK(desde, hasta){
		// ■ Validación de parámetros
		if ( !this.is_indice_OK(desde) ) return false;
		if ( !this.is_indice_OK(hasta) ) return false;			
		// ■ Validación que desde no sea mayor que hasta
		if (desde > hasta) return false;		
		return true;
	}
	/**
	* ### Valida que la this.matriz_plana existe y es un array de tipo lista.
	* @use	
	* ```javascript
	* for (const elemento of array_a_validar) if (Array.isArray(elemento)) return false;						
	* ```
	* @param {array} matriz_a_validar Array tipo lista 	[, , , ]	
	* @examples
	* ```javascript
	*	* _is_lista_OK([1, 2, 3]);      ► true
	*	* _is_lista_OK(["a", "b", 5]);  ► true
	*	* _is_lista_OK([]);             ► true (array vacío cuenta como unidimensional)
	*	* _is_lista_OK([1, [2], 3]);    ► false (contiene un array)
	*	* _is_lista_OK({});             ► false (objeto)
	*	* _is_lista_OK(null);           ► false
	*	* _is_lista_OK("hola");         ► false
	* ```
	*/
	_is_lista_OK(matriz_a_validar) {
		if (matriz_a_validar == null || !Array.isArray(matriz_a_validar)) {
			return false;
		}
		// Verifica que ningún elemento sea un array (para asegurar que es unidimensional)
		return !matriz_a_validar.some(elemento => Array.isArray(elemento));
	}

	// ■■■■■■■■■■■■■■■■■ CRUD
	// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
	/** 🚫
	 * ### 
	 * @param {ElementoDom} puede ser cualquier elemento del dom sobre el que se quiera usar matriz. lo normal = Div
	 * @param {number} indice  
	*/
	add_item(elemento){	
		if (!this._is_lista_OK(this.matriz_plana)) return false;	
		this.matriz_plana.push(elemento);						
		this.filas = this.total_filas();      	// • Las filas hay que calcularlas siempre que cambien ó •numero_columnas ó •numero_items.
		if (!this.filas) this.filas = 0
	}
	/** 🚫
	 * ### Devuelve un console.log ► indice , objeto, fila, columna
	 * @param {number} arg1 1► fila-columna, 2► Índice(3) 3► celda(B2) .... en this.matriz_plana
	 * @param {number} arg2 1► Tiene que ser columna obligatoriamente o null
	*/
	read(arg1, arg2 = null){
		if (!this._is_lista_OK(this.matriz_plana)) return false;        
        const indice = this.WC.X_to_indice(arg1, arg2); // Delegamos la "traducción" al método universal        
        if (indice === false) return false;

		for (let i = 0; i < this.matriz_plana.length; i++) {
			console.log(`indice: ${i} elemento: ${this.matriz_plana[i].elemento_dom.id} fila: ${this.numero_fila(i)}, columna: ${this.numero_columna(i)}`);
		}
	}
	/** 🚫
	 * ### 
	 * @param {any} item cualquier elemento que se quiera meter en una lista plana y ser tratado como matriz de dos dimensiones
	 */
	update(old_item, new_item){
		if (!this._is_lista_OK(this.matriz_plana)) return false;	// Validación de la matriz
		const indice = this.matriz_plana.indexOf(old_item);
		if (indice === -1) {
			console.error('❌ Elemento no encontrado en la matriz.');
			return false;	// El elemento no existe en la matriz
		}
		this.matriz_plana[indice] = new_item;		
	}
	/** 🚫
	 * ### Elimina un item de la matriz_plana. y matriz_plana pasará a tener un elemento menos
	 * @param {number} arg1 1► fila-columna, 2► Índice(3) 3► celda(B2) .... en this.matriz_plana
	 * @param {number} arg2 1► Tiene que ser columna obligatoriamente o null
 	 * @example 
	 * 		delete_item(); 	► Elimina el último elemento si lo hay.
	 * 		delete_item(5); ► Elimina la celda de indice 5.
	 * 		delete_item(3,5); ► Elimina la celda de fila 3 y columna 5.
	 * 		delete_item(B2);  ► Elimina la celda B2.
	*/
	delete_item(arg1, arg2=null){
		if (!this._is_lista_OK(this.matriz_plana)) return null;      // Validación de la matriz   
        const indice = this.WC.X_to_indice(arg1, arg2); // Delegamos la "traducción" al método universal    		    
		try {
			if (indice === false) {
				const item_deleted = this.matriz_plana.pop();
				return item_deleted;
			}else{
				const item_deleted = this.matriz_plana.splice(indice, 1);
				return item_deleted;
			}
		} catch (error) {
			console.log([`❌ Error en Delete_item ► ${error.message}`])
		}
	}
	/** 🚫
	 * ###   * Borra todas las entradas de la matriz:
	 * @returns {boolean} - Retorna true si se realizó la operación con éxito, false en caso contrario.
	 */  
	reset_all() {
		try {
			if (!this._is_lista_OK(this.matriz_plana)) return null;
			this.matriz_plana.splice(0, this.matriz_plana.length);			// Elimina elementos desde el 0 hasta el final.
			return true;
		} catch (e) {
			console.log('❌ MatrizPlana - reset_all: \n' + e.message);
			return false;
		}
	}
	// ■■■■■■■■■■■■■■■■■ SACA DATOS DE LA CLASE
	// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
	/**
	 * ## Devuelve filas y columnas en matriz_plana {filas, columnas} 
	 * @returns {object}  { filas, columnas } devuelve un objeto tipo filas:5 , columnas:7
	 * * {5, 3} ► matriz 5x3  
	 * * {0, 0} ► error.
	 */
	get_dimension_matriz() {
		if (!this || typeof this !== 'object') return { filas: 0, columnas: 0 };
		// Columnas
		const cols = this.columnas; 
		const columnas = Number.isInteger(cols) && cols >= 0  ? cols : 0;
		
		// Filas
		let filas = 0;
		if (typeof this.total_filas === 'function') {
			const total_filas = this.total_filas();
			filas = Number.isInteger(total_filas) && total_filas >= 0 ? total_filas : 0;
		} else if (Number.isInteger(this.filas)) {
			filas = this.filas;
		}
		return { filas, columnas };
	}
	/**
	* ## Asigna y devuelve el numero de filas en funcion de:
	* #### 1.- Numero de columnas 
	* #### 2.- Numero total de elementos que hay en la this.matriz_plana.
	* @returns {integer}  
	```javascript 
	this.filas 
	```
	*/
	total_filas() {
		try {
			// Validacion:
			if (!this._is_lista_OK(this.matriz_plana)) return false;
			// Proceso:
			if (this.columnas == 0) return 0;				                
			let cociente = Math.floor(this.matriz_plana.length / this.columnas);	
			let resto = this.matriz_plana.length % this.columnas;
			this.filas = resto == 0 ? cociente : cociente + 1;
			return this.filas;
		} catch (e) {
			console.error(`❌ total_filas() ► ${e.message}\nNombre del error: ${e.name}\nStack: ${e.stack}`);
			return false;
		}
	}
	/**
	* ###  Entra un numero elemento de la lista this.matriz_plana unidimensional
		* y retorna el numero de FILA que ocupara en bidimensional
		* depende de: filas y columnas.
	* @param {number} arg1 puede ser una celda ('B3', 'A1') o un numero de indice en la matriz (3, 4, 0...).
	* puede ser {fila, columna} aunque se trata de averiguar la fila. si pasamos fila, columna, la fila YA la sabemos.
	* @returns {} numero entre 0 y N [0,N] o bien false si algo no va bien.
	*/
	numero_fila(arg1) {		
		if (!this._is_lista_OK(this.matriz_plana)) return false;        
		if (this.columnas === 0) return 0;
        
		const indice = this.WC.X_to_indice(arg1); 		// Delegamos la "traducción" al método universal        
        if (indice === false) return false;
		const fila = Math.floor(indice / this.columnas);		// Cálculo directo de la fila
		return fila;
	}
	/**
	 * ### Calcula el número de columna correspondiente a un índice en un array unidimensional
	 * que representa una matriz bidimensional
	 * @param {number} arg1 - Índice(3) o celda(B2) en this.matriz_plana
	 * @returns {number} - Número de columna (0-based) o false si el índice es inválido
	 */
	numero_columna(arg1) {			
		if (!this._is_lista_OK(this.matriz_plana)) return false;        
        const indice = this.WC.X_to_indice(arg1); // Delegamos la "traducción" al método universal        
        if (indice === false) return false;

		return indice % this.columnas;	// Cálculo directo de la columna... resto del total entre el número de columnas
	}
	/**
	 * Obtiene el elemento de matriz_plana usando cualquier formato de entrada.
	 * @param {number|string|Working_Celdas} arg1 puede ser un indice(5), una fila (5, _) o una celda ('B2')
	 * @param {number|null} arg2 puede ser una columna (_, 3) o null 
	 * SOLO SI arg1 es fila, arg2 PUEDE SER COLUMNA, EN CASO DE 'indice' ó 'celda', arg2 = null
	 * @returns {MyDiv|null} RETORNA EL OBJETO ALMACENADO EN LA MATRIZ(....será MyDiv)
	*/
    _at(arg1, arg2 = null) {
		if (!this._is_lista_OK(this.matriz_plana)) return null;        
        const indice = this.WC.X_to_indice(arg1, arg2); // Delegamos la "traducción" al método universal        
        if (indice === false) return null;
        return this.matriz_plana[indice];
    }	
	
	
	// ■■■■■■■■■■■■■■■■■ GETTER'S & SETTER'S
	// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
	/**
	 * ###  Asigna el numero de items de la matriz. Recalcula el número de filas. El número de columnas se mantiene.
	 */
	set matriz_plana(lista_elemento_dom) {
		try {
			//Validacion: 
			if (lista_elemento_dom == null || !Array.isArray(lista_elemento_dom) ) {
				// this.matriz_plana = []
				return false;
			}
			//
			this.matriz_plana = lista_elemento_dom;
			this.filas    = this.total_filas();
			
		} catch (e) {
			console.log('❌ Matriz_Plana - set matriz_plana: ' + e.message + '\n' + 'Nombre: ' + e.name);
		}
	}

	/**
	 * ###  devuelve this.matriz_plana 
	 */        
	get matriz() {
		if (!this._is_lista_OK(this.matriz_plana)) this.matriz_plana = []				// si this.matriz_plana no fuera un array se le asigna array vacío.
		return this.matriz_plana;	
	}

	/**
	 * ###  Asigna el numero de las columnas...y actualiza el número de filas. No cambia el número de items de lista_Base_Div
	 */
	set columnas(numeroColumnas) {
		//Validacion:
		if (numeroColumnas == null || numeroColumnas == '') return 0;
		if (isNaN(numeroColumnas) == true) return 0;
		if (numeroColumnas < 0) numeroColumnas = -numeroColumnas;
		if (numeroColumnas == 0) return 0;
		//
		this.columnas = numeroColumnas;
		this.filas    = this.total_filas();
	}

	/**
	 * ###  Obtiene el numero de columnas de la this.matriz_plana.
	 */        
	get columnas() {
		return this.columnas;
	}

}
// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘   FIN CLASE Matriz_Plana


// ███████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
// ███████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
// * C L A S E  "Matriz_to_MyDiv"  	
// ███████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
// ███████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████

// ■■■■ Clase que mantiene ( insertar / editar / eliminar / Buscar / Show) un Array de objetos [MyDiv] ► (matriz) en un contenedor padre ► (this.contenedor_div_x_div).

// • TODOS LOS DIVS TIENEN LOS MISMOS className('estiloBaldosa', 'estiloSalon') inicialmente 
// dentro de  la misma Hoja de Estilos (stylesDvd.css) • • • por Defecto .... Hereda de Work__ClassName

// • Se pueden poner ESTILOS DIFERENTES a cada DIV,  dependiendo del FLAG o del TAG asignado POSTERIORMENTE.
// • Se puede manejar el head de la aplicacion para editarlo dinamicamente(CRUD sobre el Head).  ► obj_Div_X_Div.head_drive.[add__etiqueta, addTitle, updateURL...]

// import { Matriz_Plana } from './matriz_dvd.js'; // ■■■■■■ 
class Matriz_to_MyDiv extends Matriz_Plana {
	// STATIC PARAM'S 🧍‍♂️
	static FAMILY_NONAME = 'NoNfamily';				//Para los div no nombrados explicitamente:
	static CONTENEDOR_NONAME = 'ContenedoR';		//Cuando se crea una instancia sin contenedor se crea un contenedor de id=ContenedorNONAME_x
	static PREFIJO_TAG = '#';		//LOS TAG EMPIEZAN POR '#_' 
	static FLAG_ZERO = 0;			//Una bandera para identificar objetos y darle propiedades.
	//
	// ■■■■■■ Stack de los datos Importantes de la clase ■■■■■■■
	contenedor_div_x_div = null;	// ► Objeto contenedor de los divs creados y almacenados en arr.	
	my_div_one = new MyDiv();		// ► Primer Div. 

	family = '';					// ► Nombre a partir del cual se generan todos los ID de los divs.	Id_PATRON_0 , Id_PATRON_1 .....
	id_div_contenedor = '';
	div_maestro = null;
	columnas = 8;
	filas = 8;
	// tag_baldosas = '#Baldosa';

	
	/**
	 * ### 
	 * @param {*} family 		Nombre comun para los divs. Si Capulettos -> Capulettos_0, Capulettos_1...
	 * @param {*} id_div_contenedor 	Contenedor donde meter los divs creados con la clase.
	 * @param {*} div_maestro, 			div donde meter el contenedor de los divs. es un contenedor de un contenedor. Será document.body si no se pasa argumento.
	 * 								si se pasa argumento div_maestro.appendChild(this.contenedor_div_x_div) 
	*/
	constructor(family = '', id_div_contenedor = '', div_maestro = null, columnas = 8, filas = 8) {
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		// ■■ LLAMADA AL PADRE
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		try {
			super(columnas);							// De una lista plana obtenemos las referencias de una lista bidimensional.		
		} catch (error) {
			console.log(`❌​ ERROR Matriz_to_MyDiv::: constructor::: ${error.message}`);
		}
		
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		// ■■ ASIGNACION DE VARIABLES.
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		
		// ■■■■■■■■■■■■■■■■■■■■■■■■
		// ■ FAMILY: 
		if (typeof (family) != 'string' || family.trim() === '' || document.getElementById(family) || document.getElementById(family+'_0')) 
			this.family = Herramientas._get_secuencial_dom(Matriz_to_MyDiv.FAMILY_NONAME);			
		else		
			this.family = family;
		
		// ■■■■■■■■■■■■■■■■■■■■■■■■
		// ■ id_div_contenedor 	
		if (id_div_contenedor == null || typeof (id_div_contenedor) != 'string' || id_div_contenedor.trim() == '') {			
			this.contenedor_div_x_div = document.createElement('div');
			this.contenedor_div_x_div.id = Herramientas._get_secuencial_dom(Matriz_to_MyDiv.CONTENEDOR_NONAME);
		} else if (!document.getElementById(id_div_contenedor)) {			// •IF► el contenedor pasado NO EXISTE PREVIAMENTE en EL DOC Html.
			this.contenedor_div_x_div = document.createElement('div');
			this.contenedor_div_x_div.id = id_div_contenedor;					
		} else {															
			this.contenedor_div_x_div = document.getElementById(id_div_contenedor);	// • IF ► el contenedor pasado EXISTE en Html...lo cacho como contenedor
		}		

		// ■■■■■■■■■■■■■■■■■■■■■■■■
		// ■ CONTENEDOR DEL CONTENEDOR 		
		if(!div_maestro) 		// • La clase está pensada para que sea en el document.body en caso de div_maestro = null
			div_maestro = document.body;		
		this.div_maestro = div_maestro;
		// ◘ añadimos el contenedor de la matriz al body.
		this.div_maestro.appendChild(this.contenedor_div_x_div);		
		
		// ■■■■■■■■■■■■■■■■■■■■■■■■
		// ■ NUMERO COLUMNAS: 
		if (typeof (columnas) != 'number' || columnas <= 0) 	
			this.columnas = 8;
		else 									
			this.columnas = Math.floor(columnas);
		// ■■■■■■■■■■■■■■■■■■■■■■■■
		// ■ NUMERO FILAS: 		
		if (typeof (filas) != 'number' || filas <= 0) 		
			this.filas = 8;
		else
			this.filas = filas;
		
		// ■■■■■■■■■■■■■■■■■■■■■■■
		// ■ Crea un primer div que será el patron de clonacion
		this.my_div_one = this._crear_mydiv();		
		if (!this.my_div_one) throw ('​❌​ Error al  Crear 1º Div  :(');
		
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		// ■ AÑADO LAS BALDOSAS AL SALON
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		this._set_total_mydivs( this.filas * this.columnas );
		this.set_classname_container('estiloSalon');		// Y asigno la clase al conetenedor.
    	this.set_className('estiloBaldosas');				// Y asigno la clase a las baldosas.
		
		// ■■■■■■■■■■■■■■■■■■■
		// LOG Estados 🖥️​​ 
		this.log_salon();
		
		// ■■■■■■■■■■■■■■■■■■■■■
		// ​🧩​🧩​  RANGOS 🧩​🧩​​
		// ■■■■■■■■■■■■■■■■■■■■■
		this.W_R = new Working_Celdas(this); 	// Instanciamos el gestor de RANGOS y CELDAS de la matriz.		
		
		

	}	// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ FIN CONSTRUCTOR

	/**
	 * ### Imprime un Logg de salon por consola.
	 */
	log_salon(){
		let txt = `🖥️​​ LOG ESTADOS from:  'Matriz_to_MyDiv' | 'Matriz__Plana' | 'Work__ClassName'`;
		txt += '\n • Familia/Nombre Base de Baldosas ► ' + this.family ;
		txt += `\n • Div Contenedor Maestro ► ${this.div_maestro.id ? this.div_maestro.id : 'document.body'}`;
		txt += '\n • Contenedor del Salon ► ' + this.contenedor_div_x_div.id;		
		txt += '\n • Primera Baldosa de la Matriz ► ' + this.my_div_one.elemento_div.id;
		txt += `\n • Clase en ${this.contenedor_div_x_div.id} ► ${this.contenedor_div_x_div.className}`;
		txt += `\n • Clase en Las Baldosas ► ${this.matriz_plana[0].elemento_div.className} `;
		txt += `\n • Número de Baldosas ► ${this.matriz_plana.length} `;
		txt += `\n • Dimensión de la matriz ► ${this.filas} x ${this.columnas}   (filas x columnas)`;
		// txt += '\n■■■■■■■■■ FIN LOG ';
		console.log(txt);
	}

	// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ SCANNER DE UNA BALDOSA
	/**
     * ### Escanea la lista de diccionarios mesa del salon y hace la busqueda norte sur este oeste, buscando sillas y mesas.
     * @param {*} 
    */
    scanner_nsew(drop_scan_obj) {

		if (!this.matriz_plana || this.matriz_plana.length == 0) return false;

		// ■ Obtengo el Objeto MyDiv de la lista this.matriz_plana[]  byId del objeto Drop
		let myDiv_to_search   = this.matriz_plana.find(my_div => my_div.elemento_div.id === drop_scan_obj.id);		
		if (!myDiv_to_search) return false;

		// ■ Saco el Total de Filas de la matriz?????????????????????????????????????????
		// this.filas = this.total_filas();
		
		// ■■■■■■ OBTENGO EL indice en la matriz/matriz por su ID .... la Baldosa ('SALON_15') es donde la mesa(Mesa_0) ha hecho Drop
		// 			• necesito EL indice para obtener la fila y la columna en la matriz.
		let indice_to_search = this.__get_indice_baldosa_byId(drop_scan_obj.id);
		if (indice_to_search < 0) return false;	
		
		// ■■■■■■ OBTENGO EL NUMERO DE FILA Y DE COLUMNA PARA PODER HACER EL SCANEO SEGURO. 
		let fila = this.numero_fila(indice_to_search);
		let columna = this.numero_columna(indice_to_search);
		
		// ■■■■■■ REALIZO UN SCANEO DE TODAS LAS CEDAS QUE HAY ALREDEDOR DEL OBJETO QUE ESTA EN LA fila, columna.
		const i_n = this.get_indice_scan(fila, columna , 'n');
		const i_s = this.get_indice_scan(fila, columna , 's');
		const i_e = this.get_indice_scan(fila, columna , 'e');
		const i_w = this.get_indice_scan(fila, columna , 'w');
		const i_ne = this.get_indice_scan(fila, columna , 'ne');
		const i_nw = this.get_indice_scan(fila, columna , 'nw');
		const i_se = this.get_indice_scan(fila, columna , 'se');
		const i_sw = this.get_indice_scan(fila, columna , 'sw');
		
		// Si ∃ i_n, le asigna el id del objeto que está en esa posición de la matriz, Si ∄, asigna el valor que tenga (null ó false).
		myDiv_to_search.scan.n = (i_n === null || i_n ===false)  ? i_n : this._get_id_contenido_baldosa(this.matriz_plana[i_n].elemento_div);	
		myDiv_to_search.scan.s = (i_s === null || i_s ===false)  ? i_s : this._get_id_contenido_baldosa(this.matriz_plana[i_s].elemento_div);
		myDiv_to_search.scan.e = (i_e === null || i_e ===false)  ? i_e : this._get_id_contenido_baldosa(this.matriz_plana[i_e].elemento_div);
		myDiv_to_search.scan.w = (i_w === null || i_w ===false)  ? i_w : this._get_id_contenido_baldosa(this.matriz_plana[i_w].elemento_div);
		myDiv_to_search.scan.ne = (i_ne === null || i_ne ===false)  ? i_ne : this._get_id_contenido_baldosa(this.matriz_plana[i_ne].elemento_div);
		myDiv_to_search.scan.nw = (i_nw === null || i_nw ===false)  ? i_nw : this._get_id_contenido_baldosa(this.matriz_plana[i_nw].elemento_div);
		myDiv_to_search.scan.se = (i_se === null || i_se ===false)  ? i_se : this._get_id_contenido_baldosa(this.matriz_plana[i_se].elemento_div);
		myDiv_to_search.scan.sw = (i_sw === null || i_sw ===false)  ? i_sw : this._get_id_contenido_baldosa(this.matriz_plana[i_sw].elemento_div);

		// VISUALIZACIÓN EN MODO MATRIZ:
		// console.log(`■■ ${myDiv_to_search.elemento_div.id} ► ${myDiv_to_search.id_contenido}`);
		// console.log(`${this.matriz_plana[indice_to_search].scan.nw}\t${this.matriz_plana[indice_to_search].scan.n}\t${this.matriz_plana[indice_to_search].scan.ne}
		// ${this.matriz_plana[indice_to_search].scan.w}\t${myDiv_to_search.id_contenido}\t${this.matriz_plana[indice_to_search].scan.e}
		// ${this.matriz_plana[indice_to_search].scan.sw}\t${this.matriz_plana[indice_to_search].scan.s}\t${this.matriz_plana[indice_to_search].scan.se}`);
		
		return myDiv_to_search;
	}

	/** ┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌┘┌
	 * ### recibe un objeto myDiv. devuelve un array con los ids de todas las Mesas y Sillas que tiene alrededor
	 * @param {myDiv} my_div - Objeto myDiv que contiene el escaneo n-s-e-w.
	 * @param {myDiv} base_name_clone - el objeto clone (null, 'mesa' , 'silla')  a buscar.... si null, entra todo(Mesas y Sillas).
	 * @returns {Array} array_retorno ► [Mesa_0, Mesa_1, Mesa_2] 
	*/
	_get_array_scan(my_div, rol_busca = null) {    
		let arr_encontrados = [];	
		const arr_entorno_scan = Object.values(my_div.scan);	// ■ array de los valores del scan de la baldosa
		const arr_entorno_limpio = arr_entorno_scan.filter(Boolean);	
		for (const id_el of arr_entorno_limpio) {
			if (!rol_busca) {   // ■ Si rol_busca es null, retorna cualquier elemento
				arr_encontrados.push(id_el);
				continue;
			}
			const el_dom = document.getElementById(id_el);
			if(!el_dom) continue;       
			const item_en_catalogo = Catalogo.get_elemento(id_el);
			// ■ match x rol
			if(rol_busca === item_en_catalogo.rol) {
				arr_encontrados.push(id_el);
			}
			
		}
		return arr_encontrados;

		
	}

	/** 
	 * ### Devuelve las mesas conectadas directamente a la mesa dada.
	 * 				- LLAMADA DESDE buscar_elementos__conectados ► get_matriz__reservas
	 * @param {string} id_contenido - ID de la mesa
	 * @param {Array} lista_info - Lista de ficha_baldosa ... Array de Map('id_contenido', 'indice_baldosa', 'my_div')
	 * @returns {Array} - Vecinos mesas conectadas ► ['Mesa_0', 'Mesa_3']
	*/
	_get_array_vecinos(id_contenido, ficha_s_baldosa, rol_busca = 'central') {
		const ficha_baldosa = ficha_s_baldosa.find(m => m.get('id_contenido') === id_contenido);
		if (!ficha_baldosa) return [];		
		const my_div = ficha_baldosa.get('my_div');
		if(!my_div) return [];
		
		const array_scan = this._get_array_scan(my_div, rol_busca);                // Filtra solo mesas.
		
		return array_scan;
	}

	/**
	 * ### 
	 * @param obj_drop  Objeto onplay sobre el que se suelta un objeto.
	*/
	_get_id_contenido_baldosa(obj_drop){
		if (!this.matriz_plana || this.matriz_plana.length == 0) return false;
		// ■■
		const myDiv_to_search = this.matriz_plana.find(my_div => my_div.elemento_div.hasChildNodes() && my_div.elemento_div.id === obj_drop.id);
		if (!myDiv_to_search) return false;  
		
		const contenido = myDiv_to_search.elemento_div.firstElementChild;
		
		// ■■ OBLIGA A QUE SEA DIV.	
		if (contenido instanceof HTMLElement && contenido.tagName === 'DIV'){
			return contenido.id;	
		}else{
			// return false;
			return "ERROR";
		}

	}

	/**
     * ### Escanea la lista de diccionarios mesa del salon y hace la busqueda norte sur este oeste, buscando grupos de sillas y mesas asociadas.
     * @param {MyDiv/String/number} myDiv_to_search puede ser: 1• un objeto Base Div, 2• un indice de matriz, 3• un id de contenido de un objeto MyDiv.
    */
	_show_vecinos(myDiv_to_search){
		let b_div = null;
		if (!myDiv_to_search) {		// ■■■ No entra nada.
			return false;
		}else if (myDiv_to_search instanceof MyDiv) {		
			// ■■■ Entra como parametro un objeto MyDiv
			// console.log('myDiv_to_search es un objeto MyDiv');
			b_div = myDiv_to_search;
		
		}else if (this.is_indice_OK(myDiv_to_search)) {		
			// ■■■ Entra como indice de la matriz			
			b_div = this.matriz_plana[myDiv_to_search];
			if (!b_div) {
				console.log('• • • myDiv_to_search no es un objeto MyDiv');
				return false;
			}		
		}else if (typeof(myDiv_to_search) == 'string') {	
			// ■■■ Entra como id de un objeto MyDiv
			if(!document.getElementById(myDiv_to_search)){
				return false;
			}
			b_div = this.get_myDiv_byContenido(myDiv_to_search);
			if (!b_div) {
				console.log('• • • myDiv_to_search no es un objeto MyDiv');
				return false;
			}		
		}else{	
			// ■■■ No es ningun tipo valido
			console.log('myDiv_to_search no es un objeto MyDiv, ni un indice, ni un id de un objeto MyDiv');
			return false;
		}
		console.log(`\n■■■■■■■■■■■■■■■■■■■ BALDOSA► '${b_div.elemento_div.id}'    CONTENIDO► '${this._get_id_contenido_baldosa(b_div.elemento_div)}'    CLASE► ${b_div.elemento_div.class_name} • • • SCAN:`);
		
		console.log(`${b_div.scan.nw}\t${b_div.scan.n}\t${b_div.scan.ne}`);
		console.log(`${b_div.scan.w}\t${this._get_id_contenido_baldosa(b_div.elemento_div)}\t${b_div.scan.e}`);
		console.log(`${b_div.scan.sw}\t${b_div.scan.s}\t${b_div.scan.se}`);
	}

	/**
	 * ### Hace un escaneo de cada coordenada que se pasa por parametro. 
	 * @param {number} fila Número de FILA del objeto base sobre el que escanear.
	 * @param {number} columna Número de COLUMNA del objeto base sobre el que escanear.
	 * @param {String} coordenada == 'n', 's', 'e', 'w' , 'ne', 'nw', 'se', 'sw'.
	 * @param {number} factor_scan es la expansión del scaner. IF = 1 scanea 1 alrededor, si 2, 2 
	 * @returns ■ false  ► No hay div baldosa, puede ser un borde o una esquina.
	 * 			■ null   ► hay div baldosa y está vacía (no tiene hijos dentro).
	 * 			■ indice ► hay div baldosa y tiene hijo dentro. 
	 */
	get_indice_scan(fila, columna, coordenada, factor_scan = 1){
		// SUSTITUIR 1 POR FACTOR_SCAN ?????????????????????????????????????????????????????????????
		let dicc_coord = {
			'n':{ fil: fila - 1 < 0  						? false : fila - 1 	,
				  col: columna },
			's':{ fil: fila + 1 >= this.filas  		? false : fila + 1  ,
				  col: columna },
			'e':{ fil: fila , 
				  col: columna + 1 >= this.columnas 	? false : columna + 1 },
			'w':{ fil: fila , 
				  col: columna - 1 < 0  					? false : columna - 1 },
			'ne':{fil: fila - 1 < 0  						? false : fila - 1  ,
				  col: columna + 1 >= this.columnas 	? false : columna + 1 },
			'nw':{fil: fila - 1 < 0  						? false : fila - 1 , 
				  col: columna - 1 < 0  					? false : columna - 1 },
			'se':{fil: fila + 1 >= this.filas  		? false : fila + 1  , 
				  col: columna + 1 >= this.columnas 	? false : columna + 1 },
			'sw':{fil: fila + 1 >= this.filas  		? false : fila + 1 , 
				  col: columna - 1 < 0  					? false : columna - 1 }
		}
		let fila_coord 		= dicc_coord[coordenada].fil		// ► fila tiene un número si existe y si no existe es false.
		let columna_coord 	= dicc_coord[coordenada].col		// ► columna tiene un número si existe y si no existe es false.

		let indice_coord = this.W_R.X_to_indice(fila_coord, columna_coord); 		//(Matriz_Plana) retorna number o false.
		
		// Si hay indice y es numerico hay que validar si está ocupada o está vacía(null)
		if (indice_coord !== false && indice_coord >=0) { 
			const b_tiene_hijos = this.matriz_plana[indice_coord].elemento_div.hasChildNodes();
			if ( !b_tiene_hijos ) {
				indice_coord = null;
        	}
		} 
		return indice_coord;
	}
	
	/**
	 * ### Función Gestora (La que llamarás desde la App)
	 * @param {number} total__baldosas - Cantidad exacta de baldosas que quieres (ej: 20)
	 * @param {string} clase__css - (Opcional) Clase para las nuevas baldosas
	 */
	_set_total_mydivs(total_baldosas) {
		// Validación básica para evitar números negativos o NaN
		if (!Number.isInteger(total_baldosas) || total_baldosas < 0) {
			console.warn("set__total_baldosas recibió un número inválido:", total_baldosas);
			return;
		}

		const total_actual = this.matriz_plana.length;
		const diferencia = total_baldosas - total_actual;

		// CASO A: Faltan baldosas -> Añadimos
		if (diferencia > 0) {
			for (let i = 0; i < diferencia; i++) {
				this.add_mydiv();						
			}
		} 
		// CASO B: Sobran baldosas -> Eliminamos
		else if (diferencia < 0) {
			// Usamos Math.abs para iterar en positivo la cantidad a borrar
			const a_borrar = Math.abs(diferencia);
			for (let i = 0; i < a_borrar; i++) {
				this.kill_mydiv();						
			}
		}
		
		// CASO C: Si diferencia es 0, no hacemos nada (KISS)
		// console.log(`Grid actualizado: ${total_actual} -> ${total__objetivo}`);
	}
	/**
	 * ###  Metodo que añade el ejercito de los clones.
	 * 				 • Un clon es un div que se crea a partir del primer div de la clase.
	 * 				 • El id del clon se genera con _get_Secuencial(this.family) y se añade al contenedor de la clase.
	 * 				 • Un clon hereda todas las propiedades del primer div de la clase.
	 * 				 • El clon se añade a la matriz de la clase en crea_clon_myDiv()
	 * @param {Integer} num_to_add , numero de elementos a añadir a la matriz_plana
	 * @returns true, operacion OK | false, operación ERROR
	 */
	add_mydiv_s(num_to_add = 1) {
		try {
			if (typeof(num_to_add) != 'number' || num_to_add <= 0) return false;
			for (let i = 0; i < num_to_add; i++) {
				const new_mydiv = this.crea_clon_myDiv();
				if(new_mydiv){
					this.matriz_plana.push(new_mydiv);				// ■■■■■■ Meto el objeto en el matriz:
					// console.log('​​​​​​👯​ Div Clonado!! ► Item: (' + i + ')\t ' + new_mydiv.elemento_div.id);
				}else{
					throw ('​​​​❌​ ERROR ::: Matriz_to_MyDiv ::: add__mydiv_s :::: al Crear el clon. Item: ' + i);
				}
			}
			return true;
		} catch (error) {
			console.log(error.message);
			return false;
		}
	}

	add_mydiv(){
		const new_mydiv = this.crea_clon_myDiv();
		if(new_mydiv){
			this.matriz_plana.push(new_mydiv);				// ■■■■■■ Meto el objeto en el matriz:
			// console.log(`​​​​​​👯​ Div Clonado • • •\t id: ${new_mydiv.elemento_div.id}`);
		}else{
			throw ('​​​​❌​ ERROR ::: Matriz_to_MyDiv ::: add__mydiv :::: al Crear Clon.' );
		}
	}
	/** ►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►► Matriz_to_MyDiv
	 * ### ■■■ Añade baldosas(divs) al Saloon. 
	 *                  • A Cada baldosa añadida hay que ponerle el tag y capacitarlas para ser drop.
	 * @param {}    numero_baldosas     El número de baldosas que se quieren añadir al array array_Base_Divs[] de la class Matriz_to_MyDiv 
	 * @example:    ►  add__total__baldosas( 120 , '#Baldosa' )
	 * 				►  add__total__baldosas( 120 )
	*/
	add_all_mydiv_s(numero_baldosas = 64, tag_baldosas = '#Baldosa') {
		const diferencia = this.total - numero_baldosas

		if (diferencia > 0) {          // • tiene mas de las que quiere ... Hay que restar
			const desde = this.total - diferencia;
			const hasta = this.total-1;
			this.kill_mydiv_s(desde, hasta);      // ■■■■■■ Crea un MyDiv x Baldosa y añadimos cada Baldosa a array_Base_Divs
			
		} else if (diferencia < 0) {    // • tiene menos de las que quiere ... Hay que sumar
			this.add_mydiv_s(Math.abs(diferencia)+1);       	// ■■■■■■ Crea un MyDiv x Baldosa y añadimos cada Baldosa a array_Base_Divs
			this.tag_s_update(tag_baldosas);     				// ■■■■■■ Les ponemos un Nombre para Luego Buscarlas.... desde 0 hasta el fin de array_Base_Divs
			
		} else if (diferencia == 0) {
			return true;
		}
	}
	
	/**
	 * ### metodo que elimina un nodo(intItemMatar)
	 * @param {*} desde
	 * @param {*} hasta
	 * @explica ► array.splice(indice, cantidadAEliminar, elemento1, elemento2, ..., elementoN)
					• indice: La posición donde comenzar a cambiar el array
					• cantidadAEliminar (opcional): Cuántos elementos eliminar
					• elemento1, ..., elementoN (opcional): Elementos a agregar al array
	 */
	kill_mydiv_s(desde = 0, hasta) {
		if ( !this.is_desdehasta_OK(desde , hasta) ) return false;		
		// • • • • pasa Todas las validaciones :)	• • • Numero/Positivo/en Rango de matriz/desde<hasta/existe matriz?
		// ■■■■ Elimina los divs del contenedor:
		for (let i = desde; i < hasta; i++) {
			this.contenedor_div_x_div.removeChild(this.matriz_plana[i].elemento_div);	// ■ Elimina el child del contenedor 
		}
		const diferencia = hasta - desde;									// ■ Preparo la variable hasta para eliminar los divs del matriz[] con splice:
		let arrAux2 = this.matriz_plana.splice(desde, diferencia);			// ■ Elimina de matriz[]
		console.log(`​☠️​ ${arrAux2.length} divs RIP .... quedan ${this.matriz_plana.length}`);
		
		return arrAux2;
	}
	
	/** ## Elimina 1 baldosa */
	kill_mydiv(index_to_kill=null){
		if(index_to_kill === null) index_to_kill = this.matriz_plana.length - 1;
		if(!this.is_indice_OK(index_to_kill)) return false;
		this.contenedor_div_x_div.removeChild(this.matriz_plana[index_to_kill].elemento_div);	// ■ Elimina el child del contenedor 
		let arrAux2 = this.matriz_plana.splice(index_to_kill, 1);			// ■ Elimina de matriz[]
		
		// console.log(`​☠️​ ${arrAux2.length} div KILL .... quedan ${this.matriz_plana.length}`);
	}
	
	/**
	 * ### Elimina x baldosas.
	 * @param {number}    
	*/
	delete_mydiv_s(desde=null,  numero_baldosas = 1 ){
		if (this.total < numero_baldosas){
			return false;
		}
		if (desde == null)
			this.kill_mydiv_s(this.total-1-numero_baldosas, this.total-1);      // ■■■■■■ Crea un MyDiv x Baldosa y añadimos cada Baldosa a array_Base_Divs    
		else if (desde + numero_baldosas < this.total) {
			this.kill_mydiv_s(desde , desde + numero_baldosas);      // ■■■■■■ Crea un MyDiv x Baldosa y añadimos cada Baldosa a array_Base_Divs    
		} else{
			return false;
		}
	}

	/**
	 * ### Crea un objeto de la clase MyDiv() que son las baldosas del salon.
	 * @returns 
	 */
	_crear_mydiv() {
		try {
			const new_myDiv = new MyDiv();								// Instancia de la clase que voy a guardar en el array.
			new_myDiv.elemento_div = document.createElement('div'); 				// Crea un div.
			new_myDiv.elemento_div.id = Herramientas._get_secuencial_dom(this.family);		// Le pongo un Id de la familia.

			//Estados:
			new_myDiv.HOW.Tag = Matriz_to_MyDiv.PREFIJO_TAG;			// '#' Cargo como Tag Inicial el prefijo '#' (sin Tag)
			new_myDiv.HOW.Flag = 0;								// Sin Flag 
			
			return new_myDiv;
	
		} catch (error) {
			console.log('\n<--------------->\nMensaje: crear Patron: ' + error.message);
			return false;
		}
	}
	
	/** 
	* ###  	Crea un clon de this.my_div_one.elemento_div 	y lo introduce en matriz.
		 					• el id lo genero con _get_Secuencial(this.family)
	* @param {*} div_to_clone(elemento_div)  es el div a clonar. (opcional) si se omite se clona this.my_div_one.elemento_div ► cte div por defecto.
	* @called ► 		add__mydivs()
	* @returns  		1• el Objeto clon creado.  2• false, si hay algún error
	*/
	crea_clon_myDiv(div_to_clone=null, b_title = true) {
		try {
			if (!div_to_clone) div_to_clone = this.my_div_one.elemento_div				// Si no entra div_to_clone, le asigna uno por defecto, el primero
			// let new_div_clon = this.my_div_one.elemento_div.cloneNode(true);			// Creacion del clon.
			let new_div_clon = div_to_clone.cloneNode(true);						// Creacion del clon.
			// creación de su id por la familia asociada cuando se crea la clase.
			new_div_clon.id = Herramientas._get_secuencial_dom(this.family);					
			if (!new_div_clon.id) throw ("Error crea_clon_myDiv() CLON");
			
			if ( b_title ) new_div_clon.title = new_div_clon.id;
			
			this.contenedor_div_x_div.appendChild(new_div_clon);								// Se asigna al objeto contenedor definido en la Clase.
			// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
			//  * Creo un base div y lo meto en el array ... de esta mannera puedo incidir en el div a través del array.
			// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
			const my_div = new MyDiv();					// Creo una instancia de la clase que voy a guardar en el array.
			my_div.elemento_div = new_div_clon;					// meto el div clonado	
			my_div.HOW.Tag = Matriz_to_MyDiv.PREFIJO_TAG;			// # ► tag vacío.	
			my_div.HOW.Flag = 0;							// 0 = sin flag.			
			
			return my_div;
		} catch (e) {
			return false;
		}
	}
	// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ TAG matriz
	/**
	 * Cambia los TAG de los divs del array para poder luego hacer cosas con ellos
	 * @param {*} Tag 
	 * @param {*} intDesde 
	 * @param {*} intHasta 
	 * @returns 
	 */
	tag_s_update(Tag = '', intDesde = 0, intHasta = parseInt(this.matriz_plana.length - 1)) {
		if (typeof (Tag) != 'string' || Tag == '') return false;

		if (!this.is_desdehasta_OK(intDesde, intHasta)) return false;
		
		// Proceso. 
		const posicionPref = Tag.indexOf(Matriz_to_MyDiv.PREFIJO_TAG);
		if (posicionPref == -1) {		// ► NO trae el prefijo.			
			Tag = Matriz_to_MyDiv.PREFIJO_TAG + Tag;
		} else {						// ► SI trae el prefijo			
			if (posicionPref == 0) {
				//correcto
			} else {					// ► trae el prefijo pero No al principio. Se lo pongo.				
				Tag = Matriz_to_MyDiv.PREFIJO_TAG + Tag;
			}
		}
		
		// ■ Recorro Los Matriz_to_MyDiv y les asigno el nuevo Tag.
		for (let i = intDesde; i <= intHasta; i++) {
			this.matriz_plana[i].HOW.Tag = Tag;
		}
		return true;
	}

	tag_update(indice_to_update, new_tag){
		if(!this.is_indice_OK(indice_to_update)) return false;
		if(typeof (new_tag) != 'string' || new_tag.trim() == '') return false;
		this.matriz_plana[indice_to_update].HOW.Tag = Tag;
		return true;
	}
	
	/**
	 * ### resetea la variable de clase .HOW.Tag (Los Tags de la clase) con objetivo de 
	 * 				buscar tags en aplicacion posterior
	 */
	tag_reset() {
		for (let i = 0; i < this.matriz_plana.length; i++) {
			this.matriz_plana[i].HOW.Tag = Matriz_to_MyDiv.PREFIJO_TAG;
		}
	}
	
	/**
	 * ### Mensaje por consola de los tags de la clase. Para el programador.
	 */
	tag_ver() {
		let txt = '\n=== VER TAGS ===\n' +
			'================\n' +
			this.contenedor_div_x_div.id + '|' + this.family + '\n';
		for (let i = 0; i < this.matriz_plana.length; i++) {
			txt += '\t[' + i + ']-> ' + this.matriz_plana[i].HOW.Tag + '\n';
		}
		txt += '\n--- FIN -----------------------\n';
		return txt;
	}
	
	/**
	 * ### Obtenemos una lista dependiendo de la propiedaad tag de los MyDiv de la matriz 
	 * @param {*} tag_to_search , String con el nombre del tag a buscar.oooooooooooooooooooooooooooooooooooooooooooo
	 * @returns array con las posiciones en el array que Tienen el Tag pasado, false si hay algun error
	 */
	tag_get_lista_divs(tag_to_search = '') {
		let arrayReturn = [];
		if (typeof (tag_to_search) != 'string' || tag_to_search == '') return false;
		tag_to_search = this.tag_set_prefijo(tag_to_search);
		//		
		for (let i = 0; i < this.matriz_plana.length; i++) {
			if (this.matriz_plana[i].HOW.Tag == tag_to_search) {
				arrayReturn.push(this.matriz_plana[i].elemento_div);		// • Solo se devuelve el div.
			}
		}
		return arrayReturn;
	}
	
	/**
	 * ### 	Obtiene el prefijo de una etiqueta.
	 * @param {*} tag_to_search , String con el nombre del tag a buscar. Si no se pone, devuelve '#'
	 * 				Si se pone un string, devuelve el tag con el prefijo de la clase.
	 * 				Si el tag ya tiene el prefijo, lo devuelve tal cual.
	 */
	tag_set_prefijo(tag_to_search = '') {
		if (typeof (tag_to_search) != 'string') return false
		
		//Proceso. 
		const posicionPref = tag_to_search.indexOf(Matriz_to_MyDiv.PREFIJO_TAG);
		if (posicionPref == -1) {
			tag_to_search = Matriz_to_MyDiv.PREFIJO_TAG + tag_to_search;	// • NO trae el prefijo.
		} else if (posicionPref != 0) {		
			tag_to_search = Matriz_to_MyDiv.PREFIJO_TAG + tag_to_search;	// • Trae el prefijo pero No al principio. Se lo pongo.
		} 		
		return tag_to_search;
	}	
	
	/**
	 * ### Cambia el valor Flag en matriz 'desde' un MyDiv 'hasta' otro.
	 * @param {*} flag_to_set Es el valor del flag que quiero poner. Debería ser Integer, pero puede ser cualquier cosa.
	 * @param {Integer} intDesde desde incluido
	 * @param {Integer} intHasta hasta incluido.
	 */
	flag_update(flag_to_set = 0, intDesde = 0, intHasta = parseInt(this.matriz_plana.length - 1)) {
		
		if (!this.is_desdehasta_OK(intDesde, intHasta)){		// super
			console.log('Matriz_to_MyDiv ::: flag_switch :: Error en DESDE-HASTA');
			return false;
		}
		//Proceso. 
		for (let i = intDesde; i <= intHasta; i++) {
			this.matriz_plana[i].HOW.Flag = flag_to_set;
		}
	}
	
	/**
	 * ### Pone el status byDef sobre cada elemento de la clase Matriz_to_MyDiv.
	*/
	flag_reset() {
		for (let i = 0; i < this.matriz_plana.length; i++) {
			this.matriz_plana[i].HOW.Flag = Matriz_to_MyDiv.FLAG_ZERO;
		}
	}
	
	/**
	 * ### * Mensaje por consola de STATUS de la clase. Para el programador.
	*/
	flag_ver() {
		let txt = '\n=== VER FLAGS===' +
			'\n================\n' +
			'( ' + this.contenedor_div_x_div.id + '\n )';
		for (let i = 0; i < this.matriz_plana.length; i++) {
			txt += '\t[' + i + ']->' + this.matriz_plana[i].HOW.Flag + '\n';
		}
		txt += '\n--- FIN -----------------------------------\n';
		return txt;
	}
	
	/**
	 * ### busca todos los MyDiv que tengan el Flag pasado.
	 * @param {*} elStatusToSearch , String con el nombre del tag a buscar.
	 * @returns , lista con las 'posiciones' en el array que Tienen el Tag pasado
	 * 			, false si hay algun error
	 */
	flag_search(flag_to_search = 0) {
		arrayReturn = [];
		if (typeof (flag_to_search) != 'number') return false;
		//
		for (let i = 0; i < this.matriz_plana.length; i++) {
			if (this.matriz_plana[i].HOW.Flag == flag_to_search) {
				arrayReturn.push(i);
			}
		}
		return arrayReturn;
	}

	// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ DATOS DE matriz	
	/**
	 * ### Devuelve string con  un MAPA de la CLASE CON TODAS LAS VARIABLES.
	 */
	log_family() {
		let txt = ('\n=== VER FAMILIA ===' +
			'\n===================' +
			'\n\tFAMILY: ' + this.family +
			'\n\tId contenedor_div_x_div: ' + this.contenedor_div_x_div.id +
			'\n\tId EL PRIMERIZO: ' + this.my_div_one.elemento_div.id +
			'\n\tClassName contenedor_div_x_div: ' + this.get_className(this.contenedor_div_x_div) +
			'\n\tTOTAL  (' + this.matriz_plana.length + ') elementos' +
			'\n--- FIN -----------------------------------\n');

		for (let i = 0; i < this.matriz_plana.length; i++) {
			txt += '\n' + this.family + ' index: [' + i + ']-->' +
				'\n\t|ID= ' + this.matriz_plana[i].elemento_div.id +
				'\n\t|className=' + this.get_className(this.matriz_plana[i].elemento_div) +
				'\n\t|Tag: ' + this.matriz_plana[i].HOW.Tag +
				'\n\t|Flag: ' + this.matriz_plana[i].HOW.Flag + '\n';
		}
		return txt;
	}

	// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ 
	
	/** SIN USO
	 * @param {String} id_div_contenedor id de un Contenedor que tiene que existir o document.body * 
	 * @param {boolean} isDeleteEmpty =true, Borra el anterior Contenedor
	 * 
	 * PROPUESTA DE MEJORA: Añadir un desde-hasta para decir cuales son los divs que cambian de 
	 * Contenedor. 
	 * PROPUESTA DE MEJORA2: Solo se pueden intercambiar(switch) las clases CLASS_divDvd entre si.
	 */
	switch_Contenedor(id_div_contenedor = '', isDeleteEmpty = false) {
		//
		//0)-Validaciones:
		if (typeof (id_div_contenedor) != 'string') return false;
		if (!document.getElementById(id_div_contenedor)) return false;
		if (id_div_contenedor == '') return false;
		if (typeof (isDeleteEmpty) != 'boolean') isDeleteEmpty = false;

		//1•)-Quito los divs(this.matriz_plana[i].elemento_div) del contenedor de la clase.
		for (let i = 0; i < this.matriz_plana.length; i++) {
			this.contenedor_div_x_div.removeChild(this.matriz_plana[i].elemento_div);
		}
		// Guardo el contenedor Viejo y su clase.
		let className_viejo = this.contenedor_div_x_div.class_name;
		let contenedor_viejo = this.contenedor_div_x_div;
		//
		//2•)-Cambio el contenedor de la clase.(ahora this.contenedor_div_x_div tendrá id=id_div_contenedor)
		this.contenedor_div_x_div = document.getElementById(id_div_contenedor);
		this.contenedor_div_x_div.class_name = className_viejo;
		//
		//3)-Añado al nuevo contenedor(this.contenedor_div_x_div) los divs del array(this.matriz_plana[i].elemento_div)
		for (let i = 0; i < this.matriz_plana.length; i++) {
			this.contenedor_div_x_div.appendChild(this.matriz_plana[i].elemento_div);
			//this.copy_paste_className()
		}
		if (isDeleteEmpty == true) {
			contenedor_viejo.parentNode.removeChild(contenedor_viejo);
		}
		return this.contenedor_div_x_div;
	} 	
		
	/** 
	 * ### Busca un objeto MyDiv por el id de su contenido(mesa o silla).
	 * @param {String} id_to_search id del elemento contenido en el MyDiv. Xejemplo 'MESA_0' , 'SILLA_3'
	*/
	get_myDiv_byContenido(id_to_search){    
		if (!this.matriz_plana.length) return false;
		const myDiv_to_search = this.matriz_plana.find(my_div => this._get_id_contenido_baldosa(my_div.elemento_div) === id_to_search);
		if (!myDiv_to_search) return false;
		return myDiv_to_search;
		
	}
	
	/** 
	 * ### desde un id de objeto contenido en la Matriz obtenemos el indice en la matriz.
	 * @param {String} id_to_search id del elemento contenido en el MyDiv. Xejemplo 'MESA_0' , 'SILLA_3'
	 * @return {number/false} >=0 si todo OK o false si hubo algún error.
	*/
	_get_indice_byContenido(id_to_search){
		if (typeof id_to_search != 'string') return false;
		if (!document.getElementById(id_to_search)) return false;
		const my_div = this.get_myDiv_byContenido(id_to_search);
		if(!my_div) return false;
		const indice = this.__get_indice_baldosa_byId(my_div.elemento_div.id);
		if ( indice >=0 )
			return indice;
		else 
			return false;
	}

	/** Introduce un id de un objeto MyDiv y devuelve el objeto MyDiv si lo encuentra en la matriz o null si no lo encuentr
	 * @param {String} id_baldosa_busca id del objeto MyDiv(baldosa) a buscar.
	 * @returns -1 si no encuentra y entero de la posicion del MyDiv de id_baldosa_busca si lo encuentra.
	 */
	__get_indice_baldosa_byId(id_baldosa_busca){
		let indice_to_search = this.matriz_plana.findIndex(objeto => objeto.elemento_div.id === id_baldosa_busca);
		// if (indice_to_search === -1) 
		// 	return false;
		return indice_to_search;
	}

	/** Entra una cadena separada por el char_sep(' ') y devuelve un array sin char_sep(' ').
	 * @param {*} cadena cadea que tienes que convertir en un array de retorno.
	 * @returns Array Split Slash(' '), filtrado sin espacios vacios.
	 * @example: _get__array_cadena('uno dos tres')  ► ['uno','dos','tres']
	 */
	_get_array_cadena(cadena = '', char_sep = ' ') {
		if (!cadena) return false;									// obliga a meter cadena.
		if (typeof (cadena) != 'string') return false;				// obliga a que cadena sea string.		
		const arrSplit = cadena.split(char_sep);					// separa la cadena por el caracter separador.		
		const SP = [''];  											// constante para hacer el filter de vacíos.
		return arrSplit.filter(el => !SP.includes(el));   			// ■ Elimina vacios
	}

	/**
	 * ### 	Obtiene el objeto elemento_div de myDiv dado el índice en la matriz.
	 * 					Delega la validacion del indice al metodo at() de Matriz_Plana.
	 * @param {number} 	indice, número de índice del array de divs. 
	 * 					tambien se puede pasar una celda('B7') o un objeto coordenadas {fila, columna}
	 */
	_get_baldosa(indice) {
		const my_div = this._at(indice);			// metodo de matriz_plana. asegura el indice correcto.
		if (!my_div) return null;		
		return my_div.elemento_div;
	}

	// 				 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
	// 				 * PARA TRABAJAR SOBRE LOS ESTILOS: Uso el objeto instanciado de la clase Work__ClassName
	// 				 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


	/** ✒️✒️
	 * ### 			1• Establece una clase única para todos los Divs de ■ Array_Base_Divs	(isContenedor = false)...byDef
	 * 							2• Establece una clase única para el contenedor de los Divs de ■Array_Base_Divs. (isContenedor = true)
	 * 							SOBRE-ESCRIBE A LA FUNCION QUE HEREDA.
	 * 
	 * @param {*} strClassName  (str), nombre de la clase css que se quiere asignar al className de los objetos div de [Array_Base_Divs].
	 * @param {*} isContenedor  false, pone todos los Divs sólo con esa clase.
	 * 							true, pone clase unica sólo al Contenedor.
	 */
	set_className(strClassName = '') {
		if (typeof (strClassName) != 'string') return false;
		if (strClassName == null || strClassName == '') return false;

		for (let i = 0; i < this.matriz_plana.length; i++) {
			if (this._set_className_unique(this.matriz_plana[i].elemento_div, strClassName) == true) {
				console.log('​ ✅​ ClassName - 🧮​​ ' + strClassName + ' ​​​​asignada con exito ' + ' ✔️');
			} else {
				console.log('❌ Error al asignar la claseName' + strClassName + ' al Div: ' + this.contenedor_div_x_div.id);
			}
		}
	}

	/** ✒️✒️
	 * ### 			1• Establece una clase única para todos los Divs de ■ Array_Base_Divs	(isContenedor = false)...byDef
	 * 							2• Establece una clase única para el contenedor de los Divs de ■Array_Base_Divs. (isContenedor = true)
	 * 							SOBRE-ESCRIBE A LA FUNCION QUE HEREDA.
	 * 
	 * @param {*} strClassName  (str), nombre de la clase css que se quiere asignar al className de los objetos div de [Array_Base_Divs].
	 * @param {*} isContenedor  false, pone todos los Divs sólo con esa clase.
	 * 							true, pone clase unica sólo al Contenedor.
	 */
	set_classname_container(strClassName = '') {
		if (typeof (strClassName) != 'string') return false;
		if (strClassName == null || strClassName == '') return false;
		//
			if (this._set_className_unique(this.contenedor_div_x_div, strClassName) == true) {
				console.log('✅​ Classname - 🧮​ <' + strClassName + '> ​​​​ asignada con exito al Contenedor: ' + this.contenedor_div_x_div.id);
			}else{
				console.log('❌ Error al asignar la Clase' + strClassName + ' al Contenedor: ' + this.contenedor_div_x_div.id);
			}
	}

	/**
	 * Pone todas las className de cada div creado con la configuracion básica de inicio:
	 * @param {*} isContenedor 
	 * @returns 
	 */
	className_reset(isContenedor = false) {
		if (typeof (isContenedor) != 'boolean') isContenedor = false;
		if (isContenedor == true) {
			super.className_reset(this.contenedor_div_x_div);
			return;
		}
		for (let i = 0; i < this.matriz_plana.length; i++) {
			super.className_reset(this.matriz_plana[i].elemento_div);
		}
	}

	/**
	 * @descriptionn Add una className al style del objeto pasado.
	 * @param {*} className_to_add (str) nombre de la clase que se quiere añadir al Contenedor o todos los elementos de  [ Array_Base_Divs ]
	 * @param {*} is_contenedor (bool) • True, actúa solo sobre el contenedor • False, actúa sobre todos los divs de [ Array_Base_Divs ]
	 */
	className_add(className_to_add = '') {
		if (typeof (className_to_add) 	!= 'string' || className_to_add.trim() == '') return false;
		for (let j = 0; j < this.matriz_plana.length; j++) {
			let arrClassNames = this._get_array_cadena(className_to_add);
			if (!arrClassNames) {
				return false
			} else {
				for (let i = 0; i < arrClassNames.length; i++) {
					this.add_className(this.matriz_plana[j].elemento_div, arrClassNames[i]);
				}
			}
		}
	}

	/** Añade una className a los divs desde 'from' hasta 'to'
	 * @param {String} className_to_add La className a añadir.
	 * @param {number} from el entero desde el que quiero añadir la className
	 * @param {number} to el entero hasta el que quiero añadir la className
	 */
	className_add_from_to(className_to_add = '', from = 0, to = parseInt(this.matriz_plana.length - 1)) {
		if (typeof (className_to_add) != 'string' || className_to_add == '') return false;
		if (from > to) return false;
		if (from >= this.matriz_plana.length) return false;
		if (typeof (from) != 'number' || from <= 0) from = 0;
		if (typeof (to) != 'number' || to <= 0) to = this.matriz_plana.length - 1;
		if (to >= this.matriz_plana.length) to = this.matriz_plana.length - 1;
		//Proceso. 
		for (let i = from; i <= to; i++) {
			this.add_className(this.matriz_plana[i].elemento_div, className_to_add);
		}
	}

	/**
	 * ### añade una className a los divs que tengan el tag x
	 * @param {*} ClassNameToAdd el nombre (o string) del className a añadir. 
	 * @param {*} TAG_To_Match el TagName a Buscar.
	 * @returns 
	 */
	className_add_bytag(ClassNameToAdd = '', TAG_To_Match = '') {
		if (typeof (ClassNameToAdd) != 'string' || ClassNameToAdd == '') return false;
		if (typeof (isContenedor) != 'boolean') isContenedor = false;
		//
		TAG_To_Match = this.tag_set_prefijo(TAG_To_Match);
		for (let i = 0; i < this.matriz_plana.length; i++) {
			if (TAG_To_Match == this.matriz_plana[i].HOW.Tag)
				this.add_className(this.matriz_plana[i].elemento_div, ClassNameToAdd);
		}
	}
	/**
	 * ### Elimina una className del style del objeto pasado.
	 * @param {*} strClassNameToDelete 
	 * @param {*} isContenedor 
	 * @returns 
	 */
	delete_className(strClassNameToDelete = '') {
		if (typeof (strClassNameToDelete) != 'string' || strClassNameToDelete == '') return false;
		for (let i = 0; i < this.matriz_plana.length; i++) {
			this.elimina_one_className(this.matriz_plana[i].elemento_div, strClassNameToDelete);
		}
	}
	/**
	 * ### Muestra un Log por consola con el Arbol de la Clase Matriz_to_MyDiv.
	 * @returns la cadena de texto con el log.
	 */
	wcn_arbol_log() {
		let txt = '\n=== VER ARBOL ClassNamer ====' +
			'\n=============================' +
			'\n\t| ID contenedor_div_x_div: ' + this.contenedor_div_x_div.id + '' +
			'\n\t| FAMILY: ' + this.family + '' +
			'\n\t| PATRON: ' + this.my_div_one.elemento_div.id + '' +
			'\n\t|---------------------------';

		txt += ('\n\tCONTENEDOR: ' + this.contenedor_div_x_div.id + '\t|| .CLASSNAME: < ' + this.get_className(this.contenedor_div_x_div) + ' >');
		txt += '\n\t-----------------------------';
		txt += '\n\t**  DIV \t\t**  TAG \t** FLAG \t** CLASSNAMES....\n';
		for (let i = 0; i < this.matriz_plana.length; i++) {
			txt += '\t|| ' + this.matriz_plana[i].elemento_div.id +
				'\t\t|| ' + this.matriz_plana[i].HOW.Tag +
				'\t\t|| ' + this.matriz_plana[i].HOW.Flag +
				'\t\t|| ' + this.get_className(this.matriz_plana[i].elemento_div.id) + '\n';
		}
		txt += '--- FIN -----------------------------------\n';
		return txt;
	}	

	//
	//=== GETTERS =============================================
	get Array()  { return this.matriz_plana; }						// la matriz de baldosas.
	get total()  { return this.matriz_plana.length; }				// Numero de elementos de la matriz.
	get total_baldosas()  { return this.matriz_plana.length; }		// Numero de elementos de la matriz.
	get family() { return this.family; }							// Nombre comun de las baldosas.
	get familia() { return this.family; }							// Nombre comun de las baldosas.
	get objContenedor() { return this.contenedor_div_x_div; }
	get contenedor()    { return this.contenedor_div_x_div; }		// Contenedor del Salon
	get div_maestro() { return this.div_maestro; }					// Si null  en dicc_config = document.body
	get maestro() { return this.div_maestro; }					// Si null  en dicc_config = document.body
	
}

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//                                  DICCIONARIO DE CONFIGURACION
// █████████████████████████████████████████████████████████████████████████████████████████████████████████ 
// █ Para gestionar la clase hay que cambiar los valores de este diccionario.  
// █ las variables que se corresponden en el index.html
// █████████████████████████████████████████████████████████████████████████████████████████████████████████ 
// static dicc_config = {
// 	family:                 'SALON',            // • (Oblig) Familia - Será el id de cada Baldosaa (SALON_0, SALON_1, SALON_2...)
// 	columnas:        10,                  // • (Oblig) Numero de columnas inicial.
// 	numero_baldosas:        100,                 // • (Oblig) Numero de baldosas Inicial.
// 	filas: 			10,                 // • (Oblig) Numero de filas inicial.	
// 	contenedor:             'Contenedor1',      // • (Opt) id del div donde voy a meter todas las Baldosas. ► Si '' , se mete sobre document.body 
	
// 	base_names_to_clone:    ['mesa', 'silla'],     // (Oblig)  'base_names_to_clone' son los Nombres-Base para generar ids de los elementos a clonar, aparte de las Baldosas del Salon)
// 	base_names_exit:        ['Puerta'],            // (Opt)    Salida/Puerta.... donde hay que llevar los elementos para eliminarlos.
	
// 	clone: {
// 		mesa_clone:        'mesa_menu',       // • (Oblig) id de mesa del Menu(div)  de donde se clonan mesas para situar en las Baldosas del Salon.
// 		silla_clone:       'silla_menu'       // • (Oblig) id de silla del Menu(div) de donde se clonan sillas para situar en las Baldosas del Salon.
// 	},
// 	clases_css : {
// 		contenedor: 'estiloSalon',        			// • (Oblig) className en div_x_div.css del Contenedor de Divs
// 		baldosas:   'estiloBaldosas'      			// • (Oblig) className en div_x_div.css de Las Baldosas 
// 	},
// 	rutas : {
// 		css_matriz:   './css/div_x_div.css',     // • (Oblig) ruta principal de estilo que rige la matriz con las clases 'estiloSalon'  y 'estiloBaldosas'
// 		css_salon:    './css/estilo_salon.css',  // • (Oblig) ruta de estilo del resto de la pagina..... propia de Salon
// 	}
// };


/** ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 * ### HEREDA DE Matriz_to_MyDiv. Matriz_to_MyDiv Crea una matriz de elementos div que se pueden arrastrar y soltar.
 * Extiende la funcionalidad de Matriz_to_MyDiv para hacer drag and drop sobre los elementos matriz creados en Matriz_to_MyDiv.
 */
class Tablero_Drop extends Matriz_to_MyDiv{

	// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
	// ■■■■■■ Breakpoints y factores de escala para diferentes dispositivos 
	// Teoría sobre breakpoints: son puntos de ruptura donde el diseño web cambia para adaptarse a diferentes tamaños de pantalla. 
	// Se basan en los anchos comunes de dispositivos y permiten crear experiencias óptimas para cada contexto de visualización.
	// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
	// STATIC PARAM 🧍‍♂️
	static dicc_responsive = {
		breakpoints: {
			mobile: 576,    // Dispositivos móviles (hasta 576px)
			tablet: 768,    // Tablets (de 577px a 768px)
			desktop: 992,   // Escritorios pequeños (de 769px a 992px)
			large: 1200,    // Pantallas grandes (más de 1200px), 
			x_large: 1600
		},
		scaleFactors: {
			mobile: 0.7,    // Factor de reducción para móviles
			tablet: 0.8,    // Factor ligeramente mayor para tablets
			desktop: 0.9,   // Tamaño normal para escritorios
			large: 1 ,      // Escala aumentada para pantallas grandes
			x_large: 1.1    // Escala aumentada para pantallas grandes
		}
	};
	/** ## Objeto que inicia el movimiento. */
	objeto_drag = null;
	/** ## Objeto donde cae el objeto_drag (una baldosa u objeto myDiv) */
	objeto_drop = null;			
	
	/** ## Cacha el data-id_key('mesa' o 'silla') del objeto que se mueve... {@link Tablero_Drop.dragStart} */
	id_key = '';				
	
	/**
	 * ### Tablero_Drop 
	 */
	constructor(family = '', id_div_contenedor = '', div_maestro = null, columnas = 8, filas = 8 ) {
		
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		// ■■ LLAMADA AL PADRE /  CREA LA matriz_plana CON SUS ESTILOS.
		super(family, id_div_contenedor, div_maestro, columnas, filas);		
		
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		// ■■ Gestor unificado de ratón y táctil
		
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■		
		// ■■ LISTENERS  ​👂​👂 PARA QUE LAS BALDOSAS DEL SALON SEAN DROP
		const items_baldosa = document.querySelectorAll(".estiloBaldosas");		
		if (items_baldosa && items_baldosa.length > 0) {	
			items_baldosa.forEach(baldosa => {
				baldosa.addEventListener("dragover", e => this.AllowDrop(e));  		// Permite que se suelten elementos en el contenedor.
				baldosa.addEventListener("drop", this.drop_over_matriz.bind(this));
			});
			console.log('✅ Tablero_Drop - ​👂​ Listener ► DROP BALDOSAS  • • • Loaded ✔️');
		}
		
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■		
		// ■■  ​👂​👂 LISTENERS EXIT : Papeleras.... preparado para que haya varias salidas(todos los data-id_key='exit') a todas les doto el mismo handler. 
		const exit = Array.from(document.querySelectorAll("[data-id_key]")).filter(el => el.dataset.id_key === 'exit');
		if (exit.length > 0) {	
			exit.forEach(el => el.addEventListener("dragover", this.AllowDrop));
			exit.forEach(el => el.addEventListener("drop", this.drop_exit.bind(this)));
			console.log('✅ Tablero_Drop - 👂​ Listener ► DROP PAPELERA  • • • Loaded ✔️');
		}

		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		// ■■ RESPONSIVE
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		// ​👂​👂 opciones para cada tipo de screen(movil, tablet, escritorio)
		window.addEventListener('load', this._when_resize.bind(this));
		console.log('✅ Tablero_Drop - RESPONSIVE ​🔳​  on_load • • • Loaded ✔️');				
		
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		// 👂​👂 REDIMENSIONA la Ventana(resize) • • • Ejecuta _set__scale_factor, con retardo de 250ms. 
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		// ​​• ​(Evita sobre-redimensionados innecesareos).
		window.addEventListener('resize', this._debounce(this._when_resize.bind(this), 250));
		console.log('✅ Tablero_Drop - RESPONSIVE ​🔳​  on_resize • • • Loaded ✔️');

		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		//  ​👂​👂 Connfigura DRAG (con touchpad y raton)  del MENU HTML 
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		// ​​​​​​​const items_html_to_matriz = document.querySelectorAll(".menu_to_clone");		
		// ​​​​​​​if (items_html_to_matriz.length > 0) {	
		// ​​​​​​​	items_html_to_matriz.forEach(el => el.addEventListener("dragstart", this.dragStart.bind(this)));
		// ​​​​​​​}
		const items_html_to_matriz = document.querySelectorAll(".menu_to_clone");
		if (items_html_to_matriz.length > 0) {
			items_html_to_matriz.forEach(el => {
				
				this._add_listeners_movimiento(el);
				// el.addEventListener("dragstart", this.dragStart.bind(this));
			});
		}
		console.log('✅ Tablero_Drop - Touch-Raton ​​👆​🖱️​ • • • Loaded ✔️');

	}
	/**
	 * ### Permite que se suelten elementos en el contenedor.
	 * @param {*} ev  evento de inicio de arrastre de un objeto.
	 * @returns 
	*/
	AllowDrop(ev) {
		ev.preventDefault();
	}

	/**
	 * ### SE PRODUCE CUANDO EMPIEZA EL MOVIMIENTO DE UN OBJETO DRAG ( draggable = true )
	 *              • Se trata de guardar el objeto que se mueve mediante ev.dataTransfer._setData("text", id_objeto_drag) 
	 *              • Cuando este objeto_drag caiga en un objeto drop se tiene que recuperar con ev.dataTransfer.getData_("text")
	 *              • "text" es cualquier cosa xEjemplo "id_objeto_mueve", y además se puede poner mas de uno.
	 * @see 
	 * @param {*} ev   evento de inicio de arrastre de un objeto.
	 * @returns 
	 */
	dragStart(ev) {
		const new_obj_drag = ev.target;                         // ■ cacha el objeto que se mueve(drag).  
		if(!new_obj_drag || !new_obj_drag?.dataset?.id_key || !new_obj_drag?.id){
			console.log("❌ ERROR DRAGSTART")
			return null;
		}
		// ■■ 
		this.objeto_drag = new_obj_drag;
		this.id_key = new_obj_drag.dataset.id_key;

		// ■■ ESTABLECE/GUARDA EL ID DEL OBJETO DRAG
		ev.dataTransfer.setData("drag_id", this.objeto_drag.id);      	// ■ dataTransfer guarda en la transacción d&d un dato "text" con el id del drag.
		// ■■ GUARDA EL id_key ('mesa', 'silla', 'taburete') en catalogo.
		ev.dataTransfer.setData("id_key", this.id_key); 
		
		const ds_t = Catalogo.get_elemento(this.objeto_drag.dataset.id_key);
	}

	/**
	 * ### Maneja el evento de soltar un objeto en el salon
	 * @param {*} ev   evento de soltar objeto en un salon.
	 */
	drop_over_matriz(ev) {
		ev.preventDefault();                   // Evita el comportamiento por defecto del navegador al soltar un objeto.                                     
		try {
			
			// ■■■■■■■■■■■■■■■■■■■■■■■■ 
			// CACHA  DROP
			const objDrop = ev.target;                              // ► CACHA el objeto del evento Drop... del div donde cae.
			if (!objDrop) { console.log( `❌ ERROR drop_over_matriz ■ id-drop:`); return false; }
			this.objeto_drop = objDrop;                             
	
			// ■■■■■■■■■■■■■■■■■■■■■■■■ 
			// CACHA DRAG
			// • • • En DragStart tiene que haber un ev.dataTransfer._setData("text", id_drag) • • • "text" es cualquier cosa xEjemplo "prueba"
			const id_obj_drag = ev.dataTransfer.getData("drag_id");       // Cacha el id del objeto que se mueve(silla o mesa), que se ha arrastrado desde el menu o desde el salon.
			const objDrag = document.getElementById(id_obj_drag);   // ► CACHA el objDrag
			if (!objDrag ) { console.log( `❌ ERROR ► drop_over_matriz ■ id-drag: No hay objeto Drag`); return false; }
	
			// ████████████████████████  
			// LOGICA DROP 
			// ■■ No permite ir a una CELDA OCUPADA.
			if (this.is_baldosa_vacia(objDrop) == false) {
				console.log(`⚠️ ${objDrop.id} está OCUPADA. `); 
				return false; 
			}
			
			// ■■ Si el objeto que se mueve es del MENU, se clona en la matriz. Si no, es un movimiento Interno.
			if (objDrag.classList.contains("menu_to_clone")) {
				
				this.elemento_nuevo_to_Salon(objDrag, objDrop);			
	
			}else if (objDrag.classList.contains("class_onplay")) {    // ► Esta clase sólo se asigna a los objetos en juego dinámicamente.
	
				this.movimiento_interno_Salon(objDrag, objDrop);
	
			}else{
				throw Error('❌ drop_over_matriz: No se puede Soltar este objeto en el Saloon');
			}   
	
			// ■■■■■■■■■■■■■■■■■■■■■■■■ GENERA EL N-S-E-W  DEL SALON.
			this._onplay_scan_salon();      
			return true;

		} catch (error) {
			console.log(error);
			return false;			
		}finally{
		}
		
	}

	// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘

	/**
	* ##  • Maneja el evento de soltar un objeto en el elemento-exit (papelera).
	*	• Quién llega a la  Papelera:
	*	...Se tienen que soltar las sillas o mesas colocadas en el 'Menu Nav-Bar'
	*	► ev.dataTransfer.getData_("text") ,  Id del elemento drap(silla_menu, mesa_menu, o #SillaEnSalon, #MesaEnSalon ).
	*	► ev.target , es el objeto, 
	* @param {*} ev 
	*/
	drop_exit(ev) {
		if (ev && ev.preventDefault) {
			ev.preventDefault();
		}
	
		// ■■ Cacha el objeto que se mueve(objDrag) y el objeto donde cae(objDrop)(Papelera)
		let id_obj_drag = null;
		if (ev && ev.dataTransfer) {
			id_obj_drag = ev.dataTransfer.getData("drag_id");
		} else if (this.objeto_drag) {
			id_obj_drag = this.objeto_drag.id;
		}else{
			return false;
		}
		
		const objDrag = document.getElementById(id_obj_drag);
		
		const objDrop = ev ? ev.target : null;

		// ■■ Validación: Si no tenemos el objeto drag o la papelera, retornamos false
		if (!objDrag || !objDrop) {
			console.warn("⚠️ drop__exit: No se encontró objeto drag o papelera");
			return false;
		}

		// ■■ Los Que No pueden venir son los Objetos del MENU
		// ■■ Tengo que acceder al diccionario de configuracion
		if(objDrag.classList.contains("menu_to_clone")){
			console.warn("⚠️ drop__exit: No se pueden eliminar elementos del menú");
			return false;
		}
		// ■■ Venga de quien venga, la puerta se lo traga y lo escupe. 
		objDrop.appendChild(objDrag);
		objDrop.removeChild(objDrag);		

		
		// ■■ PUEDO ACTUALIZAR O NO LA LISTA-ONPLAY.
		this._onplay_scan_salon(); 
		// this.onplay_read(lista_onplay);
		 
		// ■■■■■■■■■■■■■■■■■■■■■■■■ LOG 🖥️
		console.log(`▶️ Drop EXIT ■■■ ${objDrag.id} ■■■ :) OUT OFF PLAY`);
		
		// ■■ Retornar true para indicar éxito
		return true;
	}

	/**
	 *  ​👂​👂 Listeners para hacer las baldosas dropables.
	 */
	_set_all_dropable(){
		const items_baldosa = document.querySelectorAll(".estiloBaldosas");		
		if (items_baldosa && items_baldosa.length > 0) {	
			// Quita los Listeners
			items_baldosa.forEach(baldosa => {
				baldosa.removeEventListener("dragover", this.AllowDrop);  		// Permite que se suelten elementos en el contenedor.
				baldosa.removeEventListener("drop", this.drop_over_matriz);
			});
			// Pone los Listeners
			items_baldosa.forEach(baldosa => {
				baldosa.addEventListener("dragover", e => this.AllowDrop(e));  		// Permite que se suelten elementos en el contenedor.
				baldosa.addEventListener("drop", this.drop_over_matriz.bind(this));
			});
			// console.log('✅ Tablero_Drop - ​👂​ Listener ► DROP BALDOSAS • • • Loaded :)');
		}
	}

	/** SIN USO
	 * ###  ​👂​👂 Hace que un elemento sea un elemento sobre el que se pueden depositar objetos drag y 
	 * 				establece la funcion que se tiene que ejecutar cuando esto ocurre.
	 * @param {*} elemento_dom , Generalmente un div (mydiv.elemento_div)
	 */
	_set_elemento_dropable(elemento_dom){
		elemento_dom.removeEventListener('dragover', this.AllowDrop);
		elemento_dom.removeEventListener('drop', this.drop_over_matriz);

		elemento_dom.addEventListener('dragover', this.AllowDrop);
		elemento_dom.addEventListener('drop', this.drop_over_matriz);				
	}
	
	/** SIN USO.
	 * ### Añade una baldosa al salon. Una Baldosa es un objeto MyDiv con un div elemento_div dropable.
	 */
	_add_baldosa(){
		const new_mydiv = this.add_mydiv();
		if (!new_mydiv) return false;
		this._set_elemento_dropable(new_mydiv.elemento_div);
		return new_mydiv;
	}
	/**
	 * Una Baldosa es un objeto MyDiv con un div elemento_div dropable y con estilo.
	 * @param {Integer} numero_baldosas Normalmente será filas x columnas
	 */
	set_total_baldosas(numero_baldosas){
		try {
			this._set_total_mydivs( numero_baldosas );	// ► Pone o quita divs para obtener el total 
			this.set_className('estiloBaldosas');		// ► Añade la clase estiloBaldosas.
			this._set_all_dropable();					
			return true;
		} catch (error) {
			// console.log(`❌​ ERROR set_total_baldosas ${error.msg}`);
			return false;			
		}
	}

	/**  
	 * ## Desde el MENU, Movemos un Objeto Drag a una Baldosa de la Matriz.
	 * @param {object} item_menu  El nodo de la silla a arrastrar.(mesa o silla del navbar o cualquier menu.)
	 * @param {myDiv}  baldosa_matriz  El nodo/objeto de la baldosa donde se va (myDiv.elemento_div)
	 * @returns {object}  el elemento nuevo creado (la silla), que ha sido llevada del menu a la matriz_plana (El Salon)
	 */
	elemento_nuevo_to_Salon(item_menu = null, baldosa_matriz = null) {

		// ■■ Verificamos que la baldosa de destino esté vacía
		if (this.is_baldosa_vacia(baldosa_matriz) == false) return
		
		const idkey = item_menu.dataset.id_key;
		// ■■ Creamos un Clon del item del MENU. El id que se asigna es un secuencial del dataset _tipo(del <data__tipo>)
		const clon_item = item_menu.cloneNode(true);                  
		clon_item.id = Herramientas._get_secuencial_dom(idkey);				
		clon_item.dataset.id_key = idkey;	// mesa, silla, taburete
		clon_item.title = clon_item.id;
		clon_item.style.visibility = 'visible';
		// ■■ CAMBIA DE CLASE PARA NO HEREDAR EL ESTILO DEL MENU....
		clon_item.className = "";
		clon_item.classList.add('class_onplay');
		
		// ■■ ​👂​👂 Hace DRAGGABLE el clon del item del menu  para ratón y táctil
		this._add_listeners_movimiento(clon_item);
		// ■■ 
		baldosa_matriz.appendChild(clon_item);           
		// ■■ LOG  🖥️
		// console.log(`▶️ ${clon_item.id} ► Padre: ${clon_item.parentNode.id} ■ clase: ${this.get_className(clon_item)} ■ data-id_key(html): ${data__tipo}\n`);
		return clon_item;
	}

	/** 
	 * ### Mueve una silla o mesa del salon a una baldosa del salon.
	 * En un movimiento interno generalista tendré que tener en cuenta si:
	 * 1. La baldosa de destino esté vacía o llena.
	 * 2. Si la baldosa está vacía se mueve sin problema.
	 * 3. Si la baldosa está llena, se puede: 
	 * 		a. comer ficha(chess), 
	 * 		b. cambiar una ficha por otra(toggle), 
	 * 		c. acumular fichas , 
	 * 		d. duplicar ficha  , 
	 * 		e. No se permite (esta opción, damas...)
	 */
	movimiento_interno_Salon(obj_drag = null, obj_drop = null) {
		const baldosa_origen  = obj_drag.parentNode;
		const baldosa_destino = obj_drop;

		if (!baldosa_origen || !baldosa_destino) return false;
		
		baldosa_destino.appendChild(obj_drag);

		return true;
	}

	/** ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
	* ### Verifica si un objeto-drop(baldosa) está vacío o tiene una mesa o una silla. 
	* ### •  obj_drop.children.length != 0                    ► significa que el obj_drop tiene hijos.... puede ser Baldosa
	* ### •  obj_drop.hasChildNodes()                         ► El div ya tiene contenido (imagen u otro elemento)
	* ### •  obj_drop.parentNode != this.objContenedor   ► significa que el padre del obj_drop no es el Contenedor del Saloon ('Contenedor1') 
	* 														... tiene que ser [silla] o [mesa] PQ el padre de las [Baldosas] del Saloon es siempre 'Contenedor1'    
	* @param {*} obj_drop (div) es el objeto div donde se quiere hacer drop.
	* ### [RETORNO]   1• True, la valdosa está vacía. 2• False, la baldosa no está vacía.
	*/
	is_baldosa_vacia(obj_drop = null) {
		if (!obj_drop) return false;

		if (obj_drop.children.length != 0 || obj_drop.hasChildNodes() || obj_drop.parentNode != this.objContenedor) {
			return false;
		} else {
			return true;
		}
	}

	/** ## Elimnia un elemento drag que se haya metido en la baldosa.
	 * ### • 'obj_drop' es el div de la baldosa ó myDiv.elemento_div
	 * ### • Al llamar a replaceChildren sin argumentos, se eliminan todos los hijos de forma atómica y eficiente.	 */
	api_vaciar_baldosa(obj_drop){	
		if (obj_drop && obj_drop instanceof HTMLElement) {        
        	obj_drop.replaceChildren();
    	}
	}

	// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ LISTA ON-PLAY
	// ██████████████████████████████████████████████████████████████████████████████████ 

	/** 
	 * ### Saca por consola un informe de todos los MyDiv's onplay...los que tienen elementos hijos.
	 * */
	onplay_read(lista_mydivs_onplay){
		// console.log('\nON PLAY • • • READ: ');
		try {
			if (!lista_mydivs_onplay){
				lista_mydivs_onplay = this._get_mydivs_onplay();
				if (!lista_mydivs_onplay || lista_mydivs_onplay.length === 0) 
					return false;                        // Si no hay elementos, retorna false.
			}
			lista_mydivs_onplay.forEach((my_div, indice) =>{
				const id_contenido = this._get_id_contenido_baldosa(my_div.elemento_div);
				console.log(`▶️ indice: ${indice} ■ID: ${my_div.elemento_div.id} ■CONTENIDO: ${id_contenido}      n•${my_div.scan.n} s•${my_div.scan.s} e•${my_div.scan.e} w•${my_div.scan.w} ne•${my_div.scan.ne} nw•${my_div.scan.nw} se•${my_div.scan.se} sw•${my_div.scan.sw} `);
			});			
		} catch (error) {
			 console.log('❌ Error onplay_read: ' + error);
			 return false;
		}
	}

	/** 
	 * ### Scanner n-s-e-w actualizado de los elementos onplay del Salon. 	*/
	_onplay_scan_salon(){    
		try {
			const lista_baldosas_onplay = this._get_mydivs_onplay();
			if (!lista_baldosas_onplay) return null;
			
			// ■■ Recorre la lista de my_divs que están en juego sólamente y actualiza el escaneo N-S-E-W
			lista_baldosas_onplay.forEach((my_div) => {
				this.scanner_nsew(my_div.elemento_div);			// Se pasa el div de la baldosa
			});
			return lista_baldosas_onplay; 			
		} catch (error) {
			console.log(`Error::: Tablero_Drop ::: onplay_scan_salon ::: msg: ${error}`);
			return null;
		}
	}

	/** 
	 * ### Devuelve un array con los elementos que están en juego (onplay) en el Tablero */
	_get_mydivs_onplay() {
		// const array_app = this.get_array_myDivs();
		const array_app = this.matriz_plana;
		if (!array_app || array_app.length <= 0) return false; // Si no hay Base_Divs, retorna false.
		
		// Dame sólo los que tienen contenido(mesa o silla), que son los que están en el salon.
		const lista_baldosas_onplay = array_app.filter(my_div => my_div.elemento_div.hasChildNodes());
		if (lista_baldosas_onplay.length === 0) return false;                        // Si no hay elementos, retorna false.
		
		return lista_baldosas_onplay;
	}

	// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ RE-SIZES ►◄ REDIMENSIONADO DE LA VENTANA - RESPONSIVE
	// ██████████████████████████████████████████████████████████████████████████████████ 
	/** 
	 * ### Ajusta el FACTOR DE ESCALA('--scale-factor') según el numero de columnas de pantalla (window.innerWidth)
	*/
	_when_resize() {
		// Obtiene el num_cols actual de la ventana del navegador
		const width = window.innerWidth;		
		// Establece factor de escala por defecto (para pantallas grandes)
		let scaleFactor = 1;		
		// Determina el factor de escala según el num_cols de pantalla
		if (width < Tablero_Drop.dicc_responsive.breakpoints.mobile) {
			scaleFactor = Tablero_Drop.dicc_responsive.scaleFactors.mobile;
		} else if (width < Tablero_Drop.dicc_responsive.breakpoints.tablet) {
			scaleFactor = Tablero_Drop.dicc_responsive.scaleFactors.tablet;
		} else if (width < Tablero_Drop.dicc_responsive.breakpoints.desktop) {
			scaleFactor = Tablero_Drop.dicc_responsive.scaleFactors.desktop;
		}else if (width < Tablero_Drop.dicc_responsive.breakpoints.large){
			scaleFactor = Tablero_Drop.dicc_responsive.scaleFactors.large;
		} else {
			scaleFactor = Tablero_Drop.dicc_responsive.scaleFactors.x_large;
		}
		// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
		// ■■■    Aplica el factor de escala como variable CSS personalizada 
		document.documentElement.style.setProperty('--scale-factor', scaleFactor);
	}

	/** 
	 ###    Función _debounce para limitar la frecuencia de ejecución de eventos
	Teoría sobre debouncing: Técnica esencial para optimización de rendimiento:
	• Problema: Eventos como 'resize' se disparan decenas de veces por segundo
						• Solución: Debounce limita la ejecución a una vez cada X milisegundos
						• Beneficio: Reduce la carga de procesamiento sin afectar la experiencia de usuario
	*/
	_debounce(func, wait) {
		let timeout;  // Almacena la referencia al timeout
		
		// Retorna una función que será llamada por el event listener
		return function () {
			const context = this;       // Conserva el contexto 'this'
			const args = arguments;     // Conserva los argumentos
			
			// Limpia el timeout anterior si existe
			clearTimeout(timeout);
			
			// Establece un nuevo timeout
			timeout = setTimeout(() => {
				func.apply(context, args);  // Ejecuta la función después del tiempo de espera
			}, wait);
		};
	}

}



/**
 * ### Tablero_Touch unifica drag&drop de ratón y eventos táctiles directamente sobre el tablero.
 * Hereda de Tablero_Drop para reutilizar toda la lógica de movimiento ya existente.
 */
class Tablero_Touch extends Tablero_Drop {
	constructor(family = '', id_div_contenedor = '', div_maestro = null, columnas = 8, filas = 8 ) {
		super(family, id_div_contenedor, div_maestro, columnas, filas);
		this.touchState = { draggedElement: null, activeDropTarget: null };
		this.tapThreshold = 10;
		this._touchCancelRegistrado = false;
	}

	get_coordenadas_evento(evento){
		if (!evento) return { x: 0, y: 0 };
		const touch = (evento.touches && evento.touches[0]) || (evento.changedTouches && evento.changedTouches[0]);
		if (touch) return { x: touch.clientX, y: touch.clientY };
		return { x: evento.clientX || 0, y: evento.clientY || 0 };
	}

	

	/** ### Agrega los listeners para los eventos de toque y ratón 	*/
	_add_listeners_movimiento(elemento){
		if (!elemento) return;
		// Usamos una propiedad en memoria (no dataset) para no contaminar el HTML
		// ni copiar accidentalmente la marca al clonar nodos del menú.
		if (elemento._touchRatonReady === true) return;
		elemento.draggable = true;
		elemento.style.touchAction = 'none';
		elemento.addEventListener('dragstart',  this.dragStart.bind(this));
		elemento.addEventListener('touchstart', this.handleTouch_start.bind(this), { passive: false });
		elemento.addEventListener('touchmove',  this.handleTouch_movimiento.bind(this), { passive: false });
		elemento.addEventListener('touchend',   this.handleTouch_end.bind(this), { passive: false });
		elemento._touchRatonReady = true;
		if (!this._touchCancelRegistrado) {
			window.addEventListener('touchcancel', this.finalizarArrastre.bind(this));
			this._touchCancelRegistrado = true;
		}
	}

	/** ### Finaliza el arrastre del elemento táctil. */
	finalizarArrastre() {
		this._cleanup_touch_preview();
		this._reset_touch_state();
	}

	/** ### Crea una vista previa del elemento arrastrado. */
	_create_drag_preview(elemento, rect){
		if (!elemento || !rect) return null;
		const preview = elemento.cloneNode(true);
		preview.removeAttribute('id');
		preview.setAttribute('aria-hidden', 'true');
		preview.style.position = 'fixed';
		preview.style.left = '0px';
		preview.style.top = '0px';
		preview.style.width = `${rect.width}px`;
		preview.style.height = `${rect.height}px`;
		preview.style.margin = '0';
		preview.style.zIndex = '9999';
		preview.style.pointerEvents = 'none';
		preview.style.boxSizing = 'border-box';
		preview.style.transformOrigin = 'top left';
		preview.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
		preview.style.willChange = 'transform';
		document.body.appendChild(preview);
		return preview;
	}

	/** ### Obtiene la baldosa correspondiente a un punto específico 	
	 * @param {number} x Coordenada X del punto.
	 * @param {number} y Coordenada Y del punto.
	 * @param {HTMLElement|null} fallbackTarget Elemento alternativo para buscar la baldosa si no se encuentra con elementsFromPoint.
	 * @returns {HTMLElement|null} La baldosa encontrada o null si no se encuentra ninguna
	*/
	_get_baldosa_from_point(x, y, fallbackTarget = null){
		const elements = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [];
		const baldosa = elements.find(elemento => elemento.classList && elemento.classList.contains('estiloBaldosas'));
		if (baldosa) return baldosa;
		if (fallbackTarget && fallbackTarget.closest) return fallbackTarget.closest('.estiloBaldosas');
		return null;
	}

	/** ### Obtiene el contenedor de caída real para un elemento detectado 	*/
	_obtener_contenedor_drop_real(elementoDetectado) {
		if (!elementoDetectado) return null;
		if (elementoDetectado.dataset && elementoDetectado.dataset.id_key) return elementoDetectado;
		const contenedorExit = elementoDetectado.closest('[data-id_key]');
		if (contenedorExit && contenedorExit.dataset.id_key) return contenedorExit;
		if (elementoDetectado.classList && elementoDetectado.classList.contains('estiloBaldosas')) return elementoDetectado;
		const contenedorBaldosa = elementoDetectado.closest('.estiloBaldosas');
		if (contenedorBaldosa) return contenedorBaldosa;
		return null;
	}

	/** ### Mueve la vista previa del elemento arrastrado 	*/
	_move_drag_preview(x, y){
		const preview = this.touchState.dragPreview;
		if (!preview) return;
		const left = x - this.touchState.offsetX;
		const top = y - this.touchState.offsetY;
		preview.style.transform = `translate3d(${left}px, ${top}px, 0)`;
	}

	/** ### Maneja el evento de inicio del toque (touch start) 	*/
	handleTouch_start(evento){
		if (!evento) return;
		if (evento.cancelable) evento.preventDefault();
		const { x, y } = this.get_coordenadas_evento(evento);
		
		const objeto_drag = evento.currentTarget;
		
		console.log(`${objeto_drag.id} ■ touch_start at (${x}, ${y})`);

		const rect = objeto_drag.getBoundingClientRect();
		const offsetX = x - rect.left;
		const offsetY = y - rect.top;
		const preview = this._create_drag_preview(objeto_drag, rect);
		
		this.objeto_drag = objeto_drag;
		this.id_key = objeto_drag.getAttribute('data-id_key') || objeto_drag.dataset.id_key || '';
		
		
		const previousVisibility = objeto_drag.style.visibility;
		objeto_drag.style.visibility = 'hidden';
		this.touchState = { draggedElement: objeto_drag, 
							activeDropTarget: null, 
							startX: x, 
							startY: y, 
							lastX: x, 
							lastY: y, 
							offsetX, 
							offsetY, 
							dragPreview: preview, 
							previousVisibility, 
							rafId: null, 
							pendingMove: null };
	}

	/** ### Maneja el evento de movimiento del toque (touch move) 	*/
	handleTouch_movimiento(evento) {
		if (!evento || !this.touchState.draggedElement) return;
		if (evento.cancelable) evento.preventDefault();
		const { x, y } = this.get_coordenadas_evento(evento);
		this.touchState.lastX = x;
		this.touchState.lastY = y;
		this.touchState.pendingMove = { x, y };
		if (!this.touchState.rafId) {
			this.touchState.rafId = requestAnimationFrame(() => {
				if (this.touchState.pendingMove) {
					const { x: moveX, y: moveY } = this.touchState.pendingMove;
					this._move_drag_preview(moveX, moveY);
				}
				this.touchState.rafId = null;
			});
		}
		this.touchState.activeDropTarget = document.elementFromPoint(x, y);
	}

	/** ### Maneja el evento de finalización del toque (touch end) 	*/
	handleTouch_end(evento) {
		if (!this.touchState.draggedElement) return;
		const el = this.touchState.draggedElement;
		const coordenadas = this.get_coordenadas_evento(evento);
		let x = coordenadas.x;
		let y = coordenadas.y;
		if (!x && !y) { x = this.touchState.lastX || 0; y = this.touchState.lastY || 0; }
		const deltaX = x - this.touchState.startX;
		const deltaY = y - this.touchState.startY;
		const isTap = Math.hypot(deltaX, deltaY) <= this.tapThreshold;
		if (this.touchState.dragPreview) this.touchState.dragPreview.style.display = 'none';
		const elementoDetectado = document.elementFromPoint(x, y);
		const targetReal = this._obtener_contenedor_drop_real(elementoDetectado);
		if (this.touchState.dragPreview) this.touchState.dragPreview.style.display = 'block';
		if (isTap) {
			this._cleanup_touch_preview();
			this._reset_touch_state();
			queueMicrotask(() => el.click());
			return;
		}
		const syntheticEvent = this._buildSyntheticDropEvent(targetReal, el, { x, y });
		let dropExitoso = false;
		if (targetReal) {
			const isExit = targetReal.dataset && targetReal.dataset.id_key === 'exit';
			if (isExit && this.drop_exit) {
				syntheticEvent.target = targetReal;
				dropExitoso = this.drop_exit(syntheticEvent);
			} else {
				const baldosaDestino = this._get_baldosa_from_point(x, y, targetReal) || targetReal;
				if (this.drop_over_matriz) {
					syntheticEvent.target = baldosaDestino;
					dropExitoso = this.drop_over_matriz(syntheticEvent);
				}
			}
		}
		this._cleanup_touch_preview();
		if (dropExitoso) el.style.visibility = 'visible';
		this._reset_touch_state();
	}

	_reset_touch_state(){
		this.touchState = { draggedElement: null, activeDropTarget: null, startX: 0, startY: 0, lastX: 0, lastY: 0, offsetX: 0, offsetY: 0, dragPreview: null, previousVisibility: '', rafId: null, pendingMove: null };
	}

	_cleanup_touch_preview(){
		if (this.touchState.rafId) cancelAnimationFrame(this.touchState.rafId);
		if (this.touchState.dragPreview) this.touchState.dragPreview.remove();
		if (this.touchState.draggedElement) this.touchState.draggedElement.style.visibility = this.touchState.previousVisibility || '';
	}

	/** ### Construye un evento sintético de tipo 'drop' para simular el comportamiento de arrastrar y soltar en dispositivos táctiles.*/
	_buildSyntheticDropEvent(target, draggedElement, coords = {}){
		const id_key = (draggedElement && draggedElement.getAttribute('data-id_key')) || objeto_drag.dataset.id_key || '';
		const { x = 0, y = 0 } = coords;
		return {
			preventDefault: () => {},
			target,
			clientX: x,
			clientY: y,
			dataTransfer: {
				getData: (key) => {
					if (key === 'drag_id') return draggedElement ? draggedElement.id : '';
					if (key === 'id_key') return id_key;
					return '';
				}
			}
		};
	}
}

