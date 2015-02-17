angular.module('App').directive('halfHeight', function($window) {
  return {
    link: function($scope, $element) {
      $window.addEventListener('resize',callHeight);

      callHeight();

      function callHeight(){
        $element.height($window.innerHeight/2);
      }
    }
  }
});
 