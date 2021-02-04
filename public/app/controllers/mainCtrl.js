
angular.module('mainCtrl', [])
.controller('mainController', function($rootScope, $location, Card) {
	var vm = this;

	vm.setList = [];
	vm.setCards = [];
	vm.selectedSet = {};

	vm.cardImageSize = 170;

	vm.cardImageSizeSliderOptions = {
		floor: 80,
		ceil: 300,
		step: 5,
		showTicks: false,
		translate: function(value) {
			return value + 'px';
		}
	}
	
	Card.getSetList().then(function(ret){
		vm.setList = ret.data.response;
	});

	vm.loadSetCards = function(set_code, set_name){
		vm.selectedSet = { "name" : set_name, "code": set_code }
		vm.setCards = [];
		Card.getSetCards(set_name).then(function(ret){
			vm.setCards = ret.data.response.data;
		});
	}

	// TO DO: Lazy Load these images
	vm.loadCardImage = function(cardId, size){
		var url = "https://storage.googleapis.com/ygoprodeck.com/"
		if (size == 0){
			url += "pics_small/"
		} else {
			url += "pics/"
		}
		return url + cardId + ".jpg"
	}

	vm.getCurrentCardInfo = function(setcode, card_info){
		Card.downloadCardInfo(setcode, card_info);
	}
});
