angular.module('config',[])
  .constant('__vkAppId', 4639658)
  .constant('__api', {
    baseUrl: 'http://api.smm.dev/',
    paths: {
      saveExtensionToken: 'user/saveExtensionToken',
      getAssignKey: 'user/getAssignKey',
      uploadPhoto: 'posts/uploadImage',
      sendPost: 'posts/create'
    }
  })


  