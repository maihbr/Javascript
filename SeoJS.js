var seoJS = seoJS || {};
seoJS.Metas=(function(){


	var _iPosMeta =-1;
	
	return{

		AddAtributeToHtml:function(attributeName,value){
			document.getElementsByTagName("html")[0].setAttribute(attributeName,value);
		},
		AddAtributeToHead:function(attributeName,value){			
			document.getElementsByTagName("head")[0].setAttribute(attributeName,value);						
		},
		Add:function(metaName,content){
							
			if(this.HasMeta(metaName)){
				this.SetContent(metaName,content);
			}else{				
				var meta = document.createElement("meta");
				meta.textContent=" ";
				if(!this.IsOpenGraf(metaName))				
					meta.name = metaName;
				else
					meta.setAttribute("property",metaName);

				meta.content = content;			
				var head = document.getElementsByTagName("head");			
				head[0].appendChild(meta);

			}										
		},
		HasMeta:function(metaName){
			var retorno = false;
			var metas = document.getElementsByTagName("meta");
			if(metas.length>0){
				var bNext=true;
				var i=0;
				while(bNext && i<metas.length){

					if(!this.IsOpenGraf(metaName))
						bNext = (metas[i].name===metaName)?false:true;
					else
						bNext =(metas[i].getAttribute("property")===metaName)?false:true;

					i++;
				}

				if(!bNext){					
					_iPosMeta=--i;
					retorno=true;
				}
			}
			return retorno;
		},
		SetContent:function(metaName,value){
			if(this.HasMeta(metaName))
				document.getElementsByTagName("meta")[_iPosMeta].content=value;						
		},
		GetContent:function(metaName){
			
			if(this.HasMeta(metaName))
				return document.getElementsByTagName("meta")[_iPosMeta].content;
			else
				return null;

		},
		Remove:function(metaName){
			if(this.HasMeta(metaName)){				
				var elem =document.getElementsByTagName("meta")[_iPosMeta];
				elem.parentNode.removeChild(elem);				
			}				
				
		},
		Clear:function(){
			
			var metas = document.getElementsByTagName("meta");
			for(var i=metas.length;i--;){
				var elem = metas[i];
				elem.parentNode.removeChild(elem);
			}
													
		},
		IsOpenGraf:function(meta){	
			var retorno=false;
			if(typeof(meta)==="string")
				retorno=(meta.indexOf("og:")>-1)?true:false;
			else
				retorno=(meta.hasAttribute('property'))?true:false;

			return retorno;
			
		},
		Debug:function(){
			var metas = document.getElementsByTagName("meta");
			var i;
			for(i=0;i<metas.length;i++){				
				if(!metas[i].hasAttribute('property'))
					console.log(metas[i].name);
				else
					console.log(metas[i].getAttribute("property"));
			}				
		},		
		getPosMeta:function(){
			return _iPosMeta;
		}
	}

})();

