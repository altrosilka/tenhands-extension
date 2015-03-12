angular.module('App').directive('editImageFilterOption', function(S_utils) {
  return {
    scope: {
      setValue: '=',
      model: '='
    },
    templateUrl: 'templates/directives/editImage/filter.html',
    link: function($scope, $element) {

    },
    controllerAs: 'ctr',
    controller: function($scope) {
      var ctr = this;

      ctr.collection = S_utils.getFilters();

      ctr.onFontchange = function(point) {
        $scope.setValue('filter', point.name);
      }

      ctr.getSelectPlaceholder = function(type) {
        return _.find(ctr.collection, function(q) {
          return $scope.model === q.name;
        }).title || 'Без фильтра';
      }
    }
  }
});
