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

	// execute({
	// 	src: "static/plugins/ufo/rsc/vache.png",
	// 	css: {
	// 		bottom: 0,
	// 		transformOrigin: "100% 100%",
	// 		animation: "ufo-catapulte 4s linear"
	// 	}
	// });
});
