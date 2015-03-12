angular.module('App').controller('CM_table',
  function($scope, $compile, $timeout, $modalInstance, S_selfapi, setId) {
    var ctr = this;


    $scope.eventSources = [];

    $scope.eventMouseover = function(date, jsEvent, view) {

    };

    $scope.eventRender = function(event, element, view) {
      event.title = event.replace('\n', ' ').replace('<br>', ' ');
      element.attr({
        'tooltip': event.title,
        'tooltip-append-to-body': true,
        'tooltip-placement': 'left',
        'tooltip-trigger': 'mouseenter',
        'tooltip-animation': false
      });
      $compile(element.parent())($scope.$new());
    };

 

    $scope.uiConfig = {
      calendar: {

        height: 550,
        editable: false,
        header: {
          left: 'today prev,next',
          center: 'title',
          right: 'month,agenda10Days,agendaWeek,agenda3Days'
        },
        dayNames: ['Воскресение', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        eventMouseover: $scope.eventMouseover,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender,
        viewRender: function(view) {

        },
        slotEventOverlap: false,
        timeFormat: 'h:mm',
        columnFormat: {
          day: 'dddd',
          week: 'ddd, D MMMM',
          month: 'ddd'
        },
        allDaySlot: false,
        slotDuration: '00:30:00',
        timeFormat: 'H(:mm)',
        defaultTimedEventDuration: '00:30:00',
        eventLimit: true, // for all non-agenda views
        scrollTime: '09:00:00',
        views: {
          month: {

          },
          agenda10Days: {
            type: 'agenda',
            duration: {
              days: 10
            },
            buttonText: '10 дней',
            columnFormat: 'ddd, DD MMM'
          },
          agenda3Days: {
            type: 'agenda',
            duration: {
              days: 3
            },
            buttonText: '3 дня',
            columnFormat: 'ddd, D MMMM'
          }
        },
        timezone: 'local',
        dayClick: function(date, jsEvent, view) {
          if (view.name === 'month') {
            view.calendar.changeView('agenda3Days');
            view.calendar.gotoDate(date.add(-1, 'days'));
          } else {
            $modalInstance.close(date);
          }
        }
      }
    };


    $timeout(function() {
      $scope.eventSources.push(function(start, end, timezone, callback) {
        var from = start.utc().format('X');
        var to = end.utc().format('X');

        S_selfapi.getTable(from, to, setId).then(function(resp) {
          callback(resp.data.data.table);
        });
      })
      $(window).trigger('resize');
    });

    return ctr;
  }
);
