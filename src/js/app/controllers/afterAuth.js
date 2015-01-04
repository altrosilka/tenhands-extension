angular.module('App').controller('C_afterAuth', ['$scope', 'S_vk', 'S_selfapi', 'S_chrome', function($scope, S_vk, S_selfapi, S_chrome) {
  var ctr = this;


  S_chrome.getVkToken().then(function(token) {
    if (token) {
      S_selfapi.sendExtensionToken(token).then(function(){
        ctr.canClose = true;
      });
    } else {
      location.href = '/pages/afterInstall.html';
    }
  })

  ctr.closeWindow = function(){
    window.close();
  }

  return ctr;
}]);
