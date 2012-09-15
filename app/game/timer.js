define(function(requre, exports, module) {
	
	var MicroEvent = require('util/events').MicroEvent;
	var timeOffset = require('util/timeOffset');
	
	function Level( properties ) {
		this.duration = properties.duration;
		this.game = properties.game;
		this.blinds = properties.blinds;
		this.time = properties.time || properties.totalTime;
		
		this.emitter = new MicroEvent();
		this.on = this.emitter.on.bind(this.emitter);
		this.off = this.emitter.off.bind(this.emitter);
	}
	
	Level.prototype.setTime = function( newTime ) {
		this.time = newTime;
		this.emitter.emit( 'timeChange', newTime );
	};
	Level.prototype.start = function() {
		this.emitter.emit('start');
	};
	Level.prototype.end = function() {
		this.emitter.emit('end');
	};
	
	
	function Timer( levels ) {
		
		this._timeout;
		
		this.originalStartTime;
		
		this.levels = levels;
		this.currentLevel = levels[0];
		this.currentLevelIndex = 0;
		this.levelStartTime;		
		
		this.emitter = new MicroEvent();
		this.on = this.emitter.on.bind(this.emitter);
		this.off = this.emitter.off.bind(this.emitter);
		
	}
	
	Timer.prototype.updateState = function() {
		var timeSinceLastUpdate = (new Date()) - this.lastUpdate;
		var currentLevelIndexAtStart = this.levels.indexOf(this.currentLevel);
		
		while (timeSinceLastUpdate > this.currentLevel.duration) {
			// time to advance one or more levels
			var nextLevelIndex = (nextLevelIndex || currentLevelIndexAtStart) + 1;
			var timeLeft = this.currentLevel.duration - timeInThisLevel;
			
			// end the current level
			this.currentLevel.setTime( 0 );
			this.emitter.emit('timeChange', 0, this.currentLevel);
			if (nextLevelIndex === this.levels.length) {
				this.end();
				return;
			}
			
			// start the next
			this.currentLevel = this.levels[nextLevelIndex];
			
			// continue the while loop
			timeSinceLastUpdate -= timeLeft;
		}
		
		if (nextLevelIndex) {
			this.currentLevelIndex = nextLevelIndex;
			this.emitter.emit('levelChange', currentLevelIndexAtStart, nextLevelIndex);
		}
		
		var timeRemaining = this.currentLevel.time - timeSinceLastUpdate
		this.currentLevel.setTime( timeRemaining );
		this.lastUpdate = new Date();
		this.emitter.emit('timeChange', timeRemaining, this.currentLevel);
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
			var offset = that.currentLevel.time % 1000;
			if (offset < 10) {
				offset += 1000;
			}
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
	};
	
	exports.begetLevel = function( level ) {
		return new Level( level );
	};
	exports.beget = function( dto ) {
		var levels = dto.state.map(exports.begetLevel);
		var timer = new Timer( levels );
		
		timer.name = dto.name;
		timer.blinds = dto.blinds;
		timer.syncToken = dto.syncToken || 0;
		timer.blindDuration = dto.blindDuration;
		timer.breakDuration = dto.breakDuration;
		timer.lastUpdate = dto.lastUpdate || new Date();
		
		return timer;
	};
	
})