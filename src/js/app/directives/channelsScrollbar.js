angular.module('App').directive('channelsScrollbar', [function() {
  return {
    link: function($scope, $element) {
      $element.mCustomScrollbar({
        axis: 'x',
        advanced: {
          autoExpandHorizontalScroll: true
        },
        scrollInertia: 0,
        mouseWheel: {
          enable:true,
          invert: (navigator.platform === "MacIntel")
        }
      });
    }
  }
}]);
