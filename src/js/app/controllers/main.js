angular.module('App').controller('C_main', [
  '$scope',
  '$compile',
  '$timeout',
  'S_utils',
  'S_selfapi',
  function($scope, $compile, $timeout, S_utils, S_selfapi) {
    var ctr = this;

    ctr.attachments = [];

    ctr.selectedAttachments = [];
    ctr.processingImages = [];
    ctr.uploadingAttaches = [];

    ctr.openParserResults = function() {
      var q = (!ctr.dataIsLoaded) ? false : ctr.pageAttachments;
      S_utils.openParserResults(q).then(function(resp) {
        _.forEach(resp, function(q) {
          ctr.attachments.push(angular.copy(q));
        });
      });
    }

    $scope.$on('loadedDataFromTab', function(event, data) {
      $scope.$apply(function() {
        ctr.data = data;
        var images = _.map(data.images, function(q) {
          q.type = 'image';
          q.id = S_utils.getRandomString(16);
          return q;
        });
        ctr.pageAttachments = ctr.attachments.concat(images);
        ctr.attachments.push(images[0]);

        if (!ctr.text || ctr.text === '') {
          ctr.text = S_utils.decodeEntities(data.selection || data.title);
        }
      });

    });

    ctr.dataIsLoaded = true;

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

    ctr.openPhotobankSearch = function() {
      S_utils.openPhotobankModal().then(function(resp) {
        _.forEach(resp, function(el) {
          ctr.attachments.push(el);
        });
      });
    }

    return ctr;
  }
]);
