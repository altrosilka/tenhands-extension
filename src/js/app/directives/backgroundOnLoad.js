angular.module('App')
  .directive('backgroundOnLoad', [function() {
    return {
      link: {
        pre: function($scope, $element, attrs) {
          var src = attrs.backgroundOnLoad;

          if ($element.css('position') === 'static') {
            $element.addClass('relative');
          }
          $element.children().addClass('up');

          var layer = $(document.createElement('div')).addClass('backgroundOnLoadLayer').css({
            "background-image": "url(" + src + ")"
          }).appendTo($element)

          var image = new Image();
          image.src = src;
          image.onload = function() {
            layer.addClass('active');
          }
        }
      }
    }
  }]);
