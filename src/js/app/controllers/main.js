angular.module('App').controller('C_main', ['$scope', 'S_mapping', function($scope, S_mapping) {
  var ctr = this;

  ctr.mainHero = {};
  ctr.neededImages = ['/images/intro/header.jpg', '/images/intro/header-blurred.jpg'];

  ctr.showHero = function(src, role, name, short) {
    ctr.mainHero = {
      src: src,
      roleTxt: S_mapping.getHumanRole(role),
      role: role,
      name: name,
      short: short
    }
  }

  ctr.hideHero = function() {
    ctr.mainHero = {};
  }

  var hidden = false;
  $(window).on('scroll', function() {
    if (!hidden) {
      hidden = true;
      $scope.$apply(function() {
        ctr.hideScrollAnimation = true;
      })
    }
  });

  return ctr;
}]);
