angular.module('App').directive('editImageFontSizeOption', [function() {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/fontSizeOption.html',
    link: function($scope, $element) {

    },
    controllerAs: 'ctr',
    controller: function($scope) {
      var ctr = this;

      ctr.fontsCollection = [{
          "size": 10
        }, { 
          "size": 14
        }, {
          "size": 18
        }, {
          "size": 24
        }, {
          "size": 32
        }, {
          "size": 48
        }, {
          "size": 60
        }, {
          "size": 72
        }, {
          "size": 90
        }, {
          "size": 100
        }, {
          "size": 112
        }, {
          "size": 132
        }, {
          "size": 160
        }, {
          "size": 200
        }, {
          "size": 240
        }
      ];

      ctr.onFontchange = function(font) {
        $scope.setValue('fontSize', font.size);
      }

      ctr.getSelectPlaceholder = function(type) {
        return $scope.model;
      }
    }
  }
}]);
