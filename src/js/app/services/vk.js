angular.module('vkTools',[])
  .service('S_vk', [
    '$q',
    '$http',
    'S_utils',
    '__vkAppId',
    function($q, $http, S_utils, __vkAppId) {
      var service = {};

      service.default = {
        version: '5.26',
        language: 'ru'
      };



      function listenerHandler(authenticationTabId, afterAuth) {
        "use strict";

        return function tabUpdateListener(tabId, changeInfo) {
          var vkAccessToken,
            vkAccessTokenExpiredFlag; 

          if (tabId === authenticationTabId && changeInfo.url !== undefined && changeInfo.status === "loading") {

            if (changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1) {
              authenticationTabId = null;
              chrome.tabs.onUpdated.removeListener(tabUpdateListener);

              vkAccessToken = S_utils.getUrlParameterValue(changeInfo.url, 'access_token');

              if (vkAccessToken === undefined || vkAccessToken.length === undefined) {
                displayeAnError('vk auth response problem', 'access_token length = 0 or vkAccessToken == undefined');
                return;
              }

              vkAccessTokenExpiredFlag = Number(S_utils.getUrlParameterValue(changeInfo.url, 'expires_in'));

              if (vkAccessTokenExpiredFlag !== 0) {
                displayeAnError('vk auth response problem', 'vkAccessTokenExpiredFlag != 0' + vkAccessToken);
                return;
              }
              service.setToken(vkAccessToken);
              chrome.storage.local.set({
                'vkaccess_token': vkAccessToken
              }, function() {
                afterAuth();
              });
            }
          }
        };
      }


      service.request = function(_method, _params, _response) {
        var path = '/method/' + _method + '?' + 'access_token=' + service.token;
        _params['v'] = _params['v'] || service.default.version;
        _params['lang'] = _params['lang'] || service.default.language;

        for (var key in _params) {
          if (key === "message") {
            path += ('&' + key + '=' + encodeURIComponent(_params[key]));
          } else {
            path += ('&' + key + '=' + _params[key]);
          }
        }
 
        $http.get('https://api.vk.com' + path, function(res) {
          if (typeof _response === 'function') {
            _response(res.data);
          }
        });
      };

      service.setToken = function(token) {
        service.token = token;
      };

      service.testRequest = function() {
        var defer = $q.defer();
        service.request('users.get', {}, function(resp) {
          if (resp.success) {
            defer.resolve();
          } else {
            defer.reject();
          }
        })
        return defer.promise;
      }

      service.callAuthPopup = function() {
        var defer = $q.defer();
        var vkAuthenticationUrl = 'https://oauth.vk.com/authorize?client_id=' + __vkAppId + '&scope=' + 'groups,photos,video,audio,wall,offline,email,docs,stats' + '&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';

        chrome.tabs.create({
          url: vkAuthenticationUrl,
          selected: true
        }, function(tab) {
          
          chrome.tabs.onUpdated.addListener(listenerHandler(tab.id, function() {
            defer.resolve(tab);
          }));
        });

        return defer.promise;
      }



      service.getToken = function() {
        return service.token;
      };
      return service;
    }
  ]);
