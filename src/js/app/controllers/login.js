angular.module('App').controller('C_login',
  function($scope, S_selfapi, S_eventer) {
    var ctr = this;




    ctr.email = ctr.password = '';

    ctr.auth = function(email, password) {
      ctr.authInProgress = true;
      ctr.error = false;
      S_selfapi.signIn(email, password).then(function(resp) {
        ctr.authInProgress = false;
        S_eventer.sendEvent('successLogin');
      }, function() {
        ctr.authInProgress = false;
        ctr.error = true;
      });
    }

    return ctr;
  }
);
