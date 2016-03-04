var maihbr=maihbr || {};
maihbr.Kpis=maihbr.Kpis || {};
maihbr.Kpis.Youtube=(function(){
	
	var CACHE_KEY = "KPIS_YOUTUBE";
	var CACHE_EXPIRE ='1h';

	var tpl={
		"tbCanal":"<table class=\"table table-striped table-bordered\"><thead><tr><th>Total Videos</th><th>Total Subscriptores</th><th>Total Visitas</th></tr></thead><tbody><tr>{{#.}}<td>{{videos}}</td><td>{{subscriptores}}</td><td>{{reproducciones}}</td>{{/.}}</tr></tbody></table>",
		"tbParcial":"<table class=\"table table-striped table-bordered\"><thead><tr><th>Total Videos</th><th>Total Visitas</th><th>Valoraciones Positivas</th><th>Valoraciones Negativas</th></tr></thead><tbody><tr>{{#.}}<td>{{videoCount}}</td><td>{{viewCount}}</td><td>{{likeCount}}</td><td>{{dislikeCount}}</td>{{/.}}</tr></tbody></table>",
		"divItemDetalle":"{{#items}}<div class=\"col-sm-6 col-md-4\"><div class=\"thumbnail\"><img src=\"{{img}}\" alt=\"fotogramma del video {{titulo}}\"><div class=\"caption\"><p>Fecha Publicaci&oacute;n:{{fecha}}</p><p>{{titulo}}</p><p><a href=\"#\" class=\"btn btn-default\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"número de visitas\" role=\"button\">{{viewCount}} <img src='./img/icon-ojo.png' alt='Visitas' /></a> <a href=\"#\" class=\"btn btn-default\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"número de valoraciones positivas\" role=\"button\">{{likeCount}} <img src='./img/icon-sube.png' alt='valoracion positiva'/></a><a href=\"#\" class=\"btn btn-default\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"número de valoraciones negativas\" role=\"button\">{{dislikeCount}}<img src='./img/icon-baja.png' alt='valoracion negativa'/></a><a href=\'#\' class=\"btn btn-default\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"número de comentarios\" role=\"button\">{{commentCount}}<img src=\'./img/icon-bocadillo04.png\' alt='comentarios' /></a></p></div></div></div>{{/items}}"
	};

	var dataSource={
		canal:{'subscriptores':0,'comentarios':0,'reproducciones':0,'videos':0,'valoracion':{'positivas':0,'negativas':0}},
		periodo:{'finicio':0,'ffinal':0,'videoCount':0,'viewCount':0,'likeCount':0,'dislikeCount':0,'favoriteCount':0,'commentCount':0,'items':[]}
	};

	var arrVideosId = [];


	var toDay=function(){
		var hoy = new Date();
		return hoy.getTime();
	};

	var firstDay=function(){
		var hoy = new Date();	
		var finicio = new Date(hoy.getFullYear(),hoy.getMonth(),1);
		return finicio.getTime();
	};

	var formatDateIso=function(value){		
		var result=/^[0-9\-]{1,}/.exec(value)[0].split('-');
		return result[2]+"/"+result[1]+"/"+result[0];
	};


	var DateYoutube=function(value){
		var temp = new Date(value);
		return temp.toISOString();
	};

	var esVacio=function(item){
		return (item=="" || item==null)?true:false;
	};

	var dateFormat =function(tiempo,includeTime){

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

	var getInfoVideo=function(data){

		criterios = {'part':'snippet,statistics','id':arrVideosId.join(',')};
		var request = gapi.client.youtube.videos.list(criterios);
		
		request.execute(function(response){
			
			var titulo = "";	
			for(var i=0;i<response.items.length;i++){
				if(response.items[i].snippet.title.length > 42){
					titulo = response.items[i].snippet.title.substring(0,42);
					titulo = titulo.substring(0,titulo.lastIndexOf(' '))+"...";
				}else{
					titulo = response.items[i].snippet.title;
				}
				
				//console.log(response.items);
				var item={
					'id':response.items[i].id,
					'fecha':formatDateIso(response.items[i].snippet.publishedAt),								
					'titulo': titulo,
					'img':response.items[i].snippet.thumbnails.medium.url,
					'viewCount':response.items[i].statistics.viewCount,
					'likeCount':response.items[i].statistics.likeCount,
					'dislikeCount':response.items[i].statistics.dislikeCount,
					'favoriteCount':response.items[i].statistics.favoriteCount,
					'commentCount':response.items[i].statistics.commentCount
				};
				
				//Realizamos los calculos para el resumen de la busqueda
				dataSource.periodo.viewCount+=parseInt(item.viewCount);
				dataSource.periodo.likeCount+=parseInt(item.likeCount);
				dataSource.periodo.dislikeCount+=parseInt(item.dislikeCount);
				dataSource.periodo.favoriteCount+=parseInt(item.favoriteCount);
				dataSource.periodo.commentCount+=parseInt(item.commentCount);

				dataSource.periodo.items.push(item);
			}

			dataSource.periodo.videoCount+=dataSource.periodo.items.length;
						
			Render();

		});

	};



	var Busqueda=function(nextPageToken,seguir){
				
		var publishedAfter = DateYoutube(firstDay());

		criterios = {'part':'snippet','channelId':settings.idChannel,'maxResults':settings.pageSizeMax,
					 'order':'date','publishedAfter':publishedAfter};		

		if(!esVacio(arguments[0]) ) 
			criterios.pageToken = nextPageToken;

		if(seguir){

			var request = gapi.client.youtube.search.list(criterios);
			request.execute(function(response){	
				resBusqueda(response);
			});
		}else{			
			dataSource.periodo.finicio = firstDay();
			dataSource.periodo.ffinal = toDay();
			getInfoVideo(arrVideosId);
			
		}		
	};



	var resBusqueda=function(respuesta){
		
		for(var i=0;i<respuesta.items.length;i++)							
			arrVideosId.push(respuesta.items[i].id.videoId);
		
		var pageToken=(respuesta.result.hasOwnProperty('nextPageToken'))? respuesta.result.nextPageToken:null;
		var seguir = (pageToken==null)?false:true;
		Busqueda(pageToken,seguir);
	};


	var getInfoChannel=function(username){
		
		var request = gapi.client.youtube.channels.list({"part":"statistics","forUsername":username});		
		request.execute(function(response){							
			dataSource.canal.subscriptores  = numeral(response.items[0].statistics.subscriberCount).format('0,0');
			dataSource.canal.reproducciones = numeral(response.items[0].statistics.viewCount).format('0,0');
			dataSource.canal.videos 		= response.items[0].statistics.videoCount;
			dataSource.canal.comentarios 	= response.items[0].statistics.commentCount;		
		});
	};


	var getPlayLists=function(channelID){
		//console.log("channelID="+channelID);
		var request = gapi.client.youtube.playlists.list({"part":"snippet","channelId":channelID,"maxResults":1});		
		request.execute(function(response){	
			console.log(response);
			for(i=0;i<response.items.length;i++){

				var filtro=/(CAPACITADOS)/;
				if(filtro.test(response.items[i].snippet.title))
					console.log(response.items[i].snippet.title);
			}
				
		});


	};

	var Render=function(){

		/*if(!cacheJS.hasKey(CACHE_KEY)){
			cacheJS.add(CACHE_KEY,dataSource,CACHE_EXPIRE);
		}else{
			dataSource = cacheJS.getItem(CACHE_KEY).data[0];
			document.getElementById('alert-cache').className="alert alert-info mostrar";
			document.getElementById('btnClearCahe').className="btn btn-primary mostrar";		
		}*/
		
		//Pintamos los datos del canal
		var output = Mustache.render(tpl.tbCanal,dataSource.canal);												
		document.getElementById("divCanalDetalle").innerHTML=output;
		document.getElementById("divCanal").className="row mostar";

		//Generamos la leyenda
		document.getElementById("captionParcial").innerHTML=getCaptionPartial();

		//Generamos la tabla resumen ( de la busqueda )
		var output = Mustache.render(tpl.tbParcial,dataSource.periodo);												
		document.getElementById("divParcialDetalle").innerHTML=output;
		document.getElementById("divParciales").className="row mostar";

		//Generamos el listado detallado con cada uno de los videos
		output = Mustache.render(tpl.divItemDetalle,dataSource.periodo);
		document.getElementById("divLisDetalle").innerHTML=output;
		document.getElementById("divLisDetalle").className="row mostar";

	};


	var getCaptionPartial=function(){
		var hoy = new Date();
		var finicio = new Date(hoy.getFullYear(),hoy.getMonth(),1);
		var msg ="Videos subidos desde el d&iacute;a "+ dateFormat(finicio.getTime()) +" al " +dateFormat(hoy.getTime());
		return msg;
	};

	
	return{

		init:function(){
			getPlayLists(settings.idChannel);							 
			/*getInfoChannel(settings.username);
			Busqueda(null,true);*/				
		}

	}

})();