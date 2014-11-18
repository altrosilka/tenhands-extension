angular.module('App')
  .directive('ybOpener', [function() {
    return {
      link: function($scope, $element, attrs) {
        $element.on('click', function() {
          $.fancybox({
            href: 'https://www.youtube.com/embed/' + attrs.ybOpener + '?autoplay=1&vq=hd720&rel=0&modestbranding=0&showinfo=0&egm=1',
            title: attrs.modalTitle || 'Title',
            type: 'iframe',
            overlayShow: true,
            padding: 0,
            openEffect: 'none',
            closeEffect: 'none',
            width: 720,
            height: 480,
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
