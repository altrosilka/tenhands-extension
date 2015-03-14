angular.module('App').directive('numberBox', [function() {
  return {
    scope: {
      setValue: '=',
      model: '=',
      modelBind: '='
    },
    templateUrl: 'templates/directives/numberBox.html',
    link: function($scope, $element) {

    }, 
    controllerAs: 'ctr',
    controller: function($scope) {
      var ctr = this;
 
      ctr.value = $scope.model;

      $scope.$watch(function() {
        return ctr.value;
      }, function(q) {
        if (!q) return;
        $scope.setValue($scope.modelBind, q);
      });
    }
  }
}]);
  