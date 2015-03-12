angular.module('App').controller('C_posting',
  function($scope, $compile, $timeout, S_utils, S_selfapi, S_eventer) {
    var ctr = this;

    var _socketListeningId, skipPostingNowChange = false;



    ctr.image = {};
    ctr.sets = [];


    ctr.selectedSet = {};
    ctr.attachments = [];


    ctr.closeAfterSuccess = false;

    S_selfapi.getAllSets().then(function(resp) {
      if (resp.data.error) {
        S_eventer.sendEvent('badLogin');
        return;
      }
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
      //ctr.channels = [];

      S_selfapi.getSetInfo(setId).then(function(resp) {
        ctr.channels = _.filter(resp.data.data, function(channel) {
          return !channel.disabled;
        });
        ctr.channelsIsLoaded = true;

        S_eventer.sendEvent('loadedDataFromArea', ctr.data);
      });
    });

    $scope.$on('emptyChannels', function() {
      ctr.allPostsComplete = false;
      S_utils.disableProgress(ctr.channels);
    });


    $scope.$on('loadedDataFromArea', function(event, data) {
      ctr.data = data;
      $timeout(function() {
        S_eventer.sendEvent('hideLoader');
      });
    });

    ctr.createPost = function(channel_ids) {
      if (typeof channel_ids !== 'undefined') {
        if (!_.isArray(channel_ids)) {
          channel_ids = [channel_ids];
        }
      }

      var postInfo = S_utils.configurePostInfo(ctr.channels, channel_ids, ctr.image);
      if (!postInfo.length) {
        return;
      }
      ctr.postingCount = postInfo.length;


      ctr.postingInProgress = true;
      ctr.completePostsCount = 0;

      ctr.errorPostCount = 0;

      if (ctr.postingNow) {
        S_utils.trackProgress(ctr.channels, postInfo);
      }


      S_selfapi.createPost(ctr.selectedSet.id, postInfo, _socketListeningId, ((!ctr.postingNow) ? moment(ctr.postingDate).format('X') : undefined)).then(function(resp) {
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
            ctr.postingInProgress = false;
            ctr.allPostsComplete = true;

            //S_eventer.sendEvent('showSuccessProgress');
          });
        });
      });

      function onChannelInfoRecieved() {
        if (ctr.completePostsCount === ctr.postingCount) {
          if (ctr.errorPostCount) {
            ctr.postingInProgress = false;
            //S_eventer.sendEvent('showSuccessProgress');
          } else {
            ctr.allPostsComplete = true;
            ctr.postingInProgress = false;
            //S_eventer.sendEvent('showSuccessProgress');
            if (ctr.closeAfterSuccess) {
              $timeout(function() {
                S_eventer.sayToFrame('close');
              }, 2000);
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

    ctr.showFooter = function() {
      return ctr.channelsIsLoaded && ctr.channels.length;
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
    ctr.postingDate = moment();
    ctr.postingNow = true;


    $scope.$watch(function() {
      return ctr.postingNow;
    }, function(q) {
      if (typeof q === 'undefined' || skipPostingNowChange) {
        skipPostingNowChange = false;
        return;
      }

      if (q === false) {
        ctr.postingDate = moment().add(3, 'hours').toDate();
      } else {
        $timeout(function() {
          ctr.postingDate = moment().toDate();
        }, 300);
      }
    });

    ctr.onTimeChange = function(time) {
      if (!ctr.postingDate) return;

      ctr.postingDate = moment(moment(ctr.postingDate).format('YYYYMMDD'), 'YYYYMMDD').add(time, 'seconds').format()
    }

    ctr.canPost = function() {
      var q = _.find(ctr.channels, function(q) {
        return q.disabled !== true;
      });
      if (!q) {
        return false;
      }
      return (ctr.postingNow || (+moment(ctr.postingDate).format('X') > +moment().format('X')));
    }

    ctr.viewTable = function() {
      S_utils.showTablePopup(ctr.selectedSet.id).then(function(newDate) {
        skipPostingNowChange = true;
        ctr.postingDate = newDate.toDate();
        ctr.postingNow = false;
      });
    }

    ctr.return = function() {
      ctr.allPostsComplete = false;
      S_utils.disableProgress(ctr.channels);
    }

    return ctr;
  }
);
