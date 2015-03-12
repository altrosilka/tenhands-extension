angular.module('App').directive('channelLogo', [function() {
  return {
    scope:{
      channel: "=channelLogo"
    },
    templateUrl: 'templates/directives/channelLogo.html',
    controller: 'CD_channelLogo as ctr',
    link: function($scope, $element) { 
      
    }
  }
}]);
 