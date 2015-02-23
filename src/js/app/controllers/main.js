angular.module('App').controller('C_main', [
  '$scope',
  '$timeout',
  'S_utils',
  'S_selfapi',
  'S_eventer',
  function($scope, $timeout, S_utils, S_selfapi, S_eventer) {
    var ctr = this;
    var _pushedMenu = false;
    ctr.getUserInfo = function() {
      S_selfapi.getUserInfo().then(function(resp) {
        if (resp.data.success) {
          ctr._state = 'post';
          S_eventer.sendEvent('userInfoLoaded', resp.data.data);
        } else {
          ctr._state = 'login';
          S_eventer.sendEvent('hideLoader');
        }
      });
    }

    ctr.showExtension = function() {
      return ctr._state;
    }

    /* enviroment */
    ctr.resizeIframe = function() {
      ctr.minState = !ctr.minState;
      S_eventer.sayToFrame('toggle');
    }

    ctr.closeIframe = function() {
      S_eventer.sayToFrame('close');
    }


    ctr.toggleMenu = function() {
      _pushedMenu = !_pushedMenu;
    }

    ctr.emptyChannels = function(){
      S_eventer.sendEvent('emptyChannels');
    }

    ctr.isPushed = function() {
      return _pushedMenu;
    }


    $scope.$on('hideLoader', function() {
      ctr.hideLoader = true;
    });

    ctr.getUserInfo();

    $scope.$on('showSuccessProgress', function() {
      ctr.showSing = true;
      $timeout(function() {
        ctr.showSing = false;
      }, 2000);  
    });



    return ctr;
  }
]);
