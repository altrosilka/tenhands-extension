App.run([
  '__vkAppId',
  'S_chrome',
  'S_vk',
  'S_google',
  'S_selfapi',
  function(__vkAppId, S_chrome, S_vk, S_google, S_selfapi) {

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

    S_chrome.getVkToken().then(function(token) {

      S_vk.setToken(token);
      S_vk.testRequest(function() {
        console.log(1);
      }, function() {
        console.log(2);
      });
    }, function() {
      chrome.runtime.sendMessage({
        vk_auth: true
      }, function(response) {
        console.log(response.farewell);
      });
    });
  }
]);
