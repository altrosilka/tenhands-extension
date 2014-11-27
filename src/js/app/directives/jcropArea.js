angular.module('App').directive('jcropArea', ['$timeout',function($timeout) {
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
        }, function() {
          jCrop = this;
        });
      }

      ctr.applyCrop = function() {
        var c = jCrop.tellSelect();
        $scope.onCropReady(ctr.image, c, image.width(), image.height());
      }

      ctr.cancelCrop = function() {
        ctr.editType = undefined;
        ctr.disableActions = false;
        jCrop.destroy(); 
        jCrop = undefined;
      }


      return ctr;
    }],
    link: function($scope, $element) {
      
    },
    controllerAs: 'ctr'
  }


}]);
