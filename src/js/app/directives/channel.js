angular.module('App').directive('channel', [function() {
  return {
    scope:{
      channel: "=",
      parsedText: "=",
      pageAttachments: "=",
      postChannelAgain: "&"
    },
    templateUrl: 'templates/directives/channel.html',
    controller: 'CD_channel as channel_ctr',
    link: function($scope, $element) { 
      
    }
  }
}]);
 