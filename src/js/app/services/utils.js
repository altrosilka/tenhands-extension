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




      service.getFilters = function() {
        return [{
          name: "none",
          title: "Без фильтра"
        }, {
          name: "bw",
          title: "ЧБ",
          info: {
            hueSaturation: [0, -1]
          }
        }, {
          name: "blur",
          title: "Blur",
          info: {
            triangleBlur: [25]
          }
        }, {
          name: "lensBlur",
          title: "Линза",
          info: {
            lensBlur: [15, 0.54, 3.141592653589793]
          }
        }, {
          name: "darkAround",
          title: "Dark Around",
          info: {
            brightnessContrast: [-0.2, -0.3],
            vignette: [0.01, 0.6]
          }
        }, {
          name: "dark",
          title: "Dark",
          info: {
            brightnessContrast: [-0.8, -0.9]
          }
        }, {
          name: "light",
          title: "Light",
          info: {
            brightnessContrast: [0.35, -0.3]
          }
        }];
      }

      service.getFilterByName = function(name) {
        return _.find(service.getFilters(), function(q) {
          return q.name === name;
        });
      }

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

      service.showInfoModal = function(title, html) {
        return $modal.open({
          templateUrl: 'templates/modals/infoModal.html',
          controller: 'CM_infoModal as ctr',
          size: 'sm',
          resolve: {
            html: function() {
              return html;
            },
            title: function() {
              return title;
            }
          }
        }).result;
      }

      service.showPaymentRequestModal = function(resp) {
        return $modal.open({
          templateUrl: 'templates/modals/paymentRequest.html',
          controller: 'CM_paymentRequest as ctr',
          size: 'sm',
          resolve: {
            resp: function() {
              return resp;
            }
          }
        }).result;
      }

      service.showEditImagePopup = function(image) {
        return $modal.open({
          templateUrl: 'templates/modals/editImage.html',
          controller: 'CM_editImage as ctr',
          size: 'lg',
          resolve: {
            image: function() {
              return image;
            }
          }
        }).result;
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

      service.configurePostInfo = function(channels, channel_ids, image) {
        var postInfo = [];
        _.forEach(channels, function(channel) {
          if (channel.disabled || channel.complete || channel.inprogress) return;

          if (!channel_ids || (channel_ids && _.indexOf(channel_ids, channel.id) !== -1)) {
            postInfo.push({
              channel_id: channel.id,
              text: channel.text,
              attachments: [image]
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
          q = _.find(channels, function(channel) {
            return channel.id === _channel.channel_id;
          });
          q.inprogress = true;
          q.error = false;
        });
      }

      service.getMaxTextLengthInChannels = function(channels, attachments, text) {
        var min = Infinity,
          q;
        _.forEach(channels, function(channel) {
          q = service.getMaxTextLength(channel.network, attachments, text);
          if (q < min) {
            min = q;
          }
        })
        return min;
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

              if (attachments || (attachments && attachments.length)) {
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

      service.attachmentsLimitReached = function(channelsLenth) {
        return channelsLenth >= 1;
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
