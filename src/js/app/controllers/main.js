angular.module('App').controller('C_main', [
  '$scope',
  '$compile',
  '$timeout',
  'S_utils',
  'S_selfapi',
  'S_vk',
  '__maxAttachments',
  function($scope, $compile, $timeout, S_utils, S_selfapi, S_vk, __maxAttachments) {
    var ctr = this;

    ctr.minDate = new Date();
    ctr.postingDate = new Date();
    ctr.postingTime = (moment().diff(moment().hour(0).minute(0).second(0), 'seconds') + 3600 * 3) % (3600 * 24);

    ctr.maxDate = moment(ctr.minDate).add(45, 'days').toDate();
    ctr.postingUnixTime = S_utils.getCurrentTime();

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
        if (images.length) {
          ctr.attachments.push(images[0]);
        }

        if (!ctr.text || ctr.text === '') {
          ctr.text = S_utils.decodeEntities(data.selection || data.title);
        }
      });

    });

    ctr.dataIsLoaded = true;
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

      var dateUnix = +moment().hour(0).minute(0).second(0).format('X');
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
        S_selfapi.sendPost('-' + ctr.selectedGroup.id, ctr.text, attachments, ctr.postingUnixTime, 0).then(function(resp) {
          console.log(resp.data);
        });
      }
    }

    ctr.addTimer = function() {
      ctr.timerIsEnabled = true;
    }
    ctr.removeTimer = function() {
      ctr.timerIsEnabled = false;
    }

    ctr.attachItem = function(type){
      S_utils.callAttachPhotoDialog().then(function(resp){
        debugger
      });
    }

    return ctr;
  }
]);
