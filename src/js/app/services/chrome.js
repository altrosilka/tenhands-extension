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
