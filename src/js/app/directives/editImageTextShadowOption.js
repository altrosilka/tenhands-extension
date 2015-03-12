angular.module('App').directive('editImageTextShadowOption', [function() {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/textShadowOption.html',
    link: function($scope, $element) {

    },
    controllerAs: 'ctr',
    controller: function($scope) {
      var ctr = this;
    }
  }
}]);
