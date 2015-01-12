angular.module('App').directive('instagramArea', [function() {
  return {
    scope:{
      attach: '=instagramArea'
    },
    templateUrl: 'templates/directives/instagramArea.html',
    controller: 'CD_instagramArea as ctr',
    link: function($scope, $element) {
      
    }
  }
}]);
