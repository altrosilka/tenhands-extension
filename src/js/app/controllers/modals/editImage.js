angular.module('App').controller('CM_editImage',
  function($scope, S_selfapi, S_chrome, S_eventer, $modalInstance, image) {
    var ctr = this;

    ctr.image = image;


    ctr.options = image.options || {
      textShadow: {
        width: 3,
        color: 'rgba(0,0,0,0.8)',
        x: 0,
        y: 1
      },
      color: '#fff',
      fontFamily: "Ubuntu",
      fontWeight: 300,
      fontSize: 32,
      valign: 'middle',
      filter: 'none',
      canvas: {
        fillColor: 'rgba(111,111,111,0.5)',
        padding: 20,
        border: {
          color: 'rgba(111,111,111,0.5)',
          width: 10
        },
        borderInner: {
          color: 'rgba(0,0,0,0.5)',
          width: 2
        }
      }
    };

    ctr.text = 'Ваш текст здесь';


    ctr.setValue = function(key, value) {
      var q = key.split('.');
      if (q.length === 2) {
        ctr.options[q[0]][q[1]] = value;
      } else {
        ctr.options[key] = value;
      }
    }


    ctr.saveImage = function() {
      S_eventer.sendEvent('saveImageRequest');
    }

    $scope.$on('imageDataRecieved', function(e, url) {
      console.log(url);
      $modalInstance.close({
        url: url,
        options: ctr.options
      });
    });



    return ctr;
  }
);
