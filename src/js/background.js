angular.module('mock', [])
  .service('S_eventer', [function() {}])
  .service('$modal', [function() {}])
  .service('__postMessagePrepend', [function() {}]);

var App = angular.module('App', [
  'config',
  'chromeTools',
  'utilsTools',
  'mock'
]);

App.run([
  'S_chrome',
  function(S_chrome) {


    chrome.contextMenus.create({
      "title": "Сохранить изображение в банк",
      "type": "normal",
      "contexts": ["image"],
      "onclick": saveImageToBankFromContext
    });
 
    chrome.contextMenus.create({
      "contexts": ["selection"],
      "title": "Офомить пост из выделенного текста '%s'",
      "onclick": openPostCreationFromContext
    });

    chrome.contextMenus.create({
      "contexts": ["image"],
      "title": "ОФормить пост из изображения",
      "onclick": openPostCreationFromContext
    });

    chrome.browserAction.onClicked.addListener(function(tab) {
      if (tab) {
        S_chrome.showExtensionPopup(tab);
      }
    });

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        console.log(sender.tab ?
          "from a content script:" + sender.tab.url :
          "from the extension");
        if (request.vk_auth) {
          service.callAuthPopup();
        }
      });


    function openPostCreationFromContext(info, tab) {
      S_chrome.showExtensionPopup(tab, info);
    }

    function onPostMessage(next) {
      var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
      var eventer = window[eventMethod];
      var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
      eventer(messageEvent, function(e) {
        var key = e.message ? "message" : "data";
        var data = e[key];

        next(e, data);
      }, false);
    }

    function saveImageToBankFromContext() {

    }

  }
]);
