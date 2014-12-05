angular.module('config', [])
  .constant('__vkAppId', 4639658)
  .constant('__api', {
    baseUrl: 'http://api.smm.dev/',
    paths: {
      saveExtensionToken: 'user/saveExtensionToken',
      getAssignKey: 'user/getAssignKey',
      uploadPhoto: 'posts/uploadImage',
      sendPost: 'posts/create',
      getOverrideKey: 'groups/getOverrideKey'
    }
  })
  .constant('__maxPollVariants', 10)
  .constant('__maxAttachments', 9)
  .constant('__timelinePeriods', {
    grouppingInterval: 30 * 60,
    minOffset: -5 * 3600,
    maxOffset: 24 * 3600,
  })