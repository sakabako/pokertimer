define(function( require, exports, module ) {
	var string = require('./string');
	exports.msToString = function( ms ) {
		var sec = Math.floor( ms / 1000 );
		return Math.floor(sec/60)+':'+string.pad(sec%60,2);
	};
});