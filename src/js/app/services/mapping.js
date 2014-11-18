angular.module('App')
  .service('S_mapping', [function() {
    var service = {};
    
    service.getHumanRole = function(id){
    	var mapping = {'tank':'танк','offense':'штурм','defense':'защита','support':'поддержка'};
      return ((mapping[id]) ? mapping[id] : undefined);
    }

    return service;
  }]);
