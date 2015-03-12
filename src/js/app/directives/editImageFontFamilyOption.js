angular.module('App').directive('editImageFontFamilyOption', [function() {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/fontFamilyOption.html',
    link: function($scope, $element) {

    },
    controllerAs: 'ctr',
    controller: function($scope) {
      var ctr = this;

      ctr.fontsCollection = [{
        "family": "PT Sans",
        "weight": 400
      }, {
        "family": "Poiret One",
        "weight": 400
      }, {
        "family": "Ubuntu",
        "weight": 400
      }, {
        "family": "Lobster",
        "weight": 400
      }, {
        "family": "Open Sans",
        "weight": 400
      }, {
        "family": "Roboto",
        "weight": 300
      }, {
        "family": "Open Sans Condensed",
        "weight": 400
      }, {
        "family": "Ledger",
        "weight": 400
      }, {
        "family": "Cuprum",
        "weight": 400
      }];

      ctr.onFontchange = function(font) {
        $scope.setValue('fontFamily', font.family);
        $scope.setValue('fontWeight', font.weight);
      }

      ctr.getFontStyle = function(font) {
        return {
          'font-family': font.family,
          'font-weight': font.weight
        }
      }

      ctr.getSelectPlaceholder = function(type) {
        return $scope.model;
      }
    }
  }
}]);
