'use strict';

(function() {
	
	/* Валидация хэш-тэгов и комментария */
	var hashTagsInput = document.querySelector('input[name=hashtags]');
	var descriptionInput = document.querySelector('textarea[name=description]');
	var uploadButton = document.querySelector('#upload-submit');

	var forbidFormSend = function(elem, errorText, evt) {
		evt.preventDefault();
		elem.setCustomValidity(errorText);
		elem.style.border = '2px solid red';
	};

	var allowFormSend = function(elem) {
		elem.setCustomValidity('');
		elem.style.border = '';
	};


	uploadButton.addEventListener('click', function(evt) {
		
		if (descriptionInput.value !== '') {
			if (descriptionInput.value.length > 140) {
				forbidFormSend(descriptionInput, 'Комментарий не длиннее 140 символов', evt)
			} else {
				allowFormSend(descriptionInput);
			}
		} else {
			allowFormSend(descriptionInput);
		}
		
		if (hashTagsInput.value !== '') {
			var hashTags = hashTagsInput.value.split(' ');
			var tagsArr = [];
			
			hashTags.forEach(function(item) {
				item = item.toLowerCase();
				
				if (item.substring(0, 1) !== '#') {
					forbidFormSend(hashTagsInput, 'Хэштэг должен начинаться с #', evt)
				} else if (item == '#') {
					forbidFormSend(hashTagsInput, 'Хэштэг не должен быть пустым', evt);
				} else if (item.length > 20) {
					forbidFormSend(hashTagsInput, 'Максимальная длина хэштэга - 20 символов', evt);
				}	else if (tagsArr.indexOf(item) !== -1) {
					forbidFormSend(hashTagsInput, 'Хэштэги не должны повторяться', evt);
				} else {
					tagsArr.push(item);
					
					if (tagsArr.length > 5) {
						forbidFormSend(hashTagsInput, 'Не более 5-ти хэштэгов', evt);
					} else {
						allowFormSend(hashTagsInput);
					}
				}
			});
		} else {
			allowFormSend(hashTagsInput);
		}
	});
	
})();

