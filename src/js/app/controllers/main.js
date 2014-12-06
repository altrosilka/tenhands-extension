angular.module('App').controller('C_main', [
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

    ctr.minDate = new Date();
    ctr.postingDate = moment().hour(0).minute(0).second(0).toDate();
    ctr.postingNow = true;
    ctr.postingTime = new Date();
    ctr.stepsPlural = {
      0: '',
      one: 'еще {} шаг',
      few: 'еще {} шага',
      many: 'еще {} шагов',
      other: 'еще {} шагов'
    };

    ctr.maxDate = moment(ctr.minDate).add(45, 'days').toDate();
    ctr.postingUnixTime = S_utils.getCurrentTime();

    ctr.attachments = [];
    ctr.selectedGroup = {};

    ctr.processingAttachments = [];
    ctr.uploadingAttaches = [];



    S_vk.request('groups.get', {
      extended: 1,
      filter: 'admin,editor',
      fields: 'members_count'
    }).then(function(resp) {
      ctr.groups = resp.response.items;
      ctr.selectedGroup = ctr.groups[0];
    });

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

    $scope.$watch(function() {
      return ctr.selectedGroup.id;
    }, function(groupId) {
      if (!groupId) return;
      ctr.postingApp = undefined;
      ctr.postingToken = undefined;
      S_selfapi.getOverrideKey(groupId).then(function(resp) {
        if (resp.data.settings !== null) {
          ctr.postingToken = resp.data.settings.token;
          S_vk.request('apps.get', {
            app_id: resp.data.settings.appId
          }).then(function(resp) {
            ctr.postingApp = resp.response;
          });
        }
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
          q.type = 'image';
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
      });
    });

    $timeout(function() {
      ctr.dataIsLoaded = true;
    }, 100);

    ctr.getRemainingAttachesCount = function() {
      return __maxAttachments - ctr.attachments.length;
    }

    ctr.canAddAttach = function() {
      return ctr.getRemainingAttachesCount() > 0;
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
      var image = S_utils.convertUploadedPhotoToAttach(resp.response[0]);
      $scope.$apply(function() {
        _.extend(attach, image);
        ctr.processingAttachments.shift();
      });
    }

    S_selfapi.getAssignKey().then(function(resp) {
      if (resp.data.keyInfo === null) {
        ctr.paidIsEnd = true;
      } else {
        ctr.paidIsEnd = false;
      }
    });


    $scope.$watch(function() {
      return ctr.postingDate;
    }, function(q) {
      if (!q) return;
      ctr.onTimeChange();
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

    ctr.publicPost = function() {

      if (ctr.processingAttachments.length > 0) {
        return;
      }

      var postInfo = _.map(ctr.attachments, function() {
        return '';
      });

      ctr.postingProcess = true;

      _.forEach(ctr.attachments, function(q, i) {
        switch (q.type) {
          case "photo":
            {
              if (q.photo) {
                postInfo[i] = {
                  type: 'photo',
                  photo: q.photo
                };
              } else {
                ctr.processingAttachments.push(q);
                S_selfapi.uploadImageToVk(q.src_big).then(function(resp) {
                  var photo = resp.photo;
                  _.remove(ctr.processingAttachments, function(qz) {
                    return qz.id === q.id;
                  })[0];

                  postInfo[i] = {
                    type: 'photo',
                    photo: photo
                  };

                  if (ctr.processingAttachments.length === 0) {
                    out(postInfo);
                  }
                });
              }
              break;
            }
          case "video":
            {
              postInfo[i] = {
                type: 'video',
                video: q.video
              };
              break;
            }
          case "poll":
            {
              if (q.poll) {
                postInfo[i] = q.poll;
              } else {
                ctr.processingAttachments.push(q);
                S_vk.createPoll(q, ctr.selectedGroup.id).then(function(resp) {
                  var poll = resp.response;
                  _.remove(ctr.processingAttachments, function(qz) {
                    return qz.type === 'poll';
                  })[0];

                  postInfo[i] = {
                    type: 'poll',
                    poll: poll
                  };

                  if (ctr.processingAttachments.length === 0) {
                    out(postInfo);
                  }
                });
              }
              break;
            }
        }
      });

      if (ctr.processingAttachments.length === 0) {
        out([]);
      }

      function out(attachments) {
        console.log(attachments);

        var owner_id = '-' + ctr.selectedGroup.id;
        var text = ctr.text;
        var postingTime = ctr.postingUnixTime;
        var assigned = (ctr.assigned) ? 1 : 0;

        if (ctr.postingNow) {
          var attas = S_utils.getAttachmentsString(attachments);

          var oldToken;
          if (ctr.postingApp) {
            S_vk.getToken().then(function(token) {
              oldToken = token;

              if (ctr.postingApp) {
                S_vk.setToken(ctr.postingToken);
              }

              S_vk.request('wall.post', {
                owner_id: owner_id,
                from_group: 1,
                signed: assigned,
                message: text,
                attachments: attas
              }).then(function(resp) {
                S_vk.setToken(oldToken);
                if (ctr.notClose) {
                  ctr.postingProcess = false;
                } else {
                  S_eventer.sayToFrame('close');
                }
              });
            });
          }
        } else {
          S_selfapi.sendPost(owner_id, text, attachments, postingTime, assigned).then(function(resp) {
            if (ctr.notClose) {
              ctr.postingProcess = false;
            } else {
              S_eventer.sayToFrame('close');
            }
          });
        }
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

    ctr.attachItem = function(type) {
      switch (type) {
        case 'photo':
          {
            S_utils.callAttachPhotoDialog(ctr.pageAttachments, {
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


    /* enviroment */
    ctr.resizeIframe = function() {
      ctr.minState = !ctr.minState;
      S_eventer.sayToFrame('toggle');
    }

    ctr.closeIframe = function() {
      S_eventer.sayToFrame('close');
    }

    return ctr;
  }
]);
