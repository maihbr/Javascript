$(document).ready(function() {
	
	var url = "http://" + location.host + "/api/index.php";

	$.getJSON(url, function(data) {		
		var indice=0;	

		$.each(data, function(indice) {		

			var text= this.text;
			if(typeof this.retweeted_status==="object")
				text = "RT @" + this.retweeted_status.user['screen_name'] + ": " + this.retweeted_status.text;
							
			indice++;		
				var tweet = $("<p id='tw"+indice+"'></p>").html(text);				
				tweet.html( 
					tweet.html()
					.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a href="$1" target="_blank" rel="nofollow">$1</a>')
					//.replace(/(^|\s|\.)#(\w+)/g,'$1<a href="http://search.twitter.com/search?q=%23$2" target="_blank" rel="nofollow">#$2</a>')
					.replace(/(^|\s)#([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]{1,})/g,'$1<a href="http://search.twitter.com/search?q=%23$2" target="_blank" rel="nofollow">#$2</a>')
					.replace(/(^|\s|\.)@(\w+)/g,'$1<a href="http://twitter.com/$2" target="_blank" rel="nofollow">@$2</a>')					
					)
					.append("<br/><a href='https://twitter.com/intent/tweet?in_reply_to="+this.id_str +"' target='_blank' title='Se abrira en una ventana nueva'>Responder</a>&nbsp;<a href='https://twitter.com/intent/retweet?tweet_id="+this.id_str+"' target='_blank' title='Se abrira en una ventana nueva'>Retweet</a>&nbsp;<a href='https://twitter.com/intent/favorite?tweet_id="+this.id_str+"' target='_blank' title='Se abrira en una ventana nueva'>Favorito</a>")						   					
					.appendTo('#tweetsFondo')					
					.fadeIn();
		});
	});
});

