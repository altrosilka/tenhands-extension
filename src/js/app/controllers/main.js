angular.module('App').controller('C_main', [
  '$scope',
  '$compile',
  '$timeout',
  'S_utils',
  'S_selfapi',
  'S_vk',
  function($scope, $compile, $timeout, S_utils, S_selfapi, S_vk) {
    var ctr = this;

    ctr.minDate = new Date();
    ctr.postingDate = new Date();
    ctr.maxDate = moment(ctr.minDate).add(45, 'days').toDate();

    ctr.datepickerOptions = {};

    ctr.openDatepicker = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      ctr.openedDatepickerPopup = !ctr.openedDatepickerPopup;
    };


    ctr.attachments = [];

    ctr.processingAttachments = [];
    ctr.uploadingAttaches = [];



    S_vk.request('groups.get', {
      extended: 1,
      filter: 'admin,editor',
      fields: 'members_count'
    }).then(function(resp) {

      //$scope.$apply(function() {
      ctr.groups = resp.response.items;

      ctr.selectedGroup = ctr.groups[0];
    });



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
    ctr.getRemainingAttachesCount = function() {
      return 9 - ctr.attachments.length;
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
      ctr.onTimeChanged();
    });

    $scope.$watch(function() {
      return ctr.postingTime;
    }, function(q) {
      if (!q) return;
      ctr.onTimeChanged();
    });


    ctr.onTimeChanged = function() {
      if (!ctr.postingTime || !ctr.postingDate) return;

      var dateUnix = +moment(moment(ctr.postingDate).format('DD.MM.YY'), 'DD.MM.YY').format('X');
      var startDate = +moment(moment(ctr.postingTime).format('DD.MM.YY HH:mm:00'), 'DD.MM.YY HH:mm:ss').format('X') - +moment(moment(ctr.postingTime).format('DD.MM.YY 00:00:00'), 'DD.MM.YY HH:mm:ss').format('X');

      ctr.postingUnixTime = dateUnix + startDate;

      ctr.loadTimeline(ctr.postingUnixTime);
    }

    ctr.loadTimeline = function(unix) {
      return;
      S_vk.request('newsfeed.get', {
        filters: 'post',
        return_banned: 1,
        start_time: unix - 5 * 3600,
        source_ids: ctr.groupId,
        count: 100
      }, function(resp) {
        console.log(resp);
      });
    }

    ctr.publicPost = function() {

      if (ctr.processingAttachments.length > 0) {
        return;
      }

      var postInfo = _.map(ctr.attachments, function() {
        return '';
      });

      _.forEach(ctr.attachments, function(q, i) {
        switch (q.type) {
          case "image":
            {
              if (q.photo) {
                postInfo[i] = q.photo;
              } else {
                ctr.processingAttachments.push(q);
                S_selfapi.uploadImageToVk(q.src_big).then(function(resp) {
                  var photo = resp.photo;
                  _.remove(ctr.processingAttachments, function(qz) {
                    return qz.id === q.id;
                  })[0];

                  postInfo[i] = _.extend({
                    type: 'image'
                  }, photo);

                  if (ctr.processingAttachments.length === 0) {
                    console.log('out');
                    console.log(postInfo, ctr.attachments);
                    out(postInfo);
                  }
                });
              }
              break;
            }
        }
      });

      function out(attachments) {
        S_selfapi.sendPost('-'+ctr.selectedGroup.id, ctr.text, attachments, ctr.postingUnixTime, 0).then(function(resp) {
          console.log(resp.data);
        });
      }
    }

    return ctr;
  }
]);
