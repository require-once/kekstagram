'use strict';

(function() {
	
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

	renderPictures(window.user_photos);


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
		document.querySelector('.big-picture__img img').src = window.user_photos[index].url;
		document.querySelector('.big-picture__img img').alt = window.user_photos[index].description;
		document.querySelector('.likes-count').textContent = window.user_photos[index].likes;
		document.querySelector('.comments-count').textContent = window.user_photos[index].comments.length;
		document.querySelector('.social__comment .social__picture').src = 'img/avatar-' + window.utils.getRandomInteger(1, 6) + '.svg';
		document.querySelector('.social__caption').textContent = window.user_photos[index].description;
		
		var socialComment = document.querySelector('.social__comments');
		var commentsTexts = document.querySelectorAll('.social__comment .social__text');
		
		if (window.user_photos[index].comments.length === 1) {
			commentsTexts[0].textContent = window.user_photos[index].comments[0];
			socialComment.children[1].classList.add('hidden');
		} else if (window.user_photos[index].comments.length === 2) {
			socialComment.children[1].classList.remove('hidden');
			commentsTexts[0].textContent = window.user_photos[index].comments[0];
			commentsTexts[1].textContent = window.user_photos[index].comments[1];
		}
		
		document.querySelector('.big-picture #picture-cancel').addEventListener('click', closeBigPicture);
		document.addEventListener('keydown', onBigPictureCloseButtonPress);
	};


	document.querySelector('.social__comment-count').classList.add('visually-hidden');
	document.querySelector('.social__comments-loader').classList.add('visually-hidden');


	/* Показ большой фотки при клике по миниатюре */
	var miniatures = document.querySelectorAll('.pictures.container a');

	miniatures.forEach(function(item, index) {
		item.addEventListener('click', function() {
			showBigPicture(index);
		});
	});

})();
