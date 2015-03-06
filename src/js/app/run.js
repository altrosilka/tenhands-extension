
var oldTrack = 0;


function track(name) {
  var time = new Date().getTime();
  if (oldTrack) {
    console.log(name, time - oldTrack);
  } else {
    console.log(name);
  }
  oldTrack = time;
}


track('start');
App.run([
  'S_chrome',
  'S_vk',
  'S_google',
  'S_selfapi',
  function(S_chrome, S_vk, S_google, S_selfapi) {
    track('run');

    Highcharts.setOptions({
      global: {
        //timezoneOffset: moment().zone(),
        useUTC: false
      },
      lang: {
        shortMonths: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
      }
    });

    S_chrome.pageDataWatch();

    S_google.init();
  }
]);
