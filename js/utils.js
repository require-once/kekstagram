"use strict";

(function() {
	
	window.utils = {
		getRandomInteger: function(min, max) {
			var rand = min + Math.random() * (max + 1 - min);
			return Math.floor(rand);
		},
		
		ESC_KEYCODE: 27,
	};
	
})();
