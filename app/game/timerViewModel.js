define( function( require, exports, module ) {
	
	function LevelViewModel( level ) {
		this.blinds = level.blinds;
		this.game = level.game;
		this.timeRemaining = ko.observable(level.time);
		this.active = ko.observable(false);
		
		level.on('timeChange', function(newTime) {
			this.timeRemaining(newTime);
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
		this.currentLevelIndex = ko.observable( timer.currentLevelIndex );
		this.currentBlinds = ko.observable( timer.currentLevel.blinds );
		
		timer.on( 'levelAdd', function( level, index ) {
			var newLevelVM = new LevelViewModel( level );
			this.levels.splice(index, 0, newLevelVM);
		});
		
		timer.on( 'levelRemove', function( level, index ) {
			this.levels.splice(index, 1);
		});
		
		timer.on( 'levelChange', function( newLevelIndex, oldLevelIndex ) {
			this.currentLevelIndex( newLevelIndex );
			this.currentBlinds( timer.currentLevel.blinds );
			//this.scrollCurrentLevelToMiddle();
		});
		
	}
	
	
	exports.begetLevelViewModel = function( level ) {
		return new LevelViewModel( level );
	}
	exports.begetTimerViewModel = function( timer ) {
		return new TimerViewModel( timer );
	};
});