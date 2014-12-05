angular.module('App').directive('vkPostAttachments', ['S_utils', function(S_utils) {
  return {
    scope:{
      attachments: '=vkPostAttachments',
      first: '='
    },
    templateUrl: 'templates/directives/vkPostAttachments.html',
    link: function($scope, $element) {
      if ($scope.first === true){
        $scope.attach = S_utils.findFirstAttach($scope.attachments);
      }
    }
  }
}]);
 