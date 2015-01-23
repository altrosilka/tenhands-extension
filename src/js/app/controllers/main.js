angular.module('App').controller('C_main', [
  '$scope',
  '$compile',
  '$timeout',
  'S_utils',
  'S_selfapi',
  'S_eventer',
  'S_vk',
  '__maxAttachments',
  function($scope, $compile, $timeout, S_utils, S_selfapi, S_eventer, S_vk, __maxAttachments) {
    var ctr = this;

    ctr.checkAuth = function() {
      S_selfapi.checkAuth().then(function(resp) {
        if (resp.data.success) {
          ctr._state = 'post';
          $timeout(function() {
            ctr.showBottomPanel = true;
          }, 1000);
        } else {
          ctr._state = 'login';
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



    ctr.checkAuth();

    return ctr;
  }
]);
