miaou(function(gui, locals, plugins, ws){

	function executeLoaded(ufo){
		var $img = $(ufo.img).appendTo(document.body);
		$img.addClass("ufo").css(ufo.css).on("animationend webkitAnimationEnd", function(){
			$img.remove();
		});
	}

	function execute(ufo){
		var img = document.createElement("img");
		img.onload = function(){
			ufo.img = img;
			executeLoaded(ufo);
		};
		img.src = ufo.src;
	}

	plugins.ufo = {
		start: function(){
			if (gui.mobile) return;
			ws.on('ufo.launch', function(ufo){
				execute(ufo);
			});
		}
	}

	//execute({
	//	src: "https://dystroy.org/flying-toasters/avion-rouge.png",
	//	css: {
	//		bottom: 0,
	//		animation: "ufo-going-away-left 2s linear"
	//	}
	//});
});
