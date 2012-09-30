define( function( require, exports, module ) {
	
	exports.get = function( selector, element ) {
		return (element || document).querySelector( selector );
	};
	
	exports.begetTabWidget = function( tabContainer, panelContainer ) {
		var currentPanel;
		
		var tabWidget = {
			select: function( panelSelector ) {
				if (currentPanel) {
					currentPanel.hide();
				}
				currentPanel = $(panelSelector, panelContainer).show();
			}
		};
		
		$(tabContainer).on('click', '[data-panel]', function( event ) {
			tabWidget.select( event.target.getAttribute('data-panel') )
		});
		
		return tabWidget;
	};
		
})