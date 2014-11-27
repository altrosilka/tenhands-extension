angular.module('App').controller('C_main', [
  '$scope',
  '$compile',
  '$timeout',
  'S_utils',
  'S_selfapi',
  function($scope, $compile, $timeout, S_utils, S_selfapi) {
    var ctr = this;
    var _fanciedImage, _fancyBoxObject;
    ctr.attachments = [];

    ctr.selectedAttachments = [];
    ctr.processingImages = [];
    ctr.uploadingAttaches = [];

    $scope.$on('loadedDataFromTab', function(event, data) {
      $scope.$apply(function() {
        ctr.data = data;
        var images = _.map(data.images, function(q) {
          q.type = 'image';
          q.id = S_utils.getRandomString(16);
          return q;
        });
        ctr.attachments = ctr.attachments.concat(images);
        ctr.text = S_utils.decodeEntities(data.selection || data.title);
        ctr.dataIsLoaded = true;
      });

    });


    ctr.showRealImageSize = function(attach) {
      return (attach.clientWidth !== attach.width && attach.clientHeight !== attach.height);
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
          src: photo.photo_130,
          src_big: photo.photo_807 || photo.photo_604
        });
      });
    }

    ctr.openFullImage = function(image) {
      _fanciedImage = image;
      var src = image.src_big || image.src;
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

      $timeout(function() {
        $(window).resize();
        $timeout(function() {
          $('.fancybox-wrap').addClass('showed');
        });
      })
    }


    ctr.pushUploadingAttach = function() {
      var obj = {
        src: '/images/nophoto.jpg',
        type: 'image',
        processing: true,
        id: S_utils.getRandomString(16)
      };
      $scope.$apply(function() {
        ctr.attachments.push(obj);
        ctr.uploadingAttaches.push(obj);
        ctr.processingImages.push(obj);
      });
      return obj;
    }

    ctr.afterImageUploaded = function(resp, id) {
      var attach = ctr.uploadingAttaches.shift();
      var image = S_utils.convertUploadedPhotoToAttach(resp.response[0]);
      $scope.$apply(function() {
        _.extend(attach, image);
        ctr.processingImages.shift();
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


    ctr.openPhotobankSearch = function() {
      S_utils.openPhotobankModal().then(function(resp) {
        _.forEach(resp, function(el) {
          ctr.attachments.push(S_utils.convertGoogleImageToAttach(el));
        });
      });
    }

    return ctr;
  }
]);
