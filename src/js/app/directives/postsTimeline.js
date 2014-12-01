angular.module('App').directive('postsTimeline', [function() {
  return {
    scope: {
      data: '=postsTimeline'
    },
    link: function($scope, $element, $attrs) {
      var chart, $canvas;

      var _color = '#090';

      $scope.$watch('data', function(data) {
        if (!data) return;
        
        chart = $element.highcharts({
          chart: {
            type: 'column'
          },
          title: {
            text: null
          },
          xAxis: {
            categories: data.categories
          },
          yAxis: {
            min: 0,
            lineWidth: 0,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            lineColor: 'transparent',
            title: {
              text: null
            },
            labels: {
              enabled: false
            },
            minorTickLength: 0,
            tickLength: 0,
            stackLabels: {
              enabled: true,
              style: {
                fontSize: '22px',
                bottom: '10px',
                color: (Highcharts.theme && Highcharts.theme.textColor) || '#000'
              }
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            enabled: false,
            formatter: function() {
              return '<b>' + this.x + '</b><br/>' +
                this.series.name + ': ' + this.y + '<br/>' +
                'Total: ' + this.point.stackTotal;
            }
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              animation: false,
              dataLabels: {
                enabled: false
              }
            },
            series: {
              states: {
                hover: {
                  enabled: false
                }
              }
            }
          },
          series: series
        });
        chart.find('text:contains("Highcharts.com")').remove();
      });
    }
  }
}])