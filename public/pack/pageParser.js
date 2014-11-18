;
(function() {
  var frame;

  var imagesColection = document.getElementsByTagName('img');
  var images = [],
    image;
  for (var i = 0, l = imagesColection.length; i < l; i++) {
    image = imagesColection.item(i);
    images.push({
      alt: image.alt,
      clientHeight: image.clientHeight,
      clientWidth: image.clientWidth,
      width: image.width,
      height: image.height,
      title: image.title,
      src: image.src
    });
  }


  var data = {
    images: images,
    title: document.title,
    url: document.location.href,
    imageSrc: getImageFromMeta()
  }

  function getImageFromMeta() {
    var dom;

    dom = document.querySelector('meta[property="og:image"]');
    if (dom !== null) return dom.getAttribute('content');

    dom = document.querySelector('link[rel="image_src"]');
    if (dom !== null) return dom.getAttribute('href');

    dom = document.querySelector('meta[name="twitter:image"]');
    if (dom !== null) return dom.getAttribute('content');

    return dom;
  }

  function sendToIframe() {
    frame = document.getElementById('smm-transport-ekniERgebe39EWee');
    if (frame === null) {
      console.log('not ');
      setTimeout(sendToIframe, 300);
    } else {
      setTimeout(function() {
        frame.contentWindow.postMessage(data, 'chrome-extension://njbifdlkgjknapheokjpilhjpemjbmnk')
      }, 500);
    }
  }
  console.log(JSON.stringify(data));
  sendToIframe();
})();
