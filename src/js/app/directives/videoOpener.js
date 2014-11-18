angular.module('App')
  .directive('videoOpener', [function() {
    return {
      link: function($scope, $element, attrs) {
        $element.on('click', function() {
          $.fancybox({
            content: '<video width="960" height="520" class="masked" controls="controls" loop="loop" autoplay="autoplay" poster="' + attrs.poster + '"><source type="video/webm" src="' + attrs.webmSrc + '" /><source type="video/mp4" src="' + attrs.mp4Src + '" /></video>',
            title: attrs.modalTitle || 'Title',
            type: 'html',
            overlayShow: true,
            padding: 0,
            openEffect: 'none',
            closeEffect: 'none',
            width: 960,
            height: 520,
            helpers: {
              overlay: {
                locked: false
              }
            }
          });
        });

      }
    }
  }]);
