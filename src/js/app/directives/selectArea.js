angular.module('App').directive('selectArea', [
  '$timeout',
  '$compile',
  'S_selfapi',
  'S_utils',
  function($timeout, $compile, S_selfapi, S_utils) {
    return {
      scope: {
        attachments: '=',
        selectedAttachments: '=',
        onAttachClick: '&',
        noAttachesText: '@'
      },
      templateUrl: 'templates/directives/selectArea.html',
      controller: ['$scope', function($scope) {
        var ctr = this;

        var _fanciedImage;

        ctr.noAttachesText = $scope.noAttachesText;

        ctr.toggle = function(attach) {
          var i = _.remove($scope.selectedAttachments, function(q) {
            return q.id === attach.id;
          });
          if (i.length === 0) {
            $scope.selectedAttachments.push(attach);
          }
        }

        ctr.remove = function(attach) {
          _.remove($scope.selectedAttachments, function(q) {
            return attach.id === q.id;
          });
        }

        ctr.showRealImageSize = function(attach) {
          return (attach.clientWidth !== attach.width && attach.clientHeight !== attach.height);
        }

        ctr.attachIsSelected = function(attach) {
          return typeof _.find($scope.selectedAttachments, function(q) {
            return q.id === attach.id;
          }) !== 'undefined';
        }

        ctr.onAttachClick = function(attach) {
          $scope.onAttachClick({
            attach: attach
          });
        }

        return ctr;
      }],
      link: function($scope, $element) {},
      controllerAs: 'ctr'
    }
  }
]);
