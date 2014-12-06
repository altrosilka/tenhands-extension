angular.module('App').directive('autosizeTextarea', [function() {
  return {
    link: function($scope, $element) {
      $element.css({'transition':'0.2s'}).autosize();
    }
  }
}]);
  