angular.module('App').directive('attachPoll', [function() {
  return {
    scope:{
      poll: '=attachPoll',
      destroy: '&'
    },
    templateUrl: 'templates/directives/attachPoll.html',
    controller: 'CD_attachPoll as ctr',
    link: function($scope, $element) {
      
    }
  }
}]);
