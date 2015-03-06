angular.module('utilsTools', [])
  .service('S_utils', [
    '$modal',
    '$q',
    '$templateCache',
    '$compile',
    '$rootScope',
    '__twitterConstants',
    function($modal, $q, $templateCache, $compile, $rootScope, __twitterConstants) {
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

      service.showTablePopup = function(setId) {
        return $modal.open({
          templateUrl: 'templates/modals/table.html',
          controller: 'CM_table as ctr',
          size: 'lg',
          resolve: {
            setId: function() {
              return setId;
            }
          }
        }).result;
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
          type: 'image'
        }
      }

      service.createEmptyPoll = function() {
        return {
          id: service.getRandomString(16),
          type: 'poll'
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

      service.findFirstAttach = function(attaches) {
        if (!attaches || attaches.length === 0) {
          return;
        }

        var priority = ['image', 'video', 'poll'];
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

      service.getFailDescription = function(data) {
        var q;

        if (data.network === 'tw' && data.error && data.error.code && data.error.code === 187) {
          return "Статус повторяется";
        }

        if (data.network === 'fb') {
          if (data.data.error && data.data.error.code && data.data.error.code == 506) {
            return "Сообщение повторяется";
          }

           if (data.data.error && data.data.error.code && data.data.error.code == 1) {
            return "Нужно перепривязать аккаунт";
          }
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

          if (!channel_ids || (channel_ids && _.indexOf(channel_ids, channel.id) !== -1)) {
            postInfo.push({
              channel_id: channel.id,
              text: channel.text,
              attachments: channel.attachments
            });
          }
        });
        return postInfo;
      }

      service.disableProgress = function(channels) {
        _.forEach(channels, function(channel) {
          channel.inprogress = false;
          channel.complete = false;
          channel.error = false;
        });
      }

      service.trackProgress = function(channels, info) {
        var q;
        _.forEach(info, function(_channel) {
          _.find(channels, function(channel) {
            return channel.id === _channel.channel_id;
          }).inprogress = true;
        });
      }

      service.getMaxTextLength = function(type, attachments, text) {
        switch (type) {
          case 'tw':
            {
              var lc = service.getLinksFromText(text);
              var len = __twitterConstants.maxSymbols;

              _.forEach(lc, function(link) {
                len += (link.length - __twitterConstants.linkLen);
              });

              if (attachments.length) {
                len -= __twitterConstants.mediaLen;
              }

              return len;
            }
          case 'ig':
            {
              return 2200;
            }
        }
        return 10000;
      }

      service.getLinksFromText = function(text) {
        text = text || '';
        var links = [];
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        text.replace(urlRegex, function(url) {
          links.push(url);
        });
        return links;
      }

      service.attachmentsLimitReached = function(network, channelsLenth) {
        switch (network) {
          case 'ig':
            {
              return channelsLenth >= 1;
              break;
            }
          case 'fb':
            {
              return channelsLenth >= 1;
              break;
            }
          case 'tw':
            {
              return channelsLenth >= 4;
              break;
            }
          case 'vk':
            {
              return channelsLenth >= 9;
              break;
            }
        }
      }

      service.unixTo = function(time, format) {
        return moment(time, 'X').format(format);
      }

      service.escapeRegex = function(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      }

      return service;
    }
  ]);
