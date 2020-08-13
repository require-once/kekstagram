"use strict";

(function() {
	
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


	/* Генерация фоток пользователей */
	var generatePhotos = function() {
		var photos = [];
		
		for (var i = 1; i <= 25; i++) {
			var commentsCount = window.utils.getRandomInteger(1, 2);
			var commentList = [];
			
			commentList.push(USER_COMMENTS[window.utils.getRandomInteger(0, USER_COMMENTS.length - 1)]);
			if (commentsCount === 2) {
				commentList.push(USER_COMMENTS[window.utils.getRandomInteger(0, USER_COMMENTS.length - 1)]);
			}
			
			photos.push(
				{
					url: 'photos/' + i + '.jpg',
					likes: window.utils.getRandomInteger(15, 200),
					comments: commentList,
					description: DESCRIPTIONS[window.utils.getRandomInteger(0, DESCRIPTIONS.length - 1)],
				}
			);
		}
		return photos;
	};

	window.user_photos = generatePhotos();
	
})();
