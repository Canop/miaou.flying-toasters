
var	miaou,
	auths,
	kfos = new Map, // known flying objects
	MINIMAL_DELAY = 20*60*1000, // in ms
	patterns = [];

function register(kfo){
	kfos.set(kfo.name, kfo);
	kfo.patterns.forEach(pat=>{
		patterns.push({
			re: pat,
			ufo: kfo
		});
	});
}

register({
	name: "spacebullet",
	src: "https://dystroy.org/spacebullet/img/bullet.svg",
	css: {
		transformOrigin: "20px 360px",
		animation: "ufo-left-to-right-once 5s ease-in"
	},
	patterns: [/\bfus.e/i, /\brocket/i]
});
register({
	name: "lococo",
	src: "static/plugins/ufo/rsc/lococo.png",
	css: {
		bottom: 0,
		animation: "ufo-right-to-left-bottom 8s ease-in"
	},
	patterns: [/\bloco(motive)?s?\b/i, /rail(road)?s?\b/i]
});
register({
	name: "sncf",
	src: "static/plugins/ufo/rsc/sncf.png",
	css: {
		bottom: 0,
		animation: "ufo-left-to-right-bottom 7s ease-in"
	},
	patterns: [/\bsncf\b/i, /\btrains?\b/]
});
register({
	name: "avion-rouge",
	src: "static/plugins/ufo/rsc/avion-rouge.png",
	css: {
		bottom: 0,
		transformOrigin: "left top",
		animation: "ufo-going-away-left 3s linear"
	},
	patterns: [/\bplane/i, /avions?\b/i, /airport/i]
});
register({
	name: "vache",
	src: "static/plugins/ufo/rsc/vache.png",
	css: {
		bottom: 0,
		transformOrigin: "100% 100%",
		animation: "ufo-catapulte 4s linear"
	},
	patterns: [/vache/i, /\bcows?\b/i]
});

exports.init = function(_miaou){
	miaou = _miaou;
	auths = miaou.lib("auths");
}


function launch(roomId, args, isServerAdmin){
	var	global = false,
		ufo = args;
	if (typeof ufo !== "object") {
		global = /\bglobal\b/.test(args);
		if (global && !isServerAdmin) {
			throw "Only a server admin can launch a global UFO";
		}
		ufo = kfos.get(args.match(/[\w-]+$/)[0]);
		if (!ufo) {
			throw "Command not understood";
		}
	}
	if (global) {
		miaou.io.sockets.emit("ufo.launch", ufo);
	} else {
		miaou.io.sockets.in(roomId).emit("ufo.launch", ufo);
	}
}

function onCommand(ct){
	ct.silent = true;
	ct.nostore = true;
	launch(ct.shoe.room.id, ct.args, auths.isServerAdmin(ct.shoe.completeUser));
}

function onBotCommand(cmd, args, bot, m){
	launch(m.room, args, false);
}

exports.registerCommands = function(cb){
	cb({
		name: 'ufo',
		fun: onCommand,
		botfun:onBotCommand,
		// no help because it's a "secret" command
	});
}

exports.onNewShoe = function(shoe){
	setTimeout(function(){
		if (!shoe.room) {
			console.log("ufo: no room in shoe");
			return;
		}
		var ufo = null;
		if (ufo) shoe.emit("ufo.launch", ufo);
	}, 3000);
}

exports.onReceiveMessage = function(shoe, m){
	if (!m.content) return;
	for (var i=0; i<patterns.length; i++) {
		if (patterns[i].re.test(m.content)) {
			var pat = patterns[i];
			console.log("ufo found", pat.re.toString());
			var roomTags = shoe.room.tags;
			if (roomTags.includes("serious") || roomTags.includes("no-flood")) {
				console.log("ufo prevented because of room tag");
				return;
			}
			var now = Date.now();
			if (pat.lastTime > now - MINIMAL_DELAY) {
				console.log("last time too recent");
				return;
			}
			launch(m.room, pat.ufo);
			pat.lastTime = now;
			return;
		}
	}
}
