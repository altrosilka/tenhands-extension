angular.module('App')
  .directive('autoHeight', [function() {
    return {
      link: function($scope, $element, attrs) {

        var h = $(window).height() - 90;
        var min = 600;

        if (h < min) {
          h = min;
        }

        $element.height(h);
      }
    }
  }]);
