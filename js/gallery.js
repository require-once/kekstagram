'use strict';

(function() {
	
	var USER_PHOTOS = [];
	
	
	/* Отрисовка фоток пользователей */
	var renderPictures = function(user_photos) {
		var template = document.querySelector('#picture').content.querySelector('a');
		var fragment = document.createDocumentFragment();

		for (var i = 0; i < user_photos.length; i++) {
			template.querySelector('img').src = user_photos[i].url;
			template.querySelector('.picture__info .picture__likes').textContent = user_photos[i].likes;
			template.querySelector('.picture__info .picture__comments').textContent = user_photos[i].comments.length;
			fragment.appendChild(template.cloneNode(true));
		}
		
		var userPictures = document.querySelector('.pictures');
		userPictures.appendChild(fragment);
	}


	/* Обработчики закрытия большой фотки */
	var onBigPictureCloseButtonPress = function(evt) {
		if (evt.keyCode === window.utils.ESC_KEYCODE) {
			closeBigPicture();
		}
	};

	var closeBigPicture = function() {
		document.body.classList.remove('modal-open');
		document.querySelector('.big-picture').classList.add('hidden');
		document.removeEventListener('keydown', onBigPictureCloseButtonPress);
	};
	

	/* Показ большой фотки */
	var showBigPicture = function(index) {
		document.body.classList.add('modal-open');
		document.querySelector('.big-picture').classList.remove('hidden');
		document.querySelector('.big-picture__img img').src = USER_PHOTOS[index].url;
		document.querySelector('.big-picture__img img').alt = USER_PHOTOS[index].description;
		document.querySelector('.likes-count').textContent = USER_PHOTOS[index].likes;
		document.querySelector('.comments-count').textContent = USER_PHOTOS[index].comments.length;
		document.querySelector('.social__caption').textContent = USER_PHOTOS[index].description;
		
		var socialComments = document.querySelector('.social__comments');
		socialComments.innerHTML = '';
		
		var template = document.querySelector('#comment').content.querySelector('.social__comment');
		var fragment = document.createDocumentFragment();
			
		for (var i = 0; i < USER_PHOTOS[index].comments.length; i++) {
			template.querySelector('img').src = USER_PHOTOS[index].comments[i].avatar;
			template.querySelector('.social__text').textContent = USER_PHOTOS[index].comments[i].message;
			fragment.appendChild(template.cloneNode(true));
		}
		
		socialComments.appendChild(fragment);
		
		document.querySelector('.big-picture #picture-cancel').addEventListener('click', closeBigPicture);
		document.addEventListener('keydown', onBigPictureCloseButtonPress);
	};

	document.querySelector('.social__comment-count').classList.add('visually-hidden');
	document.querySelector('.social__comments-loader').classList.add('visually-hidden');


	/* Обработчик успешной загрузки фоток пользователей */
	var successHandler = function(photos) {
		//console.log(photos);
		USER_PHOTOS = photos;
		renderPictures(photos);
		
		/* Показ большой фотки при клике по миниатюре */
		var miniatures = document.querySelectorAll('.pictures.container a');

		miniatures.forEach(function(item, index) {
			item.addEventListener('click', function() {
				showBigPicture(index);
			});
		});
	};
	
	window.backend.load(successHandler, window.backend.errorHandler);

})();
