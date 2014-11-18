App.run([
  function() {
    VK.init({apiId: 4631234, onlyWidgets: true});
    VK.Widgets.Comments("vk_comments", {limit: 10, width: "800", attach: "photo,video,link"});
  }
]);