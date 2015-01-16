angular.module('App').directive('channel', [function() {
  return {
    scope:{
      channel: "=",
      parsedText: "=",
      parsedImage: "=",
      pageAttachments: "=",
      postChannelAgain: "&"
    },
    templateUrl: 'templates/directives/channel.html',
    controller: 'CD_channel as channel_ctr',
    link: function($scope, $element) { 
      
    }
  }
}]);
 