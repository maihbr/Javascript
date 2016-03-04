var FscInserta={};
FscInserta.Cookies=(function(){

	return{

		Add:function(nameCookie,value,expDays){
			 var fecha = new Date();
   			 fecha.setTime(fecha.getTime() + (expDays*24*60*60*1000));
   			 var expires = "expires="+fecha.toGMTString();   			
    		 document.cookie = nameCookie + "=" + value + "; " + expires;
		},
		Delete:function(nameCookie,domain){
			if(this.Exists(nameCookie))
				document.cookie=nameCookie+"=delete;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain="+domain;
		},
		Clear:function(cookieException,domain){
			
			if(this.hasCookies()){
				var ca = document.cookie.split(';');
				for(var i=0; i<ca.length; i++) {			       
			        var nameCookie=ca[i].substring(0,ca[i].indexOf('='));
			       
			        if(cookieException===null)		        
			         	document.cookie=nameCookie+"=delete;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain="+domain;
			         else{

			         	if(cookieException.indexOf(nameCookie)==-1)
			         		document.cookie=nameCookie+"=delete;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain="+domain;
			         }			       
			    }
			}			
		},
		Exists:function(nameCookie){
			return (document.cookie.indexOf(nameCookie+"=")>-1)?true:false;
		},
		hasCookies:function(){			
			return (document.cookie.length > 0)?true:false;		
		},
		getValue:function(nameCookie){

			var name = nameCookie + "=";
		    var ca = document.cookie.split(';');
		   
		    for(var i=0; i<ca.length; i++) {
		        var c = ca[i];		        
		        while (c.charAt(0)==' '){		        	
		        	c = c.substring(1);		        	
		        }
		        	
		        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
		    }
		    return "";

		},		
		Enabled:function(){
			return window.navigator.cookieEnabled;
		},
		javascriptEnabled:function(){
			return window.navigator.javaEnabled;
		}
	}

})();


(function () {

     var MyCookie = "gaOptIn";
     var dominio ="."+ location.host;
     var urlInfo="ley-cookies.php"
     var DivDestino = "publicidad";

     function CrearteAviso() {

     	var divInfo=document.createElement("div");
		divInfo.className="info";
		divInfo.innerHTML="Este sitio web utiliza cookies anal&iacute;ticas para ayudarnos a mejorar la experiencia de usuario. &iquest;Est&aacute; de acuerdo con el uso de estas cookies? ";
		divInfo.innerHTML+="<a href='"+urlInfo+"'>M&aacute;s informaci&oacute;n</a>&nbsp;";

		var btnAceptar = document.createElement("button");       
        btnAceptar.Id = "btnOkCookie";
        btnAceptar.className = "btn_cookies";
        btnAceptar.innerHTML = "Aceptar";

         btnAceptar.onclick=function(){
        	FscInserta.Cookies.Add(MyCookie, "yes", 365);
        	DeleteAviso()
    	}

		var btnCancelar = document.createElement("button");
	        btnCancelar.Id = "btnKoCookie";
	        btnCancelar.className = "btn_cookies";
	        btnCancelar.innerHTML = "Cancelar";

	    btnCancelar.onclick=function(){
	         FscInserta.Cookies.Clear(null,dominio);
	        FscInserta.Cookies.Add(MyCookie, "no", 365);
	        DeleteAviso();
	    }

		divInfo.appendChild(btnAceptar);
		divInfo.appendChild(btnCancelar);

		var divCookie=document.createElement("div");
		divCookie.id="cookie";
		divCookie.appendChild(divInfo);
		console.log(document.getElementById(DivDestino));
		document.getElementById(DivDestino).appendChild(divCookie);

     }//Final CreateAviso

   
      function DeleteAviso() {

        var divCookies = document.getElementById("cookie");
        divCookies.parentElement.removeChild(divCookies);

    }

	window.onload = function () {
            
       if (!FscInserta.Cookies.Exists(MyCookie)){
              CrearteAviso();      
        }else{
             if (FscInserta.Cookies.getValue(MyCookie).toLowerCase() === "no")
                FscInserta.Cookies.Clear(MyCookie,dominio);
        }     
    }

})();