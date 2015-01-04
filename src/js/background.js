angular.module('mock', [])
  .service('S_eventer', [function() {}])
  .service('$modal', [function() {}])
  .service('__postMessagePrepend', [function() {}]);

var App = angular.module('App', [
  'config',
  'vkTools',
  'chromeTools',
  'utilsTools',
  'mock'
]);

App.run([
  '__vkAppId',
  'S_chrome',
  'S_vk',
  function(__vkAppId, S_chrome, S_vk) {


    S_chrome.getVkToken().then(function(token) {

      S_vk.setToken(token);


    }, function() {
      //S_vk.callAuthPopup().then(function() {
      //  location.reload();
      //});
    })


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
        S_chrome.getVkToken().then(function(token) {
          S_chrome.showExtensionPopup(tab);
        }, function() {
          S_chrome.openPreAuthPage();
        });

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
      debugger
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
