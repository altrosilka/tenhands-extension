;
(function() {
  var frame;

  frame = document.getElementById('smm-transport-ekniERgebe39EWee');
  if (frame !== null) {
    return
  }

  var imagesColection = document.getElementsByTagName('img');
  var images = [],
    image, res;
  for (var i = 0, l = imagesColection.length; i < l; i++) {
    image = imagesColection.item(i);
    //console.log(image, image.src)

    if (image.hidden || image.naturalHeight < 100 || image.naturalWidth < 100 || image.width < 150 || image.height < 150) {
      continue;
    }
    res = image.width / image.height;

    if (res > 4 || res < 0.25) {
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
    description: getDescription(),
    url: document.location.href,
    imageSrc: getImageFromMeta(),
    h1: getByQuery('h1'),
    h2: getByQuery('h2'),
    h3: getByQuery('h3')
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

  function getByQuery(q) {
    var dom;

    dom = document.querySelector(q);
    if (dom !== null) return dom.innerHTML.replace(/(<([^>]+)>)/ig, "").replace(/(\n)+/g, '\n');

    return;
  }

  function getDescription() {
    var dom;

    dom = document.querySelector('meta[name="description"]');
    if (dom !== null) return dom.getAttribute('content');

    dom = document.querySelector('meta[name="Description"]');
    if (dom !== null) return dom.getAttribute('content');

    return '';
  }

  function sendToIframe() {
    frame = document.getElementById('smm-transport-ekniERgebe39EWee');
    if (frame === null) {
      setTimeout(sendToIframe, 100);
    } else {
      setTimeout(function() {
        frame.contentWindow.postMessage(data, 'chrome-extension://' + chrome.runtime.id);
      }, 100)
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


  //console.log(JSON.stringify(data));
  sendToIframe();
})();
