define(function( require, exports, module ) {
	exports.begetGame = function() {
		return {
			id: 'test',
			state: [
				{blinds:'100/200', game:'Hold Em', duration:600000, time:3000},
				{blinds:'200/400', game:'Omaha', duration:600000},
				{blinds:'400/800', game:'Hold Em', duration:600000}
			],
			lastUpdate: new Date(),
			blindDuration: 600,
			breakDuration: 600
		}
	}
});