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

var getRandomInteger = function(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};


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


var showBigPicture = function() {
	document.querySelector('.big-picture').classList.remove('hidden');
	document.querySelector('.big-picture__img img').src = user_photos[0].url;
	document.querySelector('.big-picture__img img').alt = user_photos[0].description;
	document.querySelector('.likes-count').textContent = user_photos[0].likes;
	document.querySelector('.comments-count').textContent = user_photos[0].comments.length;
	document.querySelector('.social__comment .social__picture').src = 'img/avatar-' + getRandomInteger(1, 6) + '.svg';
	document.querySelector('.social__caption').textContent = user_photos[0].description;
	
	var socialComment = document.querySelector('.social__comments');
	var commentsTexts = document.querySelectorAll('.social__comment .social__text');
	
	if (user_photos[0].comments.length === 1) {
		commentsTexts[0].textContent = user_photos[0].comments[0];
		socialComment.removeChild(socialComment.children[1]);
	} else if (user_photos[0].comments.length === 2) {
		commentsTexts[0].textContent = user_photos[0].comments[0];
		commentsTexts[1].textContent = user_photos[0].comments[1];
	}
};

showBigPicture();


document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.social__comments-loader').classList.add('visually-hidden');


//console.dir(USER_PHOTOS[0]);
