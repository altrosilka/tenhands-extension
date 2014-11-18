angular.module('App').controller('C_main', ['$scope', function($scope) {
  var ctr = this;

  $scope.$on('loadedDataFromTab', function(event, data) {
    $scope.$apply(function() {

      ctr.data = data;
      ctr.dataIsLoaded = true;
    });

  });

  return ctr;
}]);
