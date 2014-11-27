angular.module('App').controller('CM_photobankSearch', [
  '$scope',
  '$modalInstance',
  '$compile',
  '$timeout',
  'S_google',
  'S_utils',
  'S_selfapi',
  function($scope, $modalInstance, $compile, $timeout, S_google, S_utils, S_selfapi) {
    var ctr = this;

    var _fanciedImage, _fancyBoxObject;
    ctr.attachments = [];


    ctr.page = 0;

    ctr.selectedAttachments = [];

    ctr.processingImages = [];

    ctr.search = function(q) {
      if (q === '') {
        return
      }

      S_google.loadImages(q).then(function(resp) {
        var images = _.map(resp.results, function(q) {
          q.type = 'image';
          q.id = S_utils.getRandomString(16);
          return q;
        });
        ctr.attachments = images;
        console.log(images);
      });
    }

    ctr.onCropReady = function(src, c, w, h) {
      ctr.processingImages.push(_fanciedImage);
      $.fancybox.close();
      S_selfapi.uploadImageToVk(src, c, w, h, _fanciedImage.id).then(function(resp) {
        var photo = resp.data.response[0];
        var image = _.remove(ctr.processingImages, function(q) {
          return q.id === resp.data.id;
        })[0];
        
        _.extend(image, {
          photo: photo,
          width: photo.width,
          clientWidth: photo.width,
          height: photo.height,
          clientHeight: photo.height,
          tbUrl: photo.photo_130,
          src_big: photo.photo_807 || photo.photo_604
        });
      });
    }

    ctr.openFullImage = function(image) {
      _fanciedImage = image;
      var src = image.unescapedUrl;

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

    ctr.toggleAttach = function(attach) {
      var i = _.remove(ctr.selectedAttachments, function(q) {
        return q.id === attach.id;
      });

      if (!i.length) {
        ctr.selectedAttachments.push(attach);
      }
    }

    ctr.attachIsSelected = function(attach) {
      return typeof _.find(ctr.selectedAttachments, function(q) {
        return q.id === attach.id;
      }) !== 'undefined';
    }

    ctr.attachIsProcessing = function(attach) {
      return typeof _.find(ctr.processingImages, function(q) {
        return q.id === attach.id;
      }) !== 'undefined';
    }

    return ctr;
  }
]);
