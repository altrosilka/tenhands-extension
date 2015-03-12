angular.module('App')
  .service('S_transport',
    function($rootScope, S_eventer) {
      var service = {};

      var dataFromTab; 

      $rootScope.$on('loadedDataFromTab', function(event, data) {
        dataFromTab = data;
        service.emitData();
      });

      service.emitData = function(){
        S_eventer.sendEvent('loadedDataFromArea', dataFromTab);
      }

      return service; 
    }
  );
