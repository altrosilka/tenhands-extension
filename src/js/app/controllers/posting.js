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

    var _socketListeningId;

    ctr.sets = [];

    ctr.selectedSet = {};
    ctr.attachments = [];



    ctr.closeAfterSuccess = true;

    S_selfapi.getAllSets().then(function(resp) {
      ctr.sets = resp.data.data;
      ctr.selectedSet = ctr.sets[0];
    });

    $scope.$watch(function() {
      return ctr.selectedSet.id;
    }, function(setId) {
      if (!setId) return;

      ctr.allPostsComplete = false;
      ctr.postingCount = 0;

      S_selfapi.getSetInfo(setId).then(function(resp) {
        ctr.channels = _.filter(resp.data.data, function(channel) {
          return !channel.disabled;
        });
        ctr.channelsIsLoaded = true;
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
          ctr.text = S_utils.decodeEntities(data.selection || data.title);
        }

        ctr.link = data.url;
        /*
        S_selfapi.getShortUrl(data.url).then(function(resp) {
          if (resp.data.data) {
            ctr.link = resp.data.data;
          } else {
            ctr.link = data.url;
          }
        });*/
      });
    });

    ctr.createPost = function(channel_ids) {
      var postInfo = S_utils.configurePostInfo(ctr.channels, channel_ids);
      ctr.postingCount = postInfo.length;
      ctr.completePostsCount = 0;
      S_utils.trackProgress(ctr.channels, postInfo);



      S_selfapi.createPost(ctr.selectedSet.id, postInfo, _socketListeningId).then(function(resp) {
        var socketUrl = resp.data.data.socketUrl;
        _socketListeningId = resp.data.data.hash;

        var socket = io(socketUrl);

        socket.on('post_success', function(data) {
          var channel = _.find(ctr.channels, function(c) {
            return c.id === data.channel_id;
          });

          if (channel) {
            $scope.$apply(function() {
              ctr.completePostsCount++;
              channel.inprogress = false;
              channel.complete = true;
              channel.post_url = data.post_url;
              onChannelInfoRecieved();
            });
          }
        });

        socket.on('post_fail', function(data) {
          var channel = _.find(ctr.channels, function(c) {
            return c.id === data.channel_id;
          });

          if (channel) {
            $scope.$apply(function() {
              ctr.completePostsCount++;
              channel.inprogress = false;
              channel.error = true;
              channel.errorData = data;
              onChannelInfoRecieved();
            });
          }
        });
      });

      function onChannelInfoRecieved() {
        if (ctr.completePostsCount === ctr.postingCount) {
          if (ctr.channels.length === ctr.completePostsCount) {
            ctr.allPostsComplete = true;
            if (ctr.closeAfterSuccess) {
              S_eventer.sayToFrame('close');
            }
          } else {
            ctr.postingCount = 0;
          }
        }
      }
    }


    ctr.getProgressLineWidth = function() {
      return (((ctr.completePostsCount) / ctr.postingCount * 100) + '%');
    }

    ctr.postChannelAgain = function(channel_id) {
      ctr.createPost([channel_id]);
    }

    ctr.showSetSelect = function() {
      return ctr.sets.length > 1;
    }

    ctr.getChannelsCount = function(q) {
      return ((q) ? q.length : 0);
    }

    ctr.channelsPlural = {
      0: 'нет каналов',
      one: '{} канал',
      few: '{} канала',
      many: '{} каналов',
      other: '{} каналов'
    };



    return ctr;
  }
]);
