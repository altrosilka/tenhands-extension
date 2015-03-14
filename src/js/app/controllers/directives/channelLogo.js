angular.module('App').controller('CD_channelLogo',
  function($scope, $interpolate, S_utils, S_templater) {
    var ctr = this;

    ctr.toggleChannel = function(ch) {
      ch.disabled = !ch.disabled;
    }


    return ctr;
  }
);
 