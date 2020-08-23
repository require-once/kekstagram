'use strict';

(function() {
	
	var URL_GET = 'https://javascript.pages.academy/kekstagram/data';
	var URL_SEND = 'https://javascript.pages.academy/kekstagram';
	
	window.backend = {
		load: function(onLoad, onError) {
			var xhr = new XMLHttpRequest();
			xhr.responseType = 'json';

			xhr.addEventListener('load', function() {
				if (xhr.status === 200) {
					onLoad(xhr.response);
				} else {
					onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
				}
			});
			xhr.addEventListener('error', function() {
				onError('Произошла ошибка соединения');
			});
			xhr.addEventListener('timeout', function() {
				onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
			});
			
			xhr.timeout = 10000;
			
			xhr.open('GET', URL_GET);
			xhr.send();
		},
		
		send: function(data, onLoad, onError) {
			var xhr = new XMLHttpRequest();
			xhr.responseType = 'json';
			
			xhr.addEventListener('load', function() {
				if (xhr.status === 200) {
					onLoad(xhr.response);
				} else {
					onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
				}
			});
			xhr.addEventListener('error', function() {
				onError('Произошла ошибка соединения');
			});
			xhr.addEventListener('timeout', function() {
				onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
			});
			
			xhr.timeout = 10000;
			
			xhr.open('POST', URL_SEND);
			xhr.send(data);
		},
		
		errorHandler: function(errorMessage) {
			var node = document.createElement('div');
			node.style = 'z-index: 100; margin: 0 auto; text-align:center; background-color: red';
			node.style.padding = '15px';
			node.style.position = 'absolute';
			node.style.left = 0;
			node.style.right = 0;
			node.style.fontSize = '30px';
			
			node.textContent = errorMessage;
			document.body.insertAdjacentElement('afterBegin', node);
		},
	};
	
})();

