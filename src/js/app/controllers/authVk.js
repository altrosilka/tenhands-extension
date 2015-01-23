angular.module('App').controller('C_authVk', [
  '$scope',
  '$location',
  'S_vk',
  function($scope, $location, S_vk) {
    var ctr = this;
    
    ctr.singIn = function() {
      var currentTab;

      chrome.tabs.getCurrent(function(tab) {
        currentTab = tab;

        S_vk.callAuthPopup().then(function(tab) {


          chrome.tabs.remove(tab.id, function() {});


          chrome.tabs.update(
            currentTab.id, {
              'url': '/pages/afterAuth.html',
              'active': true
            },
            function(tab) {}
          );
        })
      })

    }

    return ctr;
  }
]);
