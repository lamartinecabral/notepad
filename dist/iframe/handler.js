// @ts-check
!(function () {
  var docHtml = "";
  var renderCount = 0;
  function setContent(text) {
    renderCount++;
    docHtml = text;
    var iframe = document.querySelector("iframe");
    if (iframe) iframe.remove();
    iframe = document.createElement("iframe");
    iframe.src =
      "../iframe/" + location.search + (renderCount === 1 ? "" : location.hash);
    document.body.appendChild(iframe);
    setTimeout(addIframeHashChangeListener, 10);
  }

  window.addEventListener("message", function (ev) {
    if (ev.data === "notepadIframeReady") {
      var iframe = getIframe();
      if (!iframe || !iframe.contentWindow) return;
      iframe.contentWindow.postMessage({
        type: "notepadIframeSource",
        source: docHtml,
      });
      if (renderCount === 1) {
        setTimeout(function () {
          if (!iframe || !iframe.contentWindow) return;
          iframe.contentWindow.location.hash = location.hash;
        }, 100);
      }
    }
  });

  window.addEventListener(
    "resize",
    (function () {
      function setHeight() {
        document.body.style.height = window.innerHeight + "px";
      }
      return setHeight(), setHeight;
    })(),
  );

  window.addEventListener("hashchange", function () {
    var iframe = getIframe();
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.location.hash = location.hash;
  });

  function addIframeHashChangeListener() {
    var iframe = getIframe();
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.addEventListener("hashchange", function () {
      if (!iframe || !iframe.contentWindow) return;
      location.hash = iframe.contentWindow.location.hash;
    });
  }

  /** @returns {HTMLIFrameElement | undefined} */
  function getIframe() {
    return document.getElementsByTagName("iframe")[0];
  }

  var thisModule = {};
  thisModule.setContent = setContent;

  return (window["notepadIframe"] = thisModule);
})();
