angular.module('App')
  .directive('preloadingIntro', ['$timeout', function($timeout) {
    return {
      scope: {
        src: '='
      },
      link: function($scope, $element, attrs) {
        var src = $scope.src;

        var allImages = 1;
        var loadedImages = 0;

        var func = function(src) {
          var image = new Image;
          image.src = src;
          image.onload = function() {
            loadedImages++;
            if (loadedImages === allImages) {
              $element.addClass('loaded');
              $timeout(function() {
                $element.find('.fullSizeIntro').remove();

                $element.find('.hero').each(function(i) {
                  var elem = $(this);

                  $timeout(function() {
                    elem.addClass('fake');
                  }, i * 100);

                  $timeout(function() {
                    elem.removeClass('fake');
                  }, i * 100 + 120);
                });
              }, 3550);
            }
          }
        };

        if (src.length && typeof src === 'object') {
          allImages = src.length;
          angular.forEach(src, function(image) {
            func(image);
          });
        } else {
          func(src);
        }
      }
    }
  }]);
