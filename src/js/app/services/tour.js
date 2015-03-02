angular.module('App')
  .service('S_tour',
    function(localStorageService, $timeout) {
      var service = {};

      var tour;

      var tourKeyName = 'tour.base';

      service.init = function(force) {

        var q = localStorageService.get(tourKeyName) || {};

        if (!force && q.complete){
          return;
        }

        tour = new Shepherd.Tour({
          defaults: {
            classes: 'shepherd-theme-arrows',
            scrollTo: true
          }
        });

        tour.on('complete', function(){
          localStorageService.set(tourKeyName, {
            complete: 1
          });
        });

        tour.addStep('step1', {
          text: 'В настойках можно отредактировать шаблон сбора информации со страницы',
          attachTo: '[data-step="settings"]',
          buttons: [{
            text: 'Ясно',
            action: tour.next
          }]
        });

        tour.addStep('step3', {
          text: 'Можно свернуть окошко расширения и увидеть на заднем плане сайт. Чтобы скопировать что-то, например',
          attachTo: '[data-step="resizer"] bottom',
          buttons: [{
            text: 'Хорошо',
            action: tour.next
          }]
        });

        tour.addStep('step4', {
          text: 'Закрыть расширение можно этим крестиком',
          attachTo: '[data-step="remover"]',
          buttons: [{
            text: 'Все понятно',
            action: tour.next
          }]
        });

        if ($('body').find('[data-step="shareSetName"]').length) {
          tour.addStep('step5', {
            text: 'Всегда можно выбрать нужный для публикации набор',
            attachTo: '[data-step="shareSetName"] bottom',
            buttons: [{
              text: 'Все понятно',
              action: tour.next
            }]
          });
        }

        if ($('body').find('[data-step="channel"]').length) {
          tour.addStep('step5', {
            text: 'Это канал в социальной сети. Для каждого канала своё окно для публикации',
            attachTo: '[data-step="channel"] top',
            buttons: [{
              text: 'Понятно',
              action: tour.next
            }]
          });
        }

        if ($('body').find('[data-step="changeChannelVisibility"]').length) {
          tour.addStep('changeChannelVisibility', {
            text: 'Можно не публиковать запись в некоторые каналы',
            attachTo: '[data-step="changeChannelVisibility"]',
            buttons: [{
              text: 'Дальше',
              action: tour.next
            }]
          });
        }

        if ($('body').find('[data-step="publicNow"]').length) {
          tour.addStep('step5', {
            text: 'Записи можно разместить сейчас',
            attachTo: '[data-step="publicNow"] top',
            buttons: [{
              text: 'Так-так...',
              action: tour.next
            }]
          });
          tour.addStep('step5', {
            text: 'А можно и запланировать их на будущее',
            attachTo: '[data-step="publicLater"] top',
            buttons: [{
              text: 'Это хорошо',
              action: tour.next
            }]
          });
          tour.addStep('step5', {
            text: 'Можно закрыть окно расширения сразу после успешной публикации',
            attachTo: '[data-step="closeAfterPosting"] top',
            buttons: [{
              text: 'ОК',
              action: tour.next
            }]
          });
          tour.addStep('step5', {
            text: 'Послать все записи в социальные сети',
            attachTo: '[data-step="publicButton"] top',
            buttons: [{
              text: 'ОК',
              action: tour.next
            }]
          });
        }

         tour.start();
      }



      return service;
    }
  );
