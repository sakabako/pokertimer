var PokerRoom = (function($) {
	// hold games in localStorage
	var games = {},
	timeOffset = 0,
	sharedListEl,
	localListEl,
	gameEl,
	mute = true,
	currentGame,
	onBreak = false,
		
	updateList = function( ) {		
		var localGames_a = [];
		for( var name in games ) {
			if (games.hasOwnProperty(name) && games[name]) {
				games[name].wake();
				localGames_a.push(games[name]);
			}
		}
		var template = $('#templates li.game')[0];
		var bindings = ['name', {key:'element',selector:'.state'}];
				
		if (localGames_a.length) {
			$('.tabs .local').show();
			localListEl.innerHTML = '';
			var localFrag = util.template( template, bindings, localGames_a, function(el, game) {
				$(el).bind('click', function(e){
					room.showGame(game.name)
				});
			});
			localListEl.appendChild( localFrag );
		} else {
			$('.tabs .local').hide();
			localListEl.innerHTML = '<li>No games in progress.</li>';
		}
	},
	loadLocalGames = function() {
		var games_a = JSON.parse( localStorage.getItem( 'PokerGames' ) || '[]' ),
		foundOne = false;
		for (var i=0,c=games_a.length; i < c; i++) {
			if (games_a[i].state) {
				var gameName = room.add( games_a[i] );
				foundOne = !!gameName || foundOne;
			}
		}
		if (foundOne) {
			updateList();
			$('.tab-content .local').show();
			$('.tabs > *').removeClass('selected')
			$('.tabs .local').addClass('selected');
		} else {
			$('.tab-content .new-game').show();
			$('.tabs > *').removeClass('selected')
			$('.tabs .new-game').addClass('selected');
		}
		room.save();
	}
	;
	
	$(document).ready(function(){
		sharedListEl = getElementById('shared_games');
		localListEl = getElementById('local_games');
		gameEl = getElementById('game');
		
		var tabs = $('.tabs')[0],
		tabContent = $('.tab-content')[0];
		
		$(tabs.children).each(function(i, el) {
			$(el).bind('click', function() {
				$(tabContent.children).hide()
				$(tabContent.children[i]).show()
				$(tabs.children).removeClass('selected');
				$(el).addClass('selected');
			});
		});
		
		room.start();
	});
	// onload to make sure nothing else is hogging the network (from this window, at least.)
	$(window).bind('load', function() {
		var rand = Math.random();
		$.get('php/time.php', {rand:rand}, function(data) {
			var requestEndTime = new Date(),
			serverTime = parseInt(data,10);
			if (serverTime) {
				room.timeOffset = timeOffset = serverTime - requestEndTime;
			}
			//room.start();
		});
	});
	
	var room = {
		timeOffset: timeOffset,
		update: function(game) {
			if (game) {
				games[game].update();
			}
			return room;
		},
		start: function() {
			loadLocalGames();
			return room;
		},
		get: function ( gameName ) {
			$('#public_feedback').html('Loading...');
			_gaq.push(['_trackEvent', 'sync', 'join-attempt']);
			$.post('php/games.php', {method:'get', name: gameName}, function(data) {
				data = JSON.parse(data);
				data = room.add(data);
				if (data) {
					_gaq.push(['_trackEvent', 'join', 'success']);
					room.showGame(data);
				} else {
					_gaq.push(['_trackEvent', 'join', 'failure']);
					$('#public_feedback').html('No game with that name.');
				}
			});
		},
		add: function (info) {

			var newGame = pokerGame( this, info );
			if (!newGame) {
				return false;
			} else {
				games[newGame.name] = newGame;
				return newGame.name;
			}
		},
		removeGame: function(name) {
			if (games[name]) {
				games[name] = null;
				delete games[name];
				room.save();
			}
			return room;
		},
		save: function() {
			localStorage.removeItem('PokerGames');
			localStorage.setItem('PokerGames', JSON.stringify( room.toArray() ) );
			return room;
		},
		toArray: function() {
			var games_a = [];
			for (var name in games) {
				if (games.hasOwnProperty(name) && games[name]) {
					games_a.push( games[name] );
				}
			}
			return games_a
		},
		list: function() {
			return games;
		},
		move: function( newHome ) {
			if( typeof newHome === 'string' ) {
				newHome = getElementById( newHome );
			}
			newHome.appendChild( container );
			return room;
		},
		showGame: function( name ) {
			mute = false;
			if( games[name] ) {
				$('#start').css({display: 'none'});
				$(gameEl).show();
				for( var game in games ) {
					if (games.hasOwnProperty(game)) {
						if( game === name ) {
							_gaq.push(['_trackEvent', 'game', 'start']);
							currentGame = game
							gameEl.appendChild( games[game].element );
							games[game].focus();
						} else if (games[game]) {
							//$(games[game]).remove();
							games[game].sleep();
						}
					}
				}
			} else {
				console.error('Tried to load "'+name+'", which does not exist.');
			}
			return room;
		}
	};	
	return room;

})(jQuery);
