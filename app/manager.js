define( function( require, exports, module ) {
	
	var dom = require('../util/dom');
	//var begetInputUI = require('./inputUI').beget;
	var begetTimer = require('./game/timer').beget;
	var begetTimerViewModel = require('./game/timerViewModel').beget;
	
	var newGameUI;
	var gameList;
	var gamesContainer;
	
	var timers;
	
	UUIDv4 = function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b}
	
	function addGame( newGame ) {
		var timer = begetTimer( newGame.levels );
		var timerViewModel = begetGameTimerViewModel( timer );
		
		timer.id = UUIDv4();
		
		timers.push()
	};
	
	exports.init = function() {
		
		var levelList
		
		//newGameUI = begetInputUI( dom.get('#newGameForm') );
		//newGameUI.on('beginGame', addGame );
		
		var localTimers = JSON.parse( localStorage.getItem( 'PokerGames' ) || '[]' ).map( begetTimer ).map( begetTimerViewModel );
		
		timers = ko.observableArray( localTimers );
		
		gamesContainer = dom.get('#local-games');
		
		ko.applyBindings( gamesContainer, timers );
		
	};
})