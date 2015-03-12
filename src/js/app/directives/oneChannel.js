angular.module('App').directive('oneChannel', [function() {
  return {
    scope:{
      channels: "=",
      pageData: "=",
      image: "=",
      postChannelAgain: "&"
    },
    templateUrl: 'templates/directives/oneChannel.html',
    controller: 'CD_oneChannel as ctr',
    link: function($scope, $element) { 
      
    }
  }
}]);
 