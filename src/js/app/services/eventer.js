angular.module('App')
  .service('S_eventer', [
    '$rootScope',
    '__postMessagePrepend',
    '__cabinet',
    function($rootScope, __postMessagePrepend, __cabinet) {
      var service = {};

      service.sendEvent = function(name, arguments) {
        $rootScope.$broadcast(name, arguments);
      }

      service.sayToFrame = function(code) {
        parent.postMessage(__postMessagePrepend + code, "*");
      }

      service.onPostMessage = function(next) {
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        eventer(messageEvent, function(e) {
          var key = e.message ? "message" : "data";
          var data = e[key];

          next(e, data);
        }, false);
      }

      return service;
    }
  ]);


