angular.module('App')
  .directive('mainHeroImage', ['$timeout', function($timeout) {
    return {
      scope: {
        hero: '='
      }, 
      link: function() {

      },
      controller: ['$scope', '$element', function($scope, $element) {
        var noHero = true;
        $scope.$watch('hero', function(hero) {
          $element.find('.layer').removeClass('active');

          if (!hero || !hero.src) {
            noHero = true;
            return;
          }
          noHero = false;

          var animationTime = 600;
          var image = new Image();
          image.src = hero.src;
          var time1 = new Date().getTime();
          image.onload = function() {
            var oldLayers = $element.find('.layer');
            var layer = $(document.createElement('div')).addClass('layer').addClass('hero-' + hero.short).css({
              "background-image": "url(" + this.src + ")"
            }).html('<div class="info"><div class="overlay"><h2 class="text">' + hero.name + '</h2><span class="role"><label>Роль:</label><i class="icon role-' + hero.role + '"></i><p>' + hero.roleTxt + '</p></span></div></div>').appendTo($element);

            var time2 = new Date().getTime();

            if (time2 - time1 < animationTime) {
              $timeout(function() {
                oldLayers.remove();
                if (noHero) return;
                layer.addClass('active');
              }, (animationTime - (time2 - time1)));
            } else {
              oldLayers.remove();
              if (noHero) return;
              layer.addClass('active');
            }
          };
        }, true);
      }]
    }
  }]);
