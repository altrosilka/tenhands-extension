angular.module('chromeTools', [])
  .service('S_chrome', ['$q', 'S_eventer', function($q, S_eventer) {
    var service = {};

    service.pageDataWatch = function() {
 
      window.addEventListener('message', function(e) {
        S_eventer.sendEvent('loadedDataFromTab', e.data);
      });
    }

    service.showExtensionPopup = function(tab, info) {
      debugger 
      chrome.tabs.executeScript(tab.id, {
        file: "pack/pageEnviroment.js"
      });
    }

    service.openPreAuthPage = function() {
      chrome.tabs.create({
        url: '/pages/afterInstall.html',
        selected: true
      }, function(tab) {});
    }


    return service;
  }]);
