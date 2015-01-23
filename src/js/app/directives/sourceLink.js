angular.module('App').directive('sourceLink', [function() {
  return {
    scope:{
      link: '=sourceLink'
    },
    templateUrl: 'templates/directives/sourceLink.html',
    controller: 'CD_sourceLink as ctr',
    link: function($scope, $element) {
      
    }  
  }
}]);
