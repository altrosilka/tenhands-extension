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


    ctr.closeAfterSuccess = false;

    S_selfapi.getAllSets().then(function(resp) {

      ctr.sets = resp.data.data.own;

      ctr.sets = ctr.sets.concat(_.map(resp.data.data.guest, function(q) {
        q.guest = true;
        return q;
      }));

      ctr.selectedSet = ctr.sets[0];
    });

    $scope.$watch(function() {
      return ctr.selectedSet.id;
    }, function(setId) {
      if (!setId) return;

      ctr.channelsIsLoaded = false;
      ctr.allPostsComplete = false;
      ctr.postingCount = 0;
      ctr.channels = [];

      S_selfapi.getSetInfo(setId).then(function(resp) {
        ctr.channels = _.filter(resp.data.data, function(channel) {
          return !channel.disabled;
        });
        ctr.channelsIsLoaded = true;

        S_eventer.sendEvent('loadedDataFromArea', ctr.data);
      });
    });



    $scope.$on('loadedDataFromTab', function(event, data) {
      ctr.data = data;
      S_eventer.sendEvent('loadedDataFromArea', ctr.data);
      $timeout(function() {
        S_eventer.sendEvent('hideLoader');
      });
    });

    ctr.createPost = function(channel_ids) {
      var postInfo = S_utils.configurePostInfo(ctr.channels, channel_ids);
      ctr.postingCount = postInfo.length;
      ctr.postingInProgress = true;
      ctr.completePostsCount = 0;

      ctr.errorPostCount = 0;

      if (ctr.postingNow) {
        S_utils.trackProgress(ctr.channels, postInfo);
      }

      /*
            $timeout(function() {
              ctr.completePostsCount++;
              onChannelInfoRecieved();
            }, 500);

            $timeout(function() {
              ctr.completePostsCount++;
              ctr.errorPostCount++;
              onChannelInfoRecieved();
            }, 1000);

            $timeout(function() {
              ctr.completePostsCount++;
              onChannelInfoRecieved();
            }, 1500);
            return;
      */

      S_selfapi.createPost(ctr.selectedSet.id, postInfo, _socketListeningId, ((!ctr.postingNow) ? ctr.postingUnixTime : undefined)).then(function(resp) {
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
              ctr.errorPostCount++;
              channel.inprogress = false;
              channel.error = true;
              channel.errorData = data;
              onChannelInfoRecieved();
            });
          }
        });

        socket.on('post_planned_success', function(data) {
          $scope.$apply(function() {
            ctr.postingInProgress = true;
            ctr.allPostsComplete = true;
          });
        });
      });

      function onChannelInfoRecieved() {
        if (ctr.completePostsCount === ctr.postingCount) {
          if (ctr.errorPostCount) {
            ctr.postingInProgress = false;
          } else {
            ctr.allPostsComplete = true;
            if (ctr.closeAfterSuccess) {
              S_eventer.sayToFrame('close');
            }
          }
        }
      }
    }

    ctr.showPostProcessingLayer = function() {
      return ctr.postingInProgress;
    }

    ctr.getProgressLineStyles = function() {
      var d = ctr.completePostsCount / ctr.postingCount;
      return {
        width: ((d * 100) + '%'),
        opacity: d
      }
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


    ctr.minDate = new Date();
    ctr.postingDate = moment().hour(0).minute(0).second(0).toDate();
    ctr.postingNow = true;
    ctr.postingTime = new Date();


    $scope.$watch(function() {
      return ctr.postingNow;
    }, function(q) {
      if (typeof q === 'undefined') return;

      if (q === false) {
        var secondsFromStart = moment().diff(moment().hour(0).minute(0).second(0), 'seconds');
        var daySeconds = 3600 * 24;
        var offset = secondsFromStart + 3600 * 3;
        if (offset > daySeconds) {
          ctr.postingTime = offset - daySeconds;
          ctr.postingDate = moment(ctr.postingDate).add(1, 'days').toDate();
        } else {
          ctr.postingTime = offset;
        }
        ctr.onTimeChange(ctr.postingTime);
      } else {
        ctr.postingUnixTime = S_utils.getCurrentTime();
      }
    });

    ctr.onTimeChange = function(time) {
      ctr.pastTime = false;

      if (!ctr.postingTime || !ctr.postingDate) return;

      if (time) {
        ctr.postingTime = time;
      }

      var dateUnix = +moment(ctr.postingDate).format('X');
      var startDate = ctr.postingTime;

      var res = dateUnix + startDate;

      if (res > S_utils.getCurrentTime()) {
        ctr.postingUnixTime = dateUnix + startDate;
      } else {
        ctr.pastTime = true;
      }
    }

    ctr.addTimer = function() {
      ctr.timerIsEnabled = true;
      ctr.postingNow = false;
    }
    ctr.removeTimer = function() {
      ctr.timerIsEnabled = false;
      ctr.postingNow = true;
    }

    return ctr;
  }
]);
