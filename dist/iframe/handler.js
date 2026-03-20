// @ts-check
!(function () {
  var docHtml = "";
  var renderCount = 0;

  /** @param {string} text */
  function setContent(text) {
    renderCount++;
    docHtml = text;
    var iframe = getIframe();

    /** @type {[number, number] | undefined} */
    var xy;
    if (iframe) {
      var wind = iframe.contentWindow;
      if (wind) xy = [wind.scrollX, wind.scrollY];
      iframe.remove();
    }

    iframe = document.createElement("iframe");
    iframe.src =
      "/iframe/" + location.search + (renderCount === 1 ? "" : location.hash);
    document.body.appendChild(iframe);
    setTimeout(addIframeHashChangeListener, 10);

    if (xy)
      iframe.addEventListener("load", function () {
        setTimeout(() => {
          var wind = iframe && iframe.contentWindow;
          xy && wind && wind.scrollTo(...xy);
        }, 10);
      });
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
      return (setHeight(), setHeight);
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

  // @ts-ignore
  return (window["notepadIframe"] = thisModule);
})();
