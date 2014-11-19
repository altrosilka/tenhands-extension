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

