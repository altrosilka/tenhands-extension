angular.module('App').controller('C_posting', [
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

    ctr.sets = [];

    ctr.selectedSet = {};
    ctr.attachments = [];

    S_selfapi.getAllSets().then(function(resp) {
      ctr.sets = resp.data.data;
      ctr.selectedSet = ctr.sets[0];
    });

    $scope.$watch(function() {
      return ctr.selectedSet.id;
    }, function(setId) {
      if (!setId) return;

      S_selfapi.getSetInfo(setId).then(function(resp) {
        ctr.channels = resp.data.data;
      });
    });



    $scope.$on('loadedDataFromTab', function(event, data) {
      $scope.$apply(function() {
        ctr.data = data;

        if (data.imageSrc && data.imageSrc !== '') {
          data.images.unshift({
            src: data.imageSrc,
            big_src: data.imageSrc
          });
        }

        var images = _.map(data.images, function(q) {
          q.type = 'photo';
          q.id = S_utils.getRandomString(16);
          return q;
        });
        ctr.pageAttachments = ctr.attachments.concat(images);
        if (images.length) {
          ctr.attachments.push(images[0]);
        }

        if (!ctr.text || ctr.text === '') {
          ctr.text = S_utils.decodeEntities(data.selection || data.title) + '\n\n' + data.url;
        }
      });
    });

    ctr.createPost = function(channel_ids) {
      var postInfo = S_utils.configurePostInfo(ctr.channels, channel_ids);

      console.log(postInfo);

      S_selfapi.createPost(ctr.selectedSet.id, postInfo).then(function(resp) {
        var socketUrl = resp.data.data.socketUrl;
        var socket = io(socketUrl);

        socket.on('post_success', function(data) {
          var channel = _.find(ctr.channels, function(c) {
            return c.id === data.channel_id;
          });

          if (channel) {
            $scope.$apply(function() {
              channel.complete = true;
              channel.post_url = data.post_url;
            });
          }
        });

        socket.on('post_fail', function(data) {
          var channel = _.find(ctr.channels, function(c) {
            return c.id === data.channel_id;
          });

          if (channel) {
            $scope.$apply(function() {
              channel.error = true;
              channel.errorData = data;
            });
          }
        });
      });
    }

    ctr.postChannelAgain = function(channel_id){
      debugger
      ctr.createPost([channel_id]);
    }

    ctr.showSetSelect = function() {
      return ctr.sets.length > 1;
    }


    return ctr;
  }
]);
