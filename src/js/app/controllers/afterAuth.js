angular.module('App').controller('C_afterAuth', [
  '$scope',
  'S_vk',
  'S_selfapi',
  'S_chrome',
  'S_eventer',
  function($scope, S_vk, S_selfapi, S_chrome, S_eventer) {
    var ctr = this;


    S_chrome.getVkToken().then(function(token) {
      if (token) {
        S_selfapi.sendExtensionToken(token).then(function(resp) {
          ctr.canClose = true;
          ctr.accountName = resp.data.data.screen_name;
        });
      } else {
        location.href = '/pages/afterInstall.html';
      }
    })



    ctr.closeWindow = function() {
      window.close();
    }

    return ctr;
  }
]);
