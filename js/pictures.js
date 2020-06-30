'use strict';

var USER_COMMENTS = [
	'Всё отлично!',
	'В целом всё неплохо. Но не всё.',
	'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
	'Моя бабушка случайно чихнула с фотоаппаратом в руках и унеё получилась фотография лучше.',
	'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и уменя получилась фотография лучше.',
	'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

var DESCRIPTIONS = [
	'Тестим новую камеру!',
	'Затусили с друзьям и на море',
	'Какже круто тут кормят',
	'Отдыхаем...',
	'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами...',
	'Вот это тачка!',
];

var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;

var getRandomInteger = function(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};


/* Генерация фоток пользователей */
var generetePhotos = function() {
	var photos = [];
	
	for (var i = 1; i <= 25; i++) {
		var commentsCount = getRandomInteger(1, 2);
		var commentList = [];
		
		commentList.push(USER_COMMENTS[getRandomInteger(0, USER_COMMENTS.length - 1)]);
		if (commentsCount === 2) {
			commentList.push(USER_COMMENTS[getRandomInteger(0, USER_COMMENTS.length - 1)]);
		}
		
		photos.push(
			{
				url: 'photos/' + i + '.jpg',
				likes: getRandomInteger(15, 200),
				comments: commentList,
				description: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)],
			}
		);
	}
	return photos;
};

var user_photos = generetePhotos();


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

renderPictures(user_photos);


/* Обработчики закрытия большой фотки */
var onBigPictureCloseButtonPress = function(evt) {
	if (evt.keyCode === ESC_KEYCODE) {
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
	document.querySelector('.big-picture__img img').src = user_photos[index].url;
	document.querySelector('.big-picture__img img').alt = user_photos[index].description;
	document.querySelector('.likes-count').textContent = user_photos[index].likes;
	document.querySelector('.comments-count').textContent = user_photos[index].comments.length;
	document.querySelector('.social__comment .social__picture').src = 'img/avatar-' + getRandomInteger(1, 6) + '.svg';
	document.querySelector('.social__caption').textContent = user_photos[index].description;
	
	var socialComment = document.querySelector('.social__comments');
	var commentsTexts = document.querySelectorAll('.social__comment .social__text');
	
	if (user_photos[index].comments.length === 1) {
		commentsTexts[0].textContent = user_photos[index].comments[0];
		socialComment.children[1].classList.add('hidden');
	} else if (user_photos[index].comments.length === 2) {
		socialComment.children[1].classList.remove('hidden');
		commentsTexts[0].textContent = user_photos[index].comments[0];
		commentsTexts[1].textContent = user_photos[index].comments[1];
	}
	
	document.querySelector('.big-picture #picture-cancel').addEventListener('click', closeBigPicture);
	document.addEventListener('keydown', onBigPictureCloseButtonPress);
};


document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.social__comments-loader').classList.add('visually-hidden');


/* Загрузка новой фотки */
var uploadFileInput = document.querySelector('#upload-file');
var uploadForm = document.querySelector('.img-upload__overlay');
var closeButton = document.querySelector('#upload-cancel');

var onUploadFormCloseButtonPress = function(evt) {
	if (evt.keyCode === ESC_KEYCODE) {
		closeUploadForm();
	}
};

var closeUploadForm = function() {
	uploadForm.classList.add('hidden');
	document.removeEventListener('keydown', onUploadFormCloseButtonPress);
};


uploadFileInput.addEventListener('change', function() {
	uploadForm.classList.remove('hidden');
	document.addEventListener('keydown', onUploadFormCloseButtonPress);
});

closeButton.addEventListener('click', function() {
	closeUploadForm();
}); 
 

/* Изменение масштаба */
var scaleSmallerButton = document.querySelector('.img-upload__overlay .scale__control--smaller');
var scaleBiggerButton = document.querySelector('.img-upload__overlay .scale__control--bigger');
var scaleValueInput = document.querySelector('.img-upload__overlay .scale__control--value');
var imagePreview = document.querySelector('.img-upload__overlay .img-upload__preview');

scaleBiggerButton.addEventListener('click', function() {
	var resizeValue = parseInt(scaleValueInput.value);
	
	if (resizeValue < 100) {
		scaleValueInput.value = resizeValue + 25 + '%';
		imagePreview.style.transform = 'scale(' + (resizeValue + 25) / 100 + ')';
	}
});

scaleSmallerButton.addEventListener('click', function() {
	var resizeValue = parseInt(scaleValueInput.value);
	
	if (resizeValue > 25) {
		scaleValueInput.value = resizeValue - 25 + '%';
		imagePreview.style.transform = 'scale(' + (resizeValue - 25) / 100 + ')';
	}
});


/* Применение фильтров для загружаемой фотки */
var effectInput = document.querySelector('.img-upload__overlay input[name=effect]');

effectInput.parentNode.parentNode.addEventListener('change', function(evt) {
	imagePreview.className = 'img-upload__preview';
	imagePreview.classList.add('effects__preview--' + evt.target.value);
});


/* Показ большой фотки по клику по миниатюре */
var miniatures = document.querySelectorAll('.pictures.container a');

miniatures.forEach(function(currentItem, index) {
	currentItem.addEventListener('click', function() {
		showBigPicture(index);
	});
});


