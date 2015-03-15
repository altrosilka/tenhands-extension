angular.module('App').controller('C_main',
  function($scope, $timeout, S_utils, S_selfapi, S_eventer, S_tour, S_transport, __showPaymentRequsetSecs) {
    var ctr = this;
    var _pushedMenu = false;

    ctr._state = 'post';

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

    ctr.emptyChannels = function() {
      S_eventer.sendEvent('emptyChannels');
    }

    ctr.isPushed = function() {
      return _pushedMenu;
    }

    ctr.openTour = function() {
      S_tour.init(true);
    }


    $scope.$on('paidUntilRecieved', function(event, time) {
      if (time === 0){
        return;
      }
      var now = +moment().format('X');
      if (now + __showPaymentRequsetSecs > time){
        if (now > time){
          ctr.paidUntilStr = 'истекла '+moment(time, "X").fromNow();
        } else {
          ctr.paidUntilStr = 'истечет '+moment(time, "X").fromNow();
        }
      }
    });   

    $scope.$on('paymentRequired', function(event, time) {
      ctr._state = 'payment';
      ctr.hideLoader = true;
    });   


    $scope.$on('hideLoader', function() {
      ctr.hideLoader = true;
      S_tour.init();
    });
    $scope.$on('tourStart', function() {
      $timeout(function() {
        ctr.showBlock = true;
      });
    });
    $scope.$on('tourEnd', function() {
      $timeout(function() {
        ctr.showBlock = false;
      })
    });

    $scope.$on('badLogin', function() {
      ctr._state = 'login';
      ctr.hideLoader = true;
    });


    $scope.$on('showSuccessProgress', function() {
      ctr.showSing = true;
      $timeout(function() {
        ctr.showSing = false;
      }, 2000);
    });

    $scope.$on('successLogin', function() {
      ctr._state = 'post';
      $timeout(function() {
        S_transport.emitData();
      }, 200);
    });





    return ctr;
  }
);
