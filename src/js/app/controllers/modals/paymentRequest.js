angular.module('App').controller('CM_paymentRequest', 
  function($scope, S_selfapi, S_chrome, $modalInstance, resp) {
    var ctr = this;

    ctr.resp = resp;

    return ctr;
  }
);