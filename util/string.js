define(function( require, exports, module) {
	
	exports.pad = function (num, totalChars, padWith) {
		num = num + "";
		padWith = padWith ? padWith : "0";
		totalChars = totalChars ? totalChars : 2;
		if (num.length < totalChars) {
			while (num.length < totalChars) {
				num = padWith + num;
			}
		}
	
		if (num.length > totalChars) { //if padWith was a multiple character string and num was overpadded
			num = num.substring((num.length - totalChars), totalChars);
		}
	
		return num;
	}
});