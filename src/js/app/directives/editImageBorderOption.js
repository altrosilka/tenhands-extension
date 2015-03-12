angular.module('App').directive('editImageBorderOption', [function() {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/border.html',
    link: function($scope, $element) {

    },
    controllerAs: 'ctr',
    controller: function($scope) {
      var ctr = this;
    }
  }
}]);
