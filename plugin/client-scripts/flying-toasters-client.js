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
			ws.on('ufo.launch', function(ufo){
				execute(ufo);
			});
		}
	}


	// execute({
	// 	src: "https://dystroy.org/spacebullet/img/bullet.svg",
	// 	css: {
	// 		transformOrigin: "20px 360px",
	// 		animation: "ufo-left-to-right-once 5s ease-in"
	// 	}
	// });
});
