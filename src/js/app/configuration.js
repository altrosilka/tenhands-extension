angular.module('config', [])
  .constant('__api', {
    baseUrl: '@@apiServer',
    paths: { 
      saveExtensionVkToken: 'accounts/vkontakte/add',
      getShortUrl: 'utils/shortUrl',
      getAssignKey: 'user/getAssignKey',
      media: 'media',
      getOverrideKey: 'groups/getOverrideKey',
      getPostsInPeriod: 'posts/getInPeriod',
      createPost: 'posts',
      getUserInfo: 'users/getCurrentUser',
      signIn: 'auth/signIn',
      sets: 'sets',
      getSetChannels: 'sets/getChannels',
      getTable: 'table'
    }
  })
  .constant('__postMessagePrepend', 'Ejiw9494WvweejgreWCEGHeeE_FF_')
  .constant('__maxPollVariants', 10)
  .constant('__maxAttachments', 9)
  .constant('__maxImageWidth', 800)
  .constant('__twitterConstants',{
    maxSymbols: 140,
    linkLen: 22,
    mediaLen: 23 
  })