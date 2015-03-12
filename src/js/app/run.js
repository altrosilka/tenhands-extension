App.run(
  function($rootScope, S_chrome, S_google, S_selfapi) {

    /*Highcharts.setOptions({
      global: {
        //timezoneOffset: moment().zone(),
        useUTC: false
      },
      lang: { 
        shortMonths: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
      }
    });*/

    S_chrome.pageDataWatch();

    S_google.init();




  }
);
