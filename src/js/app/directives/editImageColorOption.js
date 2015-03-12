angular.module('App').directive('editImageColorOption', [function() {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/colorOption.html',
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
        $scope.setValue('color', q);
      });
    }
  }
}]);
