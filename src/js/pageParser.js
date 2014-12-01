;
(function() {
  var frame;

  var imagesColection = document.getElementsByTagName('img');
  var images = [],
    image, res;
  for (var i = 0, l = imagesColection.length; i < l; i++) {
    image = imagesColection.item(i);
    //console.log(image, image.src)
 
    if (image.src === 'http://www.lookatme.ru/mag/live/experience-news/209627-trailer') {
      //debugger
    }
    if (image.hidden || image.naturalHeight < 100 || image.naturalWidth < 100 || image.width < 150 || image.height < 150) {
      continue;
    }
    res = image.width / image.height;

    if (res > 4 || res < 0.25){
      continue;
    }
    images.push({
      alt: image.alt,
      clientHeight: image.clientHeight,
      clientWidth: image.clientWidth,
      width: image.width,
      height: image.height,
      title: image.title,
      src: image.src,
      src_big: image.src,
      type: 'image'
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
        frame.contentWindow.postMessage(data, 'chrome-extension://njbifdlkgjknapheokjpilhjpemjbmnk');
      }, 500);
    }
  }


  /* selection */
  var selection = window.getSelection();
  if (selection && selection.type !== 'None') {
    var range = selection.getRangeAt(0);
    if (range) {
      var div = document.createElement('div');
      div.appendChild(range.cloneContents());
      data.selection = div.innerHTML;
    }
  }


  console.log(JSON.stringify(data));
  sendToIframe();
})();
