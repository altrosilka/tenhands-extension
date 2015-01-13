angular.module('utilsTools', [])
  .service('S_utils', [
    '$modal',
    '$q',
    '$templateCache',
    '$compile',
    '$rootScope',
    '__timelinePeriods',
    function($modal, $q, $templateCache, $compile, $rootScope, __timelinePeriods) {
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

      service.convertUploadedPhotoToAttach = function(media_id, media_url, info) {
        return {
          media_id: media_id,
          width: info.width,
          clientWidth: info.width,
          height: info.height,
          clientHeight: info.height,
          src: media_url,
          src_big: media_url,
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
          src: image.url,
          src_big: image.url,
          type: 'photo'
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
        var priority = ['photo', 'video', 'doc', 'audio', 'poll'];
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
            case "photo":
              {
                ret.push('photo' + attach.photo.owner_id + '_' + attach.photo.id);
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

      service.formatterTimelineTooltip = function(x, groupped) {
        var info = groupped[Math.round(x / 1000)];

        if (!info) {
          return 'Не можем получить данные :(';
        }

        var scope = $rootScope.$new();
        scope.posts = info;

        scope.getAttachments = function(post) {
          if (post.copy_history) {
            return post.copy_history[0].attachments;
          } else {
            return post.attachments;
          }
        }

        scope.getText = function(post) {
          return post.text || post.copy_history[0].text;
        }

        var el = $compile($templateCache.get('templates/other/timeLinePostTooltip.html'))(scope);
        scope.$digest();
        return el[0].outerHTML;
      }

      service.findFirstAttach = function(attaches) {
        if (!attaches || attaches.length === 0) {
          return;
        }

        var priority = ['photo', 'video', 'poll'];
        _.sortBy(attaches, function(attach) {
          var i = _.findIndex(priority, function(q) {
            return q === attach.type;
          });
          if (i !== -1) {
            return i;
          } else {
            return 0;
          }
        });

        return attaches[0];
      }

      service.roundToHour = function(time) {
        var inter = 3600;
        var raz = time % inter;
        return time - raz;
      }

      service.itemsInInterval = function(items, min, max) {
        return _.filter(items, function(item) {
          return item.date >= min && item.date <= max;
        });
      }

      service.remapForTimeline = function(items, min, max) {
        var raz, q, inter = __timelinePeriods.grouppingInterval;
        var itemsFilterd = [];
        _.forEach(items, function(item) {
          q = item.date;
          if (q > max || q < min) {
            return;
          }
          raz = q % inter;
          if (raz / inter > 0.5) {
            q += inter - raz;
          } else {
            q -= raz;
          }
          item.groupDate = q;
          itemsFilterd.push(item);
        });

        var groupped = _.groupBy(itemsFilterd, function(item) {
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
            data: arr,
            stacking: "normal"
          });
        }

        return {
          max: max,
          series: stackedSeries,
          groupped: groupped
        };
      }

      service.serverPostsToVkLike = function(posts) {
        return _.map(posts, function(q) {
          return {
            text: q.message,
            date: q.publish_date,
            type: 'own_server',
            attachments: q.attachments
          }
        });
      }

      service.getFailDescription = function(data) {
        var q;

        if (data.network === 'tw' && data.error && data.error.code && data.error.code === 187) {
          return "Статус повторяется";
        }

        if (data.network === 'ig') {
          if (data.error && data.error.code === 'notFull') {
            return "Необходимо прикрепить изображение"
          }
          if (data.error && data.error.code === 'notMedia') {
            return "Изображение не найдено, повторите загрузку"
          }
          if (data.error && data.error.code === 'notSquared') {
            return "Изображение не квадратное"
          }
        }

        return ((data.error) ? JSON.stringify(data.error) : 'не удалось определить');
      }

      service.configurePostInfo = function(channels, channel_ids) {
        var postInfo = [];
        _.forEach(channels, function(channel) {
          if (channel.disabled || channel.complete || channel.inprogress) return;

          if (!channel_ids || (channel_ids && _.indexOf(channel_ids, channel.id) !== -1 )) {
            postInfo.push({
              channel_id: channel.id,
              text: channel.text,
              attachments: channel.attachments
            });
          }
        });
        return postInfo;
      }

      service.trackProgress = function(channels, info){
        var q;
        _.forEach(info, function(_channel) {
          _.find(channels, function(channel){
            return  channel.id === _channel.channel_id;
          }).inprogress = true;
        });
      }

      service.unixTo = function(time, format) {
        return moment(time, 'X').format(format);
      }

      return service;
    }
  ]);
