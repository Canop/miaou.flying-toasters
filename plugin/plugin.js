
var	miaou,
	auths,
	kfos = new Map; // known flying objects

kfos.set("spacebullet", {
	src: "https://dystroy.org/spacebullet/img/bullet.svg",
	css: {
		transformOrigin: "20px 360px",
		animation: "ufo-left-to-right-once 5s ease-in"
	}
});

exports.init = function(_miaou){
	miaou = _miaou;
	auths = miaou.lib("auths");
}

function launch(roomId, user, args, isServerAdmin){
	var global = /\bglobal\b/.test(args);
	if (global && !isServerAdmin) {
		throw "Only a server admin can launch a global UFO";
	}
	var options = kfos.get(args.match(/\w+$/)[0]);
	if (!options) {
		throw "Command not understood";
	}
	if (global) {
		miaou.io.sockets.emit("ufo.launch", options);
	} else {
		miaou.io.sockets.in(roomId).emit("ufo.launch", options);
	}
}

function onCommand(ct){
	ct.silent = true;
	ct.nostore = true;
	launch(ct.shoe.room.id, ct.shoe.publicUser, ct.args, auths.isServerAdmin(ct.shoe.completeUser));
}

function onBotCommand(cmd, args, bot, m){
	launch(m.room, bot, args, false);
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
