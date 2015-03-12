angular.module('App').controller('CM_editImage',
  function($scope, S_selfapi, S_chrome, S_eventer, $modalInstance, image) {
    var ctr = this;

    ctr.image = image;


    ctr.options = image.options || {
      padding: 20,
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
      filter: 'none'
    };

    
    ctr.text = 'Десять причин завести себе своего орла';


    ctr.setValue = function(key, value) {

      ctr.options[key] = value;
    }


    ctr.saveImage = function() {
      S_eventer.sendEvent('saveImageRequest');
    }

    $scope.$on('imageDataRecieved', function(e, url) {
      $modalInstance.close({
        url: url,
        options: ctr.options
      });
    });

    return ctr;
  }
);
