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

var id = 'smm-layout-ekniERgebe39EWee';
var d = document.getElementById(id);
if (d === null) {
  d = document.createElement("div");
  d.setAttribute("id", id);
  d.setAttribute("style", "background-color: rgba(0,0,0,0.5); width: 100%; height: 100%; position: fixed; bottom: 0px; left: 0px;transition:0.4s; z-index: 99999899999898988899;");
  var mover = document.createElement("div");
  mover.setAttribute("style", "width:20px;height:20px;position:absolute;z-index:3;background-color:#ff0;right:36px;top:10px;");
  d.appendChild(mover);
  var closer = document.createElement("div");
  closer.setAttribute("style", "width:20px;height:20px;position:absolute;z-index:3;background-color:#f00;right:10px;top:10px;");
  d.appendChild(closer);
  var iframe = document.createElement("iframe");
  iframe.src = chrome.extension.getURL("pages/createPost.html");
  iframe.setAttribute("style", "width:100%;height:100%;z-index:1;position:relative;");
  iframe.setAttribute("id", "smm-transport-ekniERgebe39EWee");
  iframe.setAttribute("frameborder", "0");
  d.appendChild(iframe);
  document.body.appendChild(d);

  mover.addEventListener('click', function() {
    var q = d.getAttribute('data-small-view');
    if (q === null) {
      d.setAttribute('data-small-view', 'true');
      d.style.height = "50%";
    } else {
      d.removeAttribute('data-small-view');
      d.style.height = "100%";
    }
  });

  closer.addEventListener('click', function() {
    d.style.transform = 'scale(0.9)';
    d.style.opacity = '0';
    d.style.visibility = 'hidden';
  });
} else {
  if (window.getComputedStyle(d).visibility === 'hidden'){
    d.style.transform = 'scale(1)';
    d.style.opacity = '1';
    d.style.visibility = 'visible';
  }
}

