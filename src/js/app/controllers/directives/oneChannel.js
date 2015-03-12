angular.module('App').controller('CD_oneChannel',
  function($scope, $interpolate, $timeout, S_utils, S_templater, S_selfapi) {
    var ctr = this;

    ctr.attachments = [];

    ctr.selectedAttachments = [];
    ctr.uploadingAttaches = [];
    ctr.processingAttachments = [];
    ctr.pageAttachments = [];

    $scope.$on('loadedDataFromArea', function(event, data) {
      parseData(data);
    });

    $scope.$on('trigger:templateChanged', function() {
      parseData(ctr.data);
    });

    $scope.$on('emptyChannels', function() {
      ctr.text = '';
      ctr.removeImage();
    });


    if ($scope.pageData) {
      parseData($scope.pageData);
    }

    function parseData(data) {
      ctr.data = data;

      if (data.imageSrc && data.imageSrc !== '') {
        data.images.unshift({
          src: data.imageSrc,
          src_big: data.imageSrc
        });
      }

      var images = _.map(data.images, function(q) {
        q.type = 'image';
        q.id = S_utils.getRandomString(16);
        return q;
      });
      if (images.length) {
        ctr.pageAttachments = ctr.attachments.concat(images);
        ctr.attachments.length = 0;
        $scope.image = angular.extend($scope.image, images[0]);
      }

      ctr.text = $interpolate(S_templater.getTemplate())(ctr.data);
    }


    ctr.attachImage = function() {
      S_utils.callAttachPhotoDialog(ctr.pageAttachments, {
        before: ctr.pushUploadingAttach,
        after: ctr.afterImageUploaded
      }).then(function(resp) {
        $scope.image = angular.extend($scope.image, resp[0]);
      });
    }

    ctr.pushUploadingAttach = function() {

    }

    ctr.afterImageUploaded = function(resp, id) {
      $timeout(function() {
        $scope.image = angular.extend($scope.image, {
          src_big: resp.data.media_url,
          src_original: resp.data.media_url,
          options: undefined,
          media_id: resp.data.media_id
        });
      });

    }

    ctr.editImage = function() {
      S_utils.showEditImagePopup($scope.image).then(function(resper) {
        S_selfapi.saveBase64Image(resper.url).then(function(resp, id) {
          $timeout(function() {
            $scope.image = angular.extend($scope.image, {
              src_big: resp.data.data.media_url,
              src_original: $scope.image.src_original || $scope.image.src_big,
              options: resper.options,
              media_id: resp.data.data.media_id
            });
          })

        })
      })
    }

    ctr.attachmentsLimitReached = function() {
      return S_utils.attachmentsLimitReached(ctr.attachments.length);
    }

    ctr.showActions = function(channel) {
      return !channel.inprogress && !channel.error && !channel.complete;
    }

    ctr.showProgress = function(channel) {
      return channel.inprogress;
    }

    ctr.removeImage = function() {
      $scope.image.src_big = undefined;
    }

    ctr.getMaxTextLength = function() {
      $timeout(function() {
        //ctr.showChannels = ctr.text.length > S_utils.getMaxTextLengthInChannels($scope.channels, $scope.image, ctr.text);
      });
    }

    ctr.postChannelAgain = function(channel_id){
      $scope.postChannelAgain({
        channel_id: channel_id
      });
    }

    ctr.showDesc = function() {
      var q = _.find($scope.channels, function(q) {
        return q.separately === true;
      });

      if (q) {
        return true;
      }
      return false;
    }

    return ctr;
  }
);
