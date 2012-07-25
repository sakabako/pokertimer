define(function( require, exports, module ) {
	var MicroEvent = require('./events').MicroEvent;
	
	var emitter = new MicroEvent();
	
	
	function setTimeAndEmitUpdate(data) {
		var serverTime = parseInt(data,10);
		if (serverTime) {
			var requestEndTime = new Date();
			exports.ms = serverTime - requestEndTime;
			emitter.emit('update', exports.offset);
		}
		
	}
	
	exports.refresh = function() {
		var rand = Math.random();
		$.get('php/time.php', {rand:rand}, setTimeAndEmitUpdate);
	}
	
	exports.ms = 0;
	
	exports.on = emitter.on.bind(emitter);
	exports.off = emitter.off.bind(emitter);
});