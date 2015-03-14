angular.module('App').controller('CM_infoModal', 
  function($scope, S_selfapi, S_chrome, $modalInstance, html, title) {
    var ctr = this;

    ctr.title = title;
    ctr.html = html;

    return ctr;
  }
);


