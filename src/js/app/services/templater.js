angular.module('App')
  .service('S_templater',

    function(localStorageService, S_eventer) {
      var service = {};

      var templateKeyName = 'template';
      var defaultTemplate = '{{title}}\n\n{{url}}';

      service.getTemplate = function() {

        var q = localStorageService.get(templateKeyName);

        if (q) {
          return q.text;
        } else {
          return defaultTemplate;
        }
      }

      service.setTemplate = function(tpl) {

        localStorageService.set(templateKeyName, {text: tpl});
        S_eventer.sendEvent('trigger:templateChanged');
      }

      return service;
    }
  );
