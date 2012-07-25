define( function( require, exports, module ) {
	
	var dom = require('../util/dom');
	//var begetInputUI = require('./inputUI').beget;
	var begetTimer = require('./game/timer').beget;
	var begetTimerViewModel = require('./game/timerViewModel').begetTimerViewModel;
	
	var newGameUI;
	var gameList;
	var gamesContainer;
	
	UUIDv4 = function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b}
	
	exports.init = function() {
				
		//newGameUI = begetInputUI( dom.get('#newGameForm') );
		//newGameUI.on('beginGame', addGame );
		
		var localTimers = JSON.parse( localStorage.getItem( 'PokerGames' ) || '[]' );
		localTimers = localTimers.map( begetTimer );
		console.log(localTimers);
		var localTimerViewModels = localTimers.map( begetTimerViewModel );
		console.log(localTimers);
		var timers = ko.observableArray( localTimerViewModels );
		console.log(timers);
		
		localTimers.forEach(function(timer){ timer.start(); });
		
		gamesContainer = dom.get('#local-games');
		
		ko.applyBindings( {timers: timers}, gamesContainer );
		
	};
})