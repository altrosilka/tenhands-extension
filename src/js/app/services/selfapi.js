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

      service.uploadImageToVk = function(url, c, w, h, id) {
        var obj = {
          url: url,
          id: id
        };

        if (c) {
          _.extend(obj, c);
          obj.originalWidth = w;
          obj.originalHeight = h;
        }
        return $http({
          url: base + __api.paths.uploadPhoto,
          method: 'POST',
          data: obj
        });
      }

      return service;
    }
  ]);
