define( function( require, exports, module ) {
	
	exports.get = function( element, selector ) {
		return (element || document).querySelector( selector );
	};
	
})