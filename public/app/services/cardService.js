angular.module('cardService', [])
  .factory('Card', function($http) {
    var cardFactory = {};

    cardFactory.getSetList = function(){
        return $http.get('/api/setlist')
    }

    cardFactory.getSetCards = function(set_name){
        return $http.get('/api/setcards/' + set_name)
    }

    cardFactory.downloadCardInfo = function(setcode, card_info){
      return $http.post('/api/downloadCardInfo/', {"setcode": setcode, "card" : card_info}); 
    }
    return cardFactory;
  })