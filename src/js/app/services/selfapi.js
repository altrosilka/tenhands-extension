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
          url: base + __api.paths.saveExtensionVkToken,
          method: 'POST',
          data: {
            token: token
          }
        });
      }

      service.createPost = function(setId, postInfo, socket_channel, time) {
        return $http({
          url: base + __api.paths.createPost,
          method: 'POST',
          data: {
            setId: setId,
            postInfo: postInfo,
            socket_channel: socket_channel,
            time: time
          }
        });
      }

      service.getTable = function(from, to, set_ids, user_ids) {
        return $http({
          url: base + __api.paths.getTable,
          method: 'GET',
          withCredentials: true,
          params: {
            from: from,
            to: to,
            set_ids: set_ids,
            user_ids: user_ids
          }
        });
      }



      service.getShortUrl = function(url) {
        return $http({
          url: base + __api.paths.getShortUrl,
          method: 'POST',
          data: {
            url: url
          }
        });
      }

      service.getUserInfo = function() {
        return $http({
          url: base + __api.paths.getUserInfo,
          method: 'GET',
          withCredentials: true
        });
      }

      service.getAllSets = function() {
        return $http({
          url: base + __api.paths.sets,
          method: 'GET',
          withCredentials: true
        });
      }

      service.getSetInfo = function(setId) {
        return $http({
          url: base + __api.paths.getSetChannels,
          method: 'GET',
          withCredentials: true,
          params: {
            id: setId
          }
        });
      }

      service.signIn = function(email, password) {
        return $http({
          withCredentials: true,
          url: base + __api.paths.signIn,
          method: 'POST',
          data: {
            email: email,
            password: password
          }
        });
      }

      var _uploadStack = [];
      service.uploadImage = function(url, c, w, h, id) {
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

        _uploadStack.push({
          obj: obj,
          defer: defer
        });

        if (_uploadStack.length === 1) {
          uploadImageCall();
        }

        return defer.promise;
      }

      function uploadImageCall() {
        var q = _uploadStack[0];
        $http({
          url: base + __api.paths.media,
          method: 'POST',
          data: q.obj
        }).then(function(resp) {
          _uploadStack.shift();
          q.defer.resolve({
            media_id: resp.data.data.media_id,
            media_url: resp.data.data.media_url,
            id: q.obj.id
          });

          if (_uploadStack.length > 0) {
            uploadImageCall();
          }
        });
      }

      return service;
    }
  ]);
