angular.module('App').controller('C_login', [
  '$scope',
  'S_selfapi',
  function($scope, S_selfapi) {
    var ctr = this;

    ctr.auth = function(email, password) {
      S_selfapi.signIn(email, password).then(function(resp) {
        if (resp.data.success){
          $scope.ctr.checkAuth();
        }
      });
    }

    return ctr;
  }
]);
