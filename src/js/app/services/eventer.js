angular.module('App')
  .service('S_eventer', [
    '$rootScope',
    '__postMessagePrepend',
    function($rootScope, __postMessagePrepend) {
      var service = {};

      service.sendEvent = function(name, arguments) {
        $rootScope.$broadcast(name, arguments);
      }

      service.sayToFrame = function(code){
        parent.postMessage(__postMessagePrepend+code, "*");
      }
      
      return service;
    }
  ]);
