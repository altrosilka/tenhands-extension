angular.module('App').directive('jcropArea', ['$timeout', function($timeout) {
  return {
    scope: {
      image: '@',
      onCropReady: '='
    },
    templateUrl: 'templates/directives/jcropArea.html',
    controller: ['$scope', function($scope) {
      var ctr = this;

      var jCrop, image;

      ctr.disableActions = false;
      ctr.image = $scope.image;
      ctr.maxHeight = $(window).height() - 100;


      ctr.startCrop = function() {
        ctr.editType = 'crop';
        ctr.disableActions = true;

        image = $('#cropImage');


        image.Jcrop({
          setSelect: [0, 0, image.width(), image.height()]
        }, function() {
          jCrop = this;
        });


      }

      ctr.applyCrop = function() {
        var c = jCrop.tellSelect();
        var orW = image.width();
        var orH = image.height();
        if (c.x === 0 && c.y === 0 && c.x2 === orW && c.y2 === orH) {
          ctr.cancelCrop();
        } else {
          $scope.onCropReady(ctr.image, c, image.width(), image.height());
        }
      }

      ctr.cancelCrop = function() {
        ctr.editType = undefined;
        ctr.disableActions = false;
        jCrop.destroy();
        jCrop = undefined;
        $.fancybox.close();
      }

      $timeout(function() {

        ctr.startCrop();
      })

      return ctr;
    }],
    link: function($scope, $element) {

    },
    controllerAs: 'ctr'
  }


}]);
