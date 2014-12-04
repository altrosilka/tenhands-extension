angular.module('App').directive('selectCropArea', [
  '$timeout',
  '$compile',
  'S_selfapi',
  'S_utils',
  function($timeout, $compile, S_selfapi, S_utils) {
    return {
      scope: {
        processingAttachments: '=',
        attachments: '=',
        postAttachments: '=',
        noAttachesText: '@'
      },
      templateUrl: 'templates/directives/selectCropArea.html',
      controller: ['$scope', function($scope) {
        var ctr = this;

        var _fanciedImage;

        ctr.showRealImageSize = function(attach) {
          return (attach.clientWidth !== attach.width && attach.clientHeight !== attach.height);
        }

        ctr.attachIsSelected = function(attach) {
          return typeof _.find($scope.postAttachments, function(q) {
            return q.id === attach.id;
          }) !== 'undefined';
        }

        ctr.attachIsProcessing = function(attach) {
          return typeof _.find($scope.processingAttachments, function(q) {
            return q.id === attach.id;
          }) !== 'undefined';
        }

        ctr.remove = function(attach){
          _.remove($scope.attachments,function(q){
            return attach.id === q.id;
          });
        }

        ctr.onCropReady = function(src, c, w, h) {
          $scope.processingAttachments.push(_fanciedImage);
          $.fancybox.close();

          S_selfapi.uploadImageToVk(src, c, w, h, _fanciedImage.id).then(function(resp) {
            var photo = resp.photo;
            var image = _.remove($scope.processingAttachments, function(q) {
              return q.id === resp.id;
            })[0];

            _.extend(image, {
              photo: photo, 
              width: photo.width, 
              clientWidth: photo.width,
              height: photo.height,
              clientHeight: photo.height,
              src: photo.photo_130,
              src_big: photo.photo_807 || photo.photo_604
            });
          });
        }

        ctr.edit = function(image) {
          _fanciedImage = image;
          var src = image.src_big || image.src;

          S_utils.loadImage(src).then(function() {
            _fancyBoxObject = $.fancybox({
              type: 'html',
              overlayShow: true,
              content: $compile('<div jcrop-area on-crop-ready="ctr.onCropReady" image="' + src + '"></div>')($scope),
              padding: 0,
              openEffect: 'none',
              closeEffect: 'none',
              width: 960,
              height: 520,
              helpers: {
                overlay: {
                  locked: false
                }
              }
            });
            $('.fancybox-wrap').addClass('showed');
          });
        }

        ctr.openVideo = function(attach){
          S_utils.callVideoPlayerDialog(attach.video.title, attach.video.player);
        }

        return ctr;
      }],
      link: function($scope, $element) {
      },
      controllerAs: 'ctr'
    }
  }
]);
