angular.module('App').directive('editImageValignOption', [function() {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/valign.html',
    link: function($scope, $element) {

    },
    controllerAs: 'ctr',
    controller: function($scope) {
      var ctr = this;

      ctr.collection = [{
          "type": "top",
          "text":"Сверху"
        }, {
          "type": "middle",
          "text":"По центру"
        },{
          "type": "bottom", 
          "text":"Снизу"
        }
      ];

      ctr.onFontchange = function(point) {
        $scope.setValue('valign', point.type);
      }

      ctr.getSelectPlaceholder = function(type) {
        return _.find(ctr.collection, function(q){
          return $scope.model === q.type;
        }).text;
      }
    }
  }
}]);
