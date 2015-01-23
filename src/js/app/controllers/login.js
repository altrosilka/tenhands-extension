angular.module('App').controller('C_login', [
  '$scope',
  'S_selfapi',
  function($scope, S_selfapi) {
    var ctr = this;

    ctr.email = ctr.password = '';

    ctr.auth = function(email, password) {
      ctr.authInProgress = true;
      ctr.error = false;
      S_selfapi.signIn(email, password).then(function(resp) {
        ctr.authInProgress = false;
        if (resp.data.success) {
          $scope.ctr.checkAuth();
        }

        if (resp.data.error) {
          ctr.error = true;
        }
      });
    }

    return ctr;
  }
]);
