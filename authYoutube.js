	var settings={
		clientID:'',			
		scope:'https://www.googleapis.com/auth/youtube',
		idChannel:'',
		username:'',
		apiName:'youtube',
		apiVersion:'v3',
		pageSizeMin:10,
		pageSizeMax:50
	};

	googleApiClientReady=function(){

		gapi.auth.init(function(){
			window.setTimeout(checkAuth,1);
		});
	}

	function checkAuth(){
		gapi.auth.authorize({
			client_id:settings.clientID,
			scope:settings.scope,
			immediate:false,
			cookie_policy: 'single_host_origin'
			
		},handleAuthResult);
	}

	function handleAuthResult(authResult){

		if(authResult){			
			//Correcto ocultamos mensajea de bienvenida
			document.getElementById('msg_session').innerText="Bienvenido";
			document.getElementById('btnLogin').className="ocultar";
			
			loadAPIClientInterfaces();

		}else{			
			$("#btnLogin").click(function(){				
				gapi.auth.authorize({client_id:settings.clientID,scope:settings.scopes,immediate:false},handleAuthResult);
			});
		}//Final if
	}//Final function

	function loadAPIClientInterfaces(){
		gapi.client.load(settings.apiName,settings.apiVersion,function(){	
			handleAPILoaded();
		});

	}

	function handleAPILoaded(){		
		FscInserta.Kpis.Youtube.init();
	}

	function checkOut(){		
		gapi.auth.signOut();		
	}

