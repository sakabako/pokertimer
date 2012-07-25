define( function( require, exports, module ) {
	
	function LevelViewModel( level ) {
		this.blinds = level.blinds;
		this.game = level.game;
		this.timeRemaining = ko.observable(level.time);
		this.active = ko.observable(false);
		
		var that = this;
		level.on('timeChange', function(newTime) {
			that.timeRemaining(newTime);
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
		console.log(timer.levels, this.levels);
		this.currentLevel = ko.observable( timer.currentLevel );
		this.currentLevelIndex = ko.observable( timer.currentLevelIndex );
		this.currentBlinds = ko.observable( timer.currentLevel.blinds );
		this.currentGame = ko.observable( timer.currentLevel.game );
		
		timer.on( 'levelAdd', function( level, index ) {
			var newLevelVM = new LevelViewModel( level );
			this.levels.splice(index, 0, newLevelVM);
		});
		
		timer.on( 'levelRemove', function( level, index ) {
			this.levels.splice(index, 1);
		});
		
		timer.on( 'levelChange', function( newLevelIndex, oldLevelIndex ) {
			this.currentLevelIndex( newLevelIndex );
			this.currentLevel( this.levels[newLevelIndex] );
			this.currentBlinds( timer.currentLevel.blinds );
			this.currentGame( timer.currentLevel.game );
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