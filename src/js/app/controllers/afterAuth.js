angular.module('App').controller('C_afterAuth', ['$scope', 'S_vk', 'S_selfapi', 'S_chrome', function($scope, S_vk, S_selfapi, S_chrome) {
  var ctr = this;


  S_chrome.getVkToken().then(function(token) {
    if (token) {
      S_selfapi.sendExtensionToken(token);
    } else {
      //TODO: обработчик
    }
  })


  return ctr;
}]);
