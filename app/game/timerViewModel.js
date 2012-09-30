define( function( require, exports, module ) {
	
	var timeDisplay = require('../../util/timeDisplay');
	
	function LevelViewModel( level ) {
		this.blinds = level.blinds;
		this.game = level.game;
		this.timeRemaining = ko.observable(level.time);
		this.active = ko.observable(false);
		
		var that = this;
		level.on('timeChange', function(newTime) {
			that.timeRemaining( timeDisplay.msToString(newTime) );
		});
		
		level.on('start', function() {
			this.active(true);
		});
		level.on('end', function() {
			this.active(false);
		});
	}
	
	function TimerViewModel( timer ) {
		
		this.timer = timer;
		this.levels = ko.observableArray( timer.levels.map( exports.begetLevelViewModel ) );
		this.currentLevel = ko.observable( timer.currentLevel );
		this.currentLevelIndex = ko.observable( timer.currentLevelIndex );
		this.currentLevelTimeRemaining = ko.observable( timer.currentLevel.time );
		this.currentBlinds = ko.observable( timer.currentLevel.blinds );
		this.currentGame = ko.observable( timer.currentLevel.game );
		
		var that = this;
		
		timer.on( 'levelAdd', function( level, index ) {
			var newLevelVM = new LevelViewModel( level );
			that.levels.splice(index, 0, newLevelVM);
		});
		
		timer.on( 'levelRemove', function( level, index ) {
			that.levels.splice(index, 1);
		});
		
		timer.on( 'levelChange', function( newLevelIndex, oldLevelIndex ) {
			that.currentLevelIndex( newLevelIndex );
			that.currentLevel( that.levels()[newLevelIndex] );
			that.currentBlinds( timer.currentLevel.blinds );
			that.currentGame( timer.currentLevel.game );
			//this.scrollCurrentLevelToMiddle();
		});
		
		timer.on( 'timeChange', function( newTime ) {
			that.currentLevelTimeRemaining( timeDisplay.msToString(newTime) );
		});
				
	}
	
	
	exports.begetLevelViewModel = function( level ) {
		return new LevelViewModel( level );
	}
	exports.begetTimerViewModel = function( timer ) {
		return new TimerViewModel( timer );
	};
});