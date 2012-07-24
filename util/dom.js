define( function( require, exports, module ) {
	
	exports.get = function( selector, element ) {
		return (element || document).querySelector( selector );
	};
	
})