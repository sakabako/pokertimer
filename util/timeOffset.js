define(function( require, exports, module ) {
	var EventEmitter = require('./events');
	
	var emitter = new EventEmitter();
	
	
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
	exports.off = emitter.removeListener.bind(emitter);
});