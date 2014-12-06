angular.module('App')
  .service('S_selfapi', [
    '$http',
    '$q',
    '__api',
    function($http, $q, __api) {
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

      service.sendPost = function(owner_id, message, attachments, publish_date, signed) {
        return $http({
          url: base + __api.paths.sendPost,
          method: 'POST',
          data: {
            owner_id: owner_id,
            message: message,
            attachments: attachments,
            publish_date: publish_date,
            signed: signed
          }
        });
      }

      service.getAssignKey = function(token) {
        return $http({
          url: base + __api.paths.getAssignKey,
          method: 'GET'
        });
      }

      service.getPostsInPeriod = function(groupId, from, to) {
        return $http({
          url: base + __api.paths.getPostsInPeriod,
          method: 'GET',
          params: {
            groupId: groupId,
            from: from,
            to: to
          }
        });
      }

      service.getOverrideKey = function(groupId) {
        return $http({
          url: base + __api.paths.getOverrideKey,
          method: 'GET',
          params: {
            groupId: groupId
          }
        });
      }

      var _uploadImageToVkStack = [];
      service.uploadImageToVk = function(url, c, w, h, id) {
        var defer = $q.defer();

        var obj = {
          url: url,
          id: id
        };

        if (c) {
          _.extend(obj, c);
          obj.originalWidth = w;
          obj.originalHeight = h;
        }

        _uploadImageToVkStack.push({
          obj: obj,
          defer: defer
        });

        if (_uploadImageToVkStack.length === 1) {
          uploadImageToVkCall();
        }

        return defer.promise;
      }

      function uploadImageToVkCall() {
        var q = _uploadImageToVkStack[0];
        $http({
          url: base + __api.paths.uploadPhoto,
          method: 'POST',
          data: q.obj
        }).then(function(resp) {
          _uploadImageToVkStack.shift();
          q.defer.resolve({
            photo: resp.data.response[0],
            id: q.obj.id
          });

          if (_uploadImageToVkStack.length > 0) {
            uploadImageToVkCall();
          }
        });
      }

      return service;
    }
  ]);
