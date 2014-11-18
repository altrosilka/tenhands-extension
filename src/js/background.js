angular.module('mock', []).service('S_eventer', [function() {}]);


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
      "contexts": ["image", "page"],
      "onclick": saveImageToBankFromContext
    });

    chrome.contextMenus.create({
      "title": "Оформить пост из этого",
      "contexts": ["selection", "image"],
      "onclick": openPostCreationFromContext
    });

    chrome.browserAction.onClicked.addListener(function(tab) {
      if (tab) {
        S_chrome.showExtensionPopup(tab);
      }
    });

    console.log('init back');

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



    function saveImageToBankFromContext(info, tab) {

      var fileName = 'heelo';
      var imageUrl = info.srcUrl;
      

      var accToken = S_vk.getToken();


      var uploadHttpRequest = new XMLHttpRequest();

      uploadHttpRequest.onload = function() {

        var documentUploadServer = new XMLHttpRequest(),
          requestFormData,
          documentUploadRequest;

        documentUploadServer.open('GET', 'https://api.vk.com/method/docs.getUploadServer?access_token=' + accToken);

        documentUploadServer.onload = function() {

          var answer = JSON.parse(documentUploadServer.response);

          if (answer.error !== undefined) {
            chrome.storage.local.remove('vkaccess_token');

            document.getElementById('wrap').innerHTML = '<p></p><br/><br/><center><h1>Ops. Something went wrong. Please try again.</h1></center><br/>';
            setTimeout(function() {
              window.close();
            }, 3000);

            return;
          }

          if (answer.response.upload_url === undefined) {
            thereIsAnError('documentUploadServer response problem', answer, imageUrl);

            return;
          }

          requestFormData = new FormData();
          documentUploadRequest = new XMLHttpRequest();

          requestFormData.append("file", uploadHttpRequest.response, fileName);

          documentUploadRequest.open('POST', answer.response.upload_url, true);

          documentUploadRequest.onload = function() {

            var answer = JSON.parse(documentUploadRequest.response),
              documentSaveRequest;

            if (answer.file === undefined) {
              thereIsAnError('Upload blob problem response problem', answer, imageUrl);

              return;
            }

            documentSaveRequest = new XMLHttpRequest();

            documentSaveRequest.open('GET', 'https://api.vk.com/method/docs.save?file=' + answer.file + '&access_token=' + accToken);

            documentSaveRequest.onload = function() {

              var answer = JSON.parse(documentSaveRequest.response);

              if (answer.response[0].url === undefined) {
                thereIsAnError('documentSaveRequest - no file in response', answer, imageUrl);

                return;
              }

              document.getElementById('wrap').innerHTML = '<p></p><br/><br/><center><h1>Successfully uploaded!</h1></center><br/>';
              setTimeout(function() {
                window.close();
              }, 3000);
            };

            documentSaveRequest.send();
          };

          documentUploadRequest.send(requestFormData);
        };

        documentUploadServer.send();
      };

      uploadHttpRequest.responseType = 'blob';
      uploadHttpRequest.open('GET', imageUrl);
      uploadHttpRequest.send();


    }
  }
]);
