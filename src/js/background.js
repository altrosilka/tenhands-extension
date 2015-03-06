/*chrome.contextMenus.create({
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
});*/

chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab) {
    showExtensionPopup(tab);
  } 
});

function openPostCreationFromContext(info, tab) {
  showExtensionPopup(tab, info);
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

function showExtensionPopup(tab, info) {
  chrome.tabs.executeScript(tab.id, {
    file: "pack/pageEnviroment.js"
  });
}
