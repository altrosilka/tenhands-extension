angular.module('App')
  .service('S_selfapi', [
    '$http',
    '__api',
    function($http, __api) {
      var service = {};
      var base = __api.baseUrl;
      service.sendExtensionToken = function(token) {
        return $http({
          url: base + __api.paths.saveExtensionToken,
          method: 'POST',
          data: { 
            token: token
          }
        });
      }

      return service;
    }
  ]);
