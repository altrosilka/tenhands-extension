angular.module('App').directive('popoverHtmlUnsafePopup', function() {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        content: '@',
        placement: '@',
        animation: '&',
        isOpen: '='
      },
      templateUrl: 'templates/directives/popoverHtmlUnsafePopup.html'
    };
  })
  .directive('popoverHtmlUnsafe', ['$tooltip',
    function($tooltip) {
      return $tooltip('popoverHtmlUnsafe', 'popover', 'click');
    }
  ])
 