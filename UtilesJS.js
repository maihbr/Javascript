var UtilesJS={};
UtilesJS.QueryToJson=function(){

	var sContenido='{';	
	var parametros = location.search.substr(1).split("&");

	for(i=0;i< parametros.length;i++){
	   limite = parametros[i].indexOf('=');
	   campo = parametros[i].substr(0,limite);
	   valor = parametros[i].substr(limite+1);  
	   sContenido+='"'+ campo +'":"'+valor+'",';	
	}

	var Datos= eval('('+ sContenido.substr(0,sContenido.length-1) + "}" +')');	
	return Datos;

};

UtilesJS.limitarTextArea=function(id,valor,longitud,caption){

	if(valor.length>longitud){	
		var totalCaracteres = longitud +1;
		var caja = document.getElementById(id);		
		var valorOLD = caja.value;
		alert("Atención, el campo " + caption + " no puede tener más de " + totalCaracteres + " caracteres ");
		caja.value = caja.value.substring(0,longitud);	
	}
};

UtilesJS.esVacio=function(item){
	return (item=="" || item==null)?true:false;
};


UtilesJS.dateFormat=function(tiempo,includeTime){

	var fecha = new Date(tiempo);

	if(arguments.length===1){
		
		var dia = (fecha.getDate()<10)? "0" + fecha.getDate().toString():fecha.getDate();								
		var mes = ((fecha.getMonth())<10)? "0" + (fecha.getMonth()+1):(fecha.getMonth()+1);
		var salida = dia+"/"+mes+"/"+fecha.getFullYear();
	}				
	else if(arguments.length===2 && includeTime)
		var salida = fecha.toLocaleDateString() + " " + fecha.toLocaleTimeString();

	return salida;
};

