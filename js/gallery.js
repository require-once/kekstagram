'use strict';

(function() {
	
	var USER_PHOTOS = [];
	var CURRENT_INDEX = 0;
	var CURRENT_PHOTOS = [];
	
	
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


	/* Обработчик подгрузки комментариев */
	var onCommentsLoaderClick = function() {
		var socialComments = document.querySelector('.social__comments');
		var commentsCount = document.querySelector('.social__comment-count');
		var commentsNow = commentsCount.childNodes[0];
		var commentsLoaded = socialComments.childNodes.length;
		
		var commentsRemains = CURRENT_PHOTOS[CURRENT_INDEX].comments.length - commentsLoaded;
		//console.log('загружаем ещё:');
		//console.log(commentsRemains);
		
		if (commentsRemains <= 5) {
			commentsNow.textContent = commentsLoaded + commentsRemains + ' из ';
			document.querySelector('.social__comments-loader').classList.add('visually-hidden');
		} else {
			commentsNow.textContent = parseInt( commentsNow.textContent.slice(0,1) ) + 5 + ' из ';
			document.querySelector('.social__comments-loader').classList.remove('visually-hidden');
		}
		
		if (commentsRemains > 5) {
			renderComment(CURRENT_PHOTOS, CURRENT_INDEX, 5, commentsLoaded);
		} else {
			renderComment(CURRENT_PHOTOS, CURRENT_INDEX, commentsRemains, commentsLoaded);
		}
	};


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
		document.querySelector('.social__comments-loader').removeEventListener('click', onCommentsLoaderClick);
	};
	

	/* Отрисовка одного комментария */
	var renderComment = function(photosArr, photoIndex, count, start) {
		var template = document.querySelector('#comment').content.querySelector('.social__comment');
		var fragment = document.createDocumentFragment();
		
		for (var i = 0; i < count; i++) {
			template.querySelector('img').src = photosArr[photoIndex].comments[i + start].avatar;
			template.querySelector('.social__text').textContent = photosArr[photoIndex].comments[i + start].message;
			fragment.appendChild(template.cloneNode(true));
		}
		
		var socialComments = document.querySelector('.social__comments');
		socialComments.appendChild(fragment);
	};
	
	
	/* Показ большой фотки */
	var showBigPicture = function(photos_array, index) {
		document.body.classList.add('modal-open');
		document.querySelector('.big-picture').classList.remove('hidden');
		document.querySelector('.big-picture__img img').src = photos_array[index].url;
		document.querySelector('.big-picture__img img').alt = photos_array[index].description;
		document.querySelector('.likes-count').textContent = photos_array[index].likes;
		document.querySelector('.comments-count').textContent = photos_array[index].comments.length;
		document.querySelector('.social__caption').textContent = photos_array[index].description;
		
		var socialComments = document.querySelector('.social__comments');
		socialComments.innerHTML = '';
		
		// Счётчик комментариев
		var commentsCount = document.querySelector('.social__comment-count');
		var commentsNow = commentsCount.childNodes[0];
		var commentsTotal = commentsCount.childNodes[1].childNodes[0];
		
		if (photos_array[index].comments.length <= 5) {
			commentsNow.textContent = photos_array[index].comments.length + ' из ';
			document.querySelector('.social__comments-loader').classList.add('visually-hidden');
		} else {
			commentsNow.textContent = '5 из ';
			document.querySelector('.social__comments-loader').classList.remove('visually-hidden');
		}
		
		// Отрисовка комментариев
		if (photos_array[index].comments.length > 5) {
			renderComment(photos_array, index, 5, 0);
		} else {
			renderComment(photos_array, index, photos_array[index].comments.length, 0);
		}
		
		var commentsLoader = document.querySelector('.social__comments-loader');
		CURRENT_INDEX = index;
		commentsLoader.addEventListener("click", onCommentsLoaderClick);
		
		document.querySelector('.big-picture #picture-cancel').addEventListener('click', closeBigPicture);
		document.addEventListener('keydown', onBigPictureCloseButtonPress);
	};
	

  /* Фильтр - "по умолчанию" */
  var onFilterDefaultClick = function() {
    var userPictures = document.querySelector('.pictures');
    while (userPictures.lastChild && userPictures.lastChild.nodeName === 'A') {
      userPictures.removeChild(userPictures.lastChild);
    }
		
    renderPictures(USER_PHOTOS);
		CURRENT_PHOTOS = USER_PHOTOS;
    
    var miniatures = document.querySelectorAll('.pictures.container a');

		miniatures.forEach(function(item, index) {
			item.addEventListener('click', function() {
				showBigPicture(USER_PHOTOS, index);
			});
		});
  };
  
  /* Фильтр - "случайные" */
  var onFilterRandomClick = function() {
    var randomIds = new Set();
    while (randomIds.size < 10) {
      var id = window.utils.getRandomInteger(0, 24);
      randomIds.add(id);
    }

    var randomPhotos = [];
    for (var item of randomIds) {
      randomPhotos.push(USER_PHOTOS[item]);
    }
    
    var userPictures = document.querySelector('.pictures');
    while (userPictures.lastChild && userPictures.lastChild.nodeName === 'A') {
      userPictures.removeChild(userPictures.lastChild);
    }
    
    renderPictures(randomPhotos);
		CURRENT_PHOTOS = randomPhotos;
		
		var miniatures = document.querySelectorAll('.pictures.container a');

		miniatures.forEach(function(item, index) {
			item.addEventListener('click', function() {
				showBigPicture(randomPhotos, index);
			});
		});
  };
  
  /* Фильтр - "обсуждаемые" */
  var onFilterDiscussedClick = function() {
    
    var discussedPhotos = USER_PHOTOS.slice().sort(function(a, b) {
      if (b.comments.length > a.comments.length) return 1;
			else if (b.comments.length < a.comments.length) return -1;
			else return b.likes - a.likes;
    });
    
    var userPictures = document.querySelector('.pictures');
    while (userPictures.lastChild && userPictures.lastChild.nodeName === 'A') {
      userPictures.removeChild(userPictures.lastChild);
    }
    
    renderPictures(discussedPhotos);
		CURRENT_PHOTOS = discussedPhotos;
    
    var miniatures = document.querySelectorAll('.pictures.container a');
    
		miniatures.forEach(function(item, index) {
			item.addEventListener('click', function() {
				showBigPicture(discussedPhotos, index);
			});
		});
  };
  
  
	/* Обработчик успешной загрузки фоток пользователей */
	var successHandler = function(photos) {
		USER_PHOTOS = photos;
		CURRENT_PHOTOS = photos;
		renderPictures(photos);
		
		/* Показ большой фотки при клике по миниатюре */
		var miniatures = document.querySelectorAll('.pictures.container a');

		miniatures.forEach(function(item, index) {
			item.addEventListener('click', function() {
				showBigPicture(USER_PHOTOS, index);
			});
		});

    /* Применение фильтров */
    var filters = document.querySelector('.img-filters');
    var filterButtons = filters.querySelectorAll('button');
    filters.classList.remove('img-filters--inactive');
    
    var filterDefault = document.querySelector('#filter-default');
    var filterRandom = document.querySelector('#filter-random');
    var filterDiscussed = document.querySelector('#filter-discussed');
    
    filterDefault.addEventListener('click', function() {
      filterButtons.forEach(function(item) {
        item.classList.remove('img-filters__button--active');
      });
      filterDefault.classList.add('img-filters__button--active');
      onFilterDefaultClick();
    });
    filterRandom.addEventListener('click', function() {
      filterButtons.forEach(function(item) {
        item.classList.remove('img-filters__button--active');
      });
      filterRandom.classList.add('img-filters__button--active');
      onFilterRandomClick();
    });
    filterDiscussed.addEventListener('click', function() {
      filterButtons.forEach(function(item) {
        item.classList.remove('img-filters__button--active');
      });
      filterDiscussed.classList.add('img-filters__button--active');
      onFilterDiscussedClick();
    });
	};
	
	window.backend.load(successHandler, window.backend.errorHandler);

})();
