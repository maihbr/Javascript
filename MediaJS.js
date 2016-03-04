/*********************************************************************
Objetivo : Clase para extraer el Id de videos de / youtube / RTVE / ivoox /vimeo.
*********************************************************************/

var MediaJS = MediaJS || {};
MediaJS.Extractor=(function(){

    var esYoutube=function(url){
        return (url.toLowerCase().indexOf('youtube') >= 0 || url.toLowerCase().indexOf('youtu.be') >= 0)?true:false;
    };

    var esRtve=function(url){
       return (url.toLowerCase().indexOf('rtve') >= 0)?true:false;
    };

    var esIvoox=function(url){
        return (url.toLowerCase().indexOf('ivoox') >= 0)?true:false;
    };

    var esVimeo=function(url){
         return (url.toLowerCase().indexOf('vimeo') >= 0)?true:false;
    };

    var getIdYoutube=function (url) {

            var retorno;
            var DataYoutube = { 'patrones': [/v\/[0-9a-zA-Z-_]{1,}/, /v=[0-9a-zA-Z-_]{1,}/, /d\/[0-9a-zA-Z-_]{1,}/, /e\/[0-9a-zA-Z-_]{1,}/] };
            var i=0;
            var encontrado = false;
            var result;
            while (!encontrado && i < DataYoutube.patrones.length) {
                result = DataYoutube.patrones[i].exec(url);
                if (result != null) {
                    encontrado = true;
                    retorno = result.toString().substring(2, 200);
                }
                i++;
            }
            return retorno;
    };

    var getIdRtve=function (url) {
        var patron  = /[0-9]{1,}\/*$/;
        var patron1 = /^[0-9]{1,}/;
        var result  = patron.exec(url);        
        return patron1.exec(result);
    };

    var getIdIvoox=function(url){

        var patron  = /_[0-9]{1,}/;
        var patron1 = /[0-9]{1,}/;
        var result  = patron.exec(url);        
        return patron1.exec(result);

    };

    var getIdVimeo=function(url){

        var patron  = /[0-9]{1,}$/;        
        return patron.exec(url);        
    };    

    return {

        hasPlatform:function(item){
            return (esYoutube(item) || esRtve(item) || esIvoox(item) || esVimeo(item))?true:false;
        },

        getId:function(url) {

            var retorno;

            if (esYoutube(url))
                retorno = getIdYoutube(url);
            else if(esRtve(url))
                retorno = getIdRtve(url);
            else if(esIvoox(url))                
                retorno =getIdIvoox(url);
            else if(esVimeo(url))
                retorno = getIdVimeo(url);

            return retorno;
        }

    }

})();




    


