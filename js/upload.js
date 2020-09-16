'use strict';

(function() {
	
	/* Окно загрузки новой фотки */
	var uploadFileInput = document.querySelector('#upload-file');
	var uploadForm = document.querySelector('.img-upload__overlay');
	var closeButton = document.querySelector('#upload-cancel');
	
	var hashTagsInput = document.querySelector('input[name=hashtags]');
	var descriptionInput = document.querySelector('textarea[name=description]');

	var onUploadFormCloseButtonPress = function(evt) {
		if (evt.keyCode === window.utils.ESC_KEYCODE && evt.target !== hashTagsInput && evt.target !== descriptionInput) {
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
	var effectLevelInput = document.querySelector('.effect-level__value');
	var wholeSlider = document.querySelector('.effect-level');
	var pin = document.querySelector('.effect-level__pin');
	var levelDepth = document.querySelector('.effect-level__depth');

	effectInput.parentNode.parentNode.addEventListener('change', function(evt) {
		imagePreview.className = 'img-upload__preview';
		imagePreview.classList.add('effects__preview--' + evt.target.value);
		
		if (evt.target.value === 'none') {
			wholeSlider.classList.add('hidden');
		} else {
			wholeSlider.classList.remove('hidden');
		}
		
		imagePreview.style.filter = '';
		effectLevelInput.value = 100;
		pin.style.left = '450px';
		levelDepth.style.width = '450px';
	});


	/* Перемещение слайдера */
	wholeSlider.classList.add('hidden');
	pin.style.left = '450px';
	levelDepth.style.width = '450px';

	pin.addEventListener('mousedown', function(evt) {
		evt.preventDefault();
		
		var startCoords = {
			x: evt.clientX
		};
		
		var onMouseMove = function(moveEvt) {
			moveEvt.preventDefault();
      
			if (startCoords.x >= 400 && startCoords.x <= 850) {
				var shift = {
					x: startCoords.x - moveEvt.clientX,
				};
				
				startCoords = {
					x: moveEvt.clientX,
				};

				pin.style.left = (pin.offsetLeft - shift.x) + 'px';
				levelDepth.style.width = (moveEvt.clientX - 400) + 'px';
				
				effectLevelInput.value = Math.round(100 * parseInt(levelDepth.style.width) / 450);
				
				if (imagePreview.classList.contains('effects__preview--chrome')) {
					imagePreview.style.filter = 'grayscale(' + effectLevelInput.value / 100 + ')';
				} else if (imagePreview.classList.contains('effects__preview--sepia')) {
					imagePreview.style.filter = 'sepia(' + effectLevelInput.value / 100 + ')';
				} else if (imagePreview.classList.contains('effects__preview--marvin')) {
					imagePreview.style.filter = 'invert(' + effectLevelInput.value + '%)';
				} else if (imagePreview.classList.contains('effects__preview--phobos')) {
					imagePreview.style.filter = 'blur(' + effectLevelInput.value / 100 * 3 + 'px)';
				} else if (imagePreview.classList.contains('effects__preview--heat')) {
					imagePreview.style.filter = 'brightness(' + (1 + effectLevelInput.value / 100 * 2) + ')';
				}
			}
		};
		
		var onMouseUp = function(upEvt) {
			upEvt.preventDefault();
			
			if (startCoords.x < 400) {
				startCoords.x = 400;		
				pin.style.left = '0px';
				levelDepth.style.width = '0px';
			}
			
			if (startCoords.x > 850) {
				startCoords.x = 850;		
				pin.style.left = '450px';
				levelDepth.style.width = '450px';
			}
			
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		};
		
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	});


	/* Отправка данных на сервер */
	var form = document.querySelector('#upload-select-image');
	form.addEventListener('submit', function(evt) {
		evt.preventDefault();
		
		var successHandler = function(data) {
			closeUploadForm();	
			form.reset();
			
			scaleValueInput.value = '100%';
			imagePreview.style.transform = 'scale(1)';
			
			imagePreview.className = 'img-upload__preview';
			imagePreview.style.filter = '';
			
			effectLevelInput.value = 100;
			wholeSlider.classList.add('hidden');
			pin.style.left = '450px';
			levelDepth.style.width = '450px';
		};
		
		window.backend.send(new FormData(form), successHandler, window.backend.errorHandler);
	});

})();
