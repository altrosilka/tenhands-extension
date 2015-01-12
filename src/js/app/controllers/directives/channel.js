angular.module('App').controller('CD_channel', [
  '$scope',
  'S_utils',
  function($scope, S_utils) {
    var ctr = this;

    ctr.network = $scope.channel.network;
    ctr.screen_name = $scope.channel.screen_name;

    $scope.channel.attachments = ctr.attachments = [];

    ctr.selectedAttachments = [];
    ctr.uploadingAttaches = [];
    ctr.processingAttachments = [];

    $scope.$watch("parsedText", function(text) {
      if (!text) return;

      ctr.text = $scope.channel.text = text;
    });

    $scope.$watch("parsedImage", function(text) {
      if (!text) return;
    });

    $scope.$watch(function() {
      return ctr.text;
    }, function(text) {
      $scope.channel.text = text;
    });

    ctr.isComplete = function() {
      return $scope.channel.complete;
    }

    ctr.isFail = function() {
      return $scope.channel.error;
    }

    ctr.getPostUrl = function() {
      return $scope.channel.post_url;
    }

    ctr.attachItem = function(type) {
      switch (type) {
        case 'photo':
          {
            S_utils.callAttachPhotoDialog($scope.pageAttachments, {
              before: ctr.pushUploadingAttach,
              after: ctr.afterImageUploaded
            }).then(function(resp) {
              ctr.attachments = S_utils.sortAttachments(_.uniq(ctr.attachments.concat(resp), 'id'));
            });
            break;
          }
        case 'video':
          {
            S_utils.callAttachVideoDialog(ctr.selectedGroup.id).then(function(resp) {
              var video = S_utils.wrapVideo(resp[0]);
              ctr.attachments = S_utils.sortAttachments(ctr.attachments.concat(video));
            });
            break;
          }
        case 'poll':
          {
            var poll = S_utils.createEmptyPoll();
            ctr.attachments = S_utils.sortAttachments(ctr.attachments.concat(poll));
            break;
          }
      }
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
        ctr.processingAttachments.push(obj);
      });
      return obj;
    }

    ctr.afterImageUploaded = function(resp, id) {
      var attach = ctr.uploadingAttaches.shift();
      var image = S_utils.convertUploadedPhotoToAttach(resp.data.media_id, resp.data.media_url, resp.data.info);
      $scope.$apply(function() {
        _.extend(attach, image);
        ctr.processingAttachments.shift();
      });
    }

    ctr.getFailDescription = function() {
      if ($scope.channel.errorData) {
        return S_utils.getFailDescription($scope.channel.errorData);
      }
    }

    ctr.editPost = function() {
      delete $scope.channel.error;
      delete $scope.channel.errorData;
    }

    ctr.postInChannelAgain = function() {
      $scope.postChannelAgain();
    }


    ctr.attachmentsLimitReached = function(network) {
      switch (network) {
        case 'ig':
          {
            return ctr.attachments.length >= 1;
            break;
          }
        case 'tw':
          {
            return ctr.attachments.length >= 4;
            break;
          }
        case 'vk':
          {
            return ctr.attachments.length >= 9;
            break;
          }
      }
    }

    return ctr;
  }
]);
