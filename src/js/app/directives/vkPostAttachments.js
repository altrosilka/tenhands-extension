angular.module('App').directive('vkPostAttachments', ['S_utils', function(S_utils) {
  return {
    scope:{
      attachments: '=vkPostAttachments',
      first: '=',
      own: '='
    },
    templateUrl: 'templates/directives/vkPostAttachments.html',
    link: function($scope, $element) {
      if ($scope.first === true && $scope.attachments && $scope.attachments.length){
        $scope.attach = S_utils.findFirstAttach($scope.attachments, $scope.own);
      }
    }
  }
}]);
 