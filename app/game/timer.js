define(function(requre, exports, module) {
	
	var EventEmitter = require('../../util/events');
	//var timeOffset = require('../../util/timeOffset');
	
	function Level( properties ) {
		this.totalTime = properties.totalTime;
		this.game = properties.game;
		this.blinds = properties.game;
		this.time = properties.time || properties.totalTime;
		
		this.emitter = new EventEmitter();
		this.on = this.emitter.on.bind(this);
		this.off = this.emitter.removeListener.bind(this);
	}
	
	Level.prototype.setTime = function( newTime ) {
		this.time = newTime;
		this.emitter.emit('timeChange');
	};
	Level.prototype.start = function() {
		this.emitter.emit('start');
	};
	Level.prototype.start = function() {
		this.emitter.emit('end');
	};
	
	
	function Timer( levels ) {
		
		this._timeout;
		
		this.originalStartTime;
		
		this.levels = levels;
		
		this.currentLevel;
		this.currentLevelIndex;
		this.levelStartTime;
		this.timeRemainingInCurrentLevel;
		
		
		this.emitter = new EventEmitter();
		
		this.on = this.emitter.on.bind(this.emitter);
		this.off = this.emitter.removeListener.bind(this.emitter);
		
	}
	
	Timer.prototype.updateState = function() {
		var timeInThisLevel = (new Date()) - this.levelStartTime + timeOffset.ms;
		var currentLevelIndexAtStart = this.levels.indexOf(this.currentLevel);
		
		while (timeInThisLevel > this.currentLevel.duration) {
			// time to advance one or more levels
			var nextLevelIndex = (nextLevelIndex || currentLevelIndexAtStart) + 1;
			var timeLeft = this.currentLevel.duration - timeInThisLevel;
			
			// end the current level
			this.currentLevel.setTime( 0 );
			this.emitter.emit('timeUpdate', 0, this.currentLevel);
			if (nextLevelIndex === this.levels.length) {
				this.end();
				return;
			}
			
			// start the next
			this.currentLevel = this.levels[nextLevelIndex];
			
			// continue the while loop
			timeInThisLevel -= timeLeft;
		}
		
		if (nextLevelIndex) {
			this.currentLevelIndex = nextLevelIndex;
			this.emitter.emit('levelChange', currentLevelIndexAtStart, nextLevelIndex);
		}
		
		this.currentLevel.setTime( timeLeft );
		this.emitter.emit('stateupdate', timeLeft, this.currentLevelIndex);
	};
		
	Timer.prototype.start = function() {
		if (this.timeout) { return; }
		
		if (!this.originalStartTime) {
			this.levelStartTime = this.originalStartTime = new Date();
		}
		
		if (this.pauseTime) {
			this.levelStartTime += (new Date()) - this.pauseTime;
		}
		
		var that = this;
		function update() {
			that.updateState();
			var timeSinceStart = that.originalStartTime - (new Date()) + timeOffset.ms;
			var offset = timeSinceStart % 1000;
			that.timeout = setTimeout( update, offset );
		}
		this.emitter.emit('start');
		update();
	};
	
	Timer.prototype.end = function() {
		clearTimeout(this.timeout);
		this.emitter.emit('end');
	};
	
	Timer.prototype.pause = function() {
		this.emitter.emit('pause');
		this.pauseTime = new Date();
	};
	
	Timer.prototype.mute = function() {
		this.emitter.emit('mute');
		clearTimeout(this.timeout);
	};
	
	Timer.prototype.insertNow = function( newLevel ) {
		var currentIndex = this.levels.indexOf(this.currentLevel);
		this.insertAtIndex( newLevel, index );
	};
	
	Timer.prototype.insertNext = function( newLevel ) {
		var currentIndex = this.levels.indexOf(this.currentLevel);
		this.insertAtIndex( newLevel, index+1 );
	};
	
	Timer.prototype.insertAtIndex = function( newLevel, index ) {
		this.levels.splice( index, 0, newLevel );
		this.emitter.emit( 'levelAdd', newLevel, index );
	}
	
	exports.begetLevel = function( level ) {
		return new Level( level );
	};
	exports.beget = function( levels ) {
		levels = levels.map(exports.begetLevel);
		return new Timer( levels );
	}
	
})