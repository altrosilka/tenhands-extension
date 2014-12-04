angular.module('utilsTools', [])
  .service('S_utils', [
    '$modal',
    '$q',
    '__timelineGroupIntervals',
    function($modal, $q, __timelineGroupIntervals) {
      var service = {};

      service.getUrlParameterValue = function(url, parameterName) {
        "use strict";

        var urlParameters = url.substr(url.indexOf("#") + 1),
          parameterValue = "",
          index,
          temp;

        urlParameters = urlParameters.split("&");

        for (index = 0; index < urlParameters.length; index += 1) {
          temp = urlParameters[index].split("=");

          if (temp[0] === parameterName) {
            return temp[1];
          }
        }

        return parameterValue;
      }

      service.decodeEntities = (function() {
        var element = document.createElement('div');

        function decodeHTMLEntities(str) {
          if (str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
          }

          return str;
        }

        return decodeHTMLEntities;
      })();

      service.getRandomString = function(len) {
        len = len || 10;
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < len; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
      }

      service.callAttachPhotoDialog = function(fromPage, uploadCallbacks) {
        return $modal.open({
          templateUrl: 'templates/modals/attachPhoto.html',
          controller: 'CM_attachPhoto as ctr',
          resolve: {
            pageAttachments: function() {
              return fromPage;
            },
            uploadCallbacks: function() {
              return uploadCallbacks;
            }
          }
        }).result;
      }


      service.callAttachVideoDialog = function(group_id) {
        return $modal.open({
          templateUrl: 'templates/modals/attachVideo.html',
          controller: 'CM_attachVideo as ctr',
          resolve: {
            group_id: function() {
              return group_id;
            }
          }
        }).result;
      }


      service.callVideoPlayerDialog = function(title, videoSrc) {
        return $modal.open({
          templateUrl: 'templates/modals/videoPlayer.html',
          controller: 'CM_videoPlayer as ctr',
          resolve: {
            videoSrc: function() {
              return videoSrc;
            },
            title: function() {
              return title;
            }
          }
        }).result;
      }

      service.getAttachesByType = function(attaches, type) {
        return _.filter(attaches, function(q) {
          return q.type === type;
        });
      }

      service.attachToFancy = function(ats) {
        return _.map(ats, function(image) {
          return {
            href: image.src
          }
        });
      }

      service.loadImage = function(src) {
        var defer = $q.defer();

        var image = new Image();
        image.src = src;
        image.onload = function() {
          defer.resolve(this);
        }
        image.onerror = function() {
          defer.reject(this);
        }

        return defer.promise;
      }

      service.convertUploadedPhotoToAttach = function(photo) {
        return {
          photo: photo,
          width: photo.width,
          clientWidth: photo.width,
          height: photo.height,
          clientHeight: photo.height,
          src: photo.photo_130,
          src_big: photo.photo_807 || photo.photo_604,
          type: 'image'
        }
      }

      service.wrapVideo = function(video) {
        return {
          video: video,
          id: service.getRandomString(16),
          duration: video.duration,
          src: video.photo_320,
          type: 'video'
        }
      }

      service.convertGoogleImageToAttach = function(image) {
        return {
          photo: image.photo,
          id: image.id || service.getRandomString(16),
          width: image.width,
          clientWidth: image.width,
          height: image.height,
          clientHeight: image.height,
          src: image.tbUrl,
          src_big: image.url,
          type: 'image'
        }
      }

      service.createEmptyPoll = function() {
        return {
          id: service.getRandomString(16),
          type: 'poll'
        }
      }


      service.getVideoQuality = function(video) {
        if (video.files.mp4_1080) {
          return '1080';
        }
        if (video.files.mp4_720) {
          return '720';
        }
        if (video.files.mp4_480) {
          return '480';
        }
        if (video.files.mp4_360) {
          return '360';
        }
        if (video.files.mp4_240) {
          return '240';
        }
      }

      service.getCurrentTime = function() {
        return Math.floor(new Date().getTime() / 1000);
      }

      service.sortAttachments = function(attaches) {
        var priority = ['image', 'video', 'doc', 'audio', 'poll'];
        return _.sortBy(attaches, function(attach) {
          var i = _.findIndex(priority, function(q) {
            return q === attach.type;
          });
          if (i !== -1) {
            return i;
          } else {
            return 0;
          }
        });
      }

      service.getAttachmentsString = function(attaches) {
        var ret = [];
        _.forEach(attaches, function(attach) {
          switch (attach.type) {
            case "image":
              {
                ret.push('photo' + attach.owner_id + '_' + attach.id);
                break;
              }
            case "video":
              {
                ret.push('video' + attach.video.owner_id + '_' + attach.video.id);
                break;
              }
            case "poll":
              {
                ret.push('poll' + attach.owner_id + '_' + attach.id);
                break;
              }
          }
        });

        return ret.join(',');
      }

      service.remapForTimeline = function(items) {
        var raz, q;
        _.forEach(items, function(item) {
          q = item.date;
          raz = q % __timelineGroupIntervals;
          if (raz / __timelineGroupIntervals > 0.5) {
            q += __timelineGroupIntervals - raz;
          } else {
            q -= raz;
          }
          item.groupDate = q;
        });

        var groupped = _.groupBy(items, function(item) {
          return item.groupDate;
        });
        var series = _.map(groupped, function(val, i) {
          return [i * 1000, val.length];
        });

        _.sortBy(series, function(item) {
          return item[0];
        });

        var max = _.max(series, function(e) {
          return e[1];
        })[1];

        var stackedSeries = [];

        for (var i = 0; i < max; i++) {
          var arr = [];
          _.forEach(series, function(e) {
            arr.push([e[0], (e[1] > i) ? 1 : 0]);
          });
          stackedSeries.push({
            data: arr
          });
        }

        return {
          max: max,
          series: stackedSeries
        };
      }

      return service;
    }
  ]);
