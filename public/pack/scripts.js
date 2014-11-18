var App = angular.module('App', [
  'config',
  'vkTools',
  'chromeTools',
  'utilsTools',
  'ui.bootstrap',
  'templates'
]); 
  
App.config([
  '$httpProvider',
  function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf8';
  }
]);
  
angular.module('config',[])
  .constant('__vkAppId', 4639658)
App.run([
  '__vkAppId',
  'S_chrome',
  'S_vk',
  function(__vkAppId, S_chrome, S_vk) {
    S_chrome.pageDataWatch();

    S_chrome.getVkToken().then(function(token) {

      S_vk.setToken(token);
      S_vk.testRequest(function() {
        console.log(1);
      }, function() {
        console.log(2);

      })
    }, function() {


      chrome.runtime.sendMessage({
        vk_auth: true
      }, function(response) {
        console.log(response.farewell);
      });

      
    })


  }
]);

angular.module('App').controller('C_main', ['$scope', function($scope) {
  var ctr = this;

  $scope.$on('loadedDataFromTab', function(event, data) {
    $scope.$apply(function() {

      ctr.data = data;
      ctr.dataIsLoaded = true;
    });

  });

  return ctr;
}]);

angular.module('App').filter('lastfmDateToLocal', ['localization',function(localization) {
  return function(date) {
    if (!date) {
      return;
    } 

    var parsed = moment(date,'DD MMM YYYY HH:mm'); 

    return parsed.format('DD') + ' ' + localization.months[parsed.month()] + ' ' + parsed.format('YYYY');
  }
}]);

angular.module('chromeTools', [])
  .service('S_chrome', ['$q', 'S_eventer', function($q, S_eventer) {
    var service = {};

    service.pageDataWatch = function() {

      window.addEventListener('message', function(e) {

        S_eventer.sendEvent('loadedDataFromTab', e.data);
      });


      setTimeout(function() {
        S_eventer.sendEvent('loadedDataFromTab', {
          "images": [{
            "alt": "Грелка ",
            "clientHeight": 450,
            "clientWidth": 600,
            "width": 600,
            "height": 450,
            "title": "Грелка ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/grelka-_1416265291.jpg"
          }, {
            "alt": "Любовь - великая сила ",
            "clientHeight": 571,
            "clientWidth": 600,
            "width": 600,
            "height": 571,
            "title": "Любовь - великая сила ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/lyubov-velikaya-sila-_1416314178.jpg"
          }, {
            "alt": "Скоро праздники ",
            "clientHeight": 600,
            "clientWidth": 600,
            "width": 600,
            "height": 600,
            "title": "Скоро праздники ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/skoro-prazdniki-_1416214236.jpg"
          }, {
            "alt": "Фигулька ",
            "clientHeight": 778,
            "clientWidth": 600,
            "width": 600,
            "height": 778,
            "title": "Фигулька ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/figulka-_1415910890.jpg"
          }, {
            "alt": "Коварная чугунная поня ",
            "clientHeight": 449,
            "clientWidth": 600,
            "width": 600,
            "height": 449,
            "title": "Коварная чугунная поня ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/kovarnaya-chugunnaya-ponya-_1416233562.jpg"
          }, {
            "alt": "Таблетки для смеха",
            "clientHeight": 488,
            "clientWidth": 600,
            "width": 600,
            "height": 488,
            "title": "Таблетки для смеха",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/tabletki-dlya-smeha-_1415531344.jpg"
          }, {
            "alt": "Разбуженный грабитель ",
            "clientHeight": 399,
            "clientWidth": 600,
            "width": 600,
            "height": 399,
            "title": "Разбуженный грабитель ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/razbuzhennyy-grabitel-_1416233761.jpg"
          }, {
            "alt": "Нам бы карася  ",
            "clientHeight": 429,
            "clientWidth": 600,
            "width": 600,
            "height": 429,
            "title": "Нам бы карася  ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/nam-by-karasya-_1416233413.jpg"
          }, {
            "alt": "Нычкарик по призванию ",
            "clientHeight": 450,
            "clientWidth": 600,
            "width": 600,
            "height": 450,
            "title": "Нычкарик по призванию ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/nychkarik-po-prizvaniyu-_1416232762.jpg"
          }, {
            "alt": "Еда с гавкающим названием ",
            "clientHeight": 800,
            "clientWidth": 600,
            "width": 600,
            "height": 800,
            "title": "Еда с гавкающим названием ",
            "src": "http://lolkot.ru/wp-content/uploads/2014/11/yeda-s-gavkayuschim-nazvaniyem-_1416203979.jpg"
          }, {
            "alt": "",
            "clientHeight": 250,
            "clientWidth": 250,
            "width": 250,
            "height": 250,
            "title": "",
            "src": "http://static.lolkot.ru/images/usermatrix1416326402.jpg"
          }, {
            "alt": "",
            "clientHeight": 15,
            "clientWidth": 88,
            "width": 88,
            "height": 15,
            "title": "",
            "src": "http://counter.yadro.ru/hit?t26.16;rhttp%3A//yandex.ru/clck/jsredir%3Ffrom%…c%3D2.584962500721156;s1280*800*24;uhttp%3A//lolkot.ru/;0.5310913703870028"
          }],
          "title": "Смешные картинки кошек с надписями",
          "url": "http://lolkot.ru/",
          "imageSrc": "http://0.gravatar.com/avatar/d2e9e4a8e24a1daf5d3985172ee47078?s=210"
        })
      }, 1000);
    }


    service.getVkToken = function() {
      var defer = $q.defer();
      chrome.storage.local.get({
        'vkaccess_token': {}
      }, function(items) {

        if (items.vkaccess_token.length !== undefined) {
          defer.resolve(items.vkaccess_token);
          return;
        } else {
          defer.reject();
        }
      });
      return defer.promise;
    }


    service.showExtensionPopup = function(tab) {
      var code = [
        'var d = document.createElement("div");',
        'd.setAttribute("style", "background-color: rgba(0,0,0,0.5); width: 100%; height: 100%; position: fixed; top: 0px; left: 0px; z-index: 99999899999898988899;");',
        'var iframe = document.createElement("iframe");',
        'iframe.src = chrome.extension.getURL("pages/createPost.html");',
        'iframe.setAttribute("style", "width:100%;height:100%;");',
        'iframe.setAttribute("id", "smm-transport-ekniERgebe39EWee");',
        'iframe.setAttribute("frameborder", "0");',
        'd.appendChild(iframe);',
        'document.body.appendChild(d);'
      ].join("\n");

      /* Inject the code into the current tab */
      chrome.tabs.executeScript(tab.id, {
        code: code
      });

      chrome.tabs.executeScript(tab.id, {
        file: "pack/pageParser.js"
      });
    }


    return service;
  }]);

angular.module('App')
  .service('S_eventer', [
    '$rootScope',
    function($rootScope) {
      var service = {};

      service.sendEvent = function(name, arguments) {
        $rootScope.$broadcast(name, arguments);
      }
      
      return service;
    }
  ]);

angular.module('utilsTools',[])
  .service('S_utils', [function() {
    var service = {};

    service.getUrlParameterValue = function(url, parameterName) {
      "use strict";

      var urlParameters = url.substr(url.indexOf("#") + 1),
        parameterValue = "",
        index,
        temp;

      urlParameters = urlParameters.split("&");

      for (index = 0; index < urlParameters.length; index += 1) {
        temp = urlParameters[index].split("=");

        if (temp[0] === parameterName) {
          return temp[1];
        }
      }

      return parameterValue;
    }

    return service;
  }]);

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
            defer.resolve();
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

var VKS = function(_options) {
  var self = this;

  self.options = _options || {};

  self.default = {
    version: '5.26',
    language: 'ru'
  };

  self.request = function(_method, _params, _response) {
    var path = '/method/' + _method + '?' + 'access_token=' + self.token;
    _params['v'] = _params['v'] || self.options.version || self.default.version;
    _params['lang'] = _params['lang'] || self.options.language || self.default.language;

    for (var key in _params) {
      if (key === "message") {
        path += ('&' + key + '=' + encodeURIComponent(_params[key]));
      } else {
        path += ('&' + key + '=' + _params[key]);
      }
    }

    $.get('https://api.vk.com' + path, function(res) {
      if (typeof _response === 'function') {
        _response(res);
      }
    });
  };

  self.setToken = function(_param) {
    self.token = _param.token;
  };

  self.getToken = function() {
    return self.token;
  };
};
