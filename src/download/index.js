// @ts-check
import { elem, style } from "../iuai";
import * as firebase from "../firebase";

const docId = (location.search.slice(1) || "").toLowerCase();
if (!docId) location.replace("/");

const { db } = firebase.initApp(docId);
const { doc, onSnapshot } = firebase.firestore;

style("*", { fontFamily: "monospace", boxSizing: "border-box" });
style("body", { margin: "0", padding: "0", background: "#fff", color: "#000" });

const container = elem("div", {
  id: "container",
  style: {
    maxWidth: "480px",
    margin: "0 auto",
    padding: "2em 1em",
    textAlign: "center",
  },
});

const heading = elem(
  "h1",
  { style: { marginBottom: "0.5em" } },
  "Download note",
);

const statusMsg = elem(
  "p",
  { id: "status", style: { marginBottom: "1em" } },
  "Loading…",
);

const downloadLink = elem("a", {
  id: "download-link",
  style: {
    display: "none",
    padding: "0.6em 1.4em",
    background: "#0066cc",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    letterSpacing: "0.04em",
    marginTop: "0.5em",
  },
});

const imageWrapper = elem("div", {
  id: "image-wrapper",
  style: { display: "none", marginTop: "0.5em" },
});

const imagePreview = elem("img", {
  id: "image-preview",
  alt: "image preview",
  style: {
    maxWidth: "100%",
    maxHeight: "60vh",
    borderRadius: "6px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    display: "block",
    margin: "1rem auto",
  },
});

const backLink = elem("p", { style: { marginTop: "2em" } }, [
  elem(
    "a",
    {
      href: location.origin + "/?" + docId,
      style: { color: "#0066cc", textDecoration: "underline" },
    },
    "← back to note",
  ),
]);

container.append(heading, statusMsg, downloadLink, imageWrapper, backLink);
imageWrapper.append(imagePreview);
document.body.appendChild(container);

/**
 * Detects if a string is a data URL.
 * @param {string} text
 * @returns {boolean}
 */
function isDataUrl(text) {
  return /^data:[^;]+;base64,/.test(text.trim());
}

/**
 * Returns true if the MIME type is an image type.
 * @param {string} mime
 * @returns {boolean}
 */
function isImageMime(mime) {
  return mime.startsWith("image/");
}

/**
 * Extracts the MIME type from a data URL.
 * @param {string} dataUrl
 * @returns {string}
 */
function mimeFromDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);/);
  return match ? match[1] : "application/octet-stream";
}

/**
 * Returns a file extension for a given MIME type.
 * @param {string} mime
 * @returns {string}
 */
function extFromMime(mime) {
  const map = /** @type {Record<string,string>} */ ({
    "image/svg+xml": "svg",
    "audio/mpeg": "mp3",
    "video/ogg": "ogv",
    "text/plain": "txt",
  });
  return map[mime] || mime.split("/")[1] || "bin";
}

/**
 * Converts a data URL string to a Blob.
 * @param {string} dataUrl
 * @returns {Blob}
 */
function dataUrlToBlob(dataUrl) {
  const mime = mimeFromDataUrl(dataUrl);
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/**
 * Sets up the download anchor for a data URL.
 * @param {string} dataUrl
 */
function setupDataUrlDownload(dataUrl) {
  if (_prevObjectUrl) URL.revokeObjectURL(_prevObjectUrl);
  const mime = mimeFromDataUrl(dataUrl);
  const ext = extFromMime(mime);
  const filename = docId + "." + ext;
  const blob = dataUrlToBlob(dataUrl);
  const url = (_prevObjectUrl = URL.createObjectURL(blob));

  downloadLink.href = url;
  downloadLink.download = filename;
  downloadLink.textContent = "Download " + filename;
  downloadLink.style.display = "inline-block";
  if (isImageMime(mime)) {
    imagePreview.src = url;
    imageWrapper.style.display = "block";
    statusMsg.textContent = "Image detected (" + mime + ")";
  } else {
    imageWrapper.style.display = "none";
    statusMsg.textContent = "File detected (" + mime + ")";
  }
}

/**
 * Sets up the download anchor for plain text content.
 * @param {string} text
 */
function setupTextDownload(text) {
  if (_prevObjectUrl) URL.revokeObjectURL(_prevObjectUrl);
  const blob = new Blob([text], { type: "text/plain" });
  const url = (_prevObjectUrl = URL.createObjectURL(blob));
  const filename = docId + ".txt";
  downloadLink.href = url;
  downloadLink.download = filename;
  downloadLink.textContent = "Download " + filename;
  downloadLink.style.display = "inline-block";
  statusMsg.textContent = "Text note";
}
let _prevObjectUrl = "";

onSnapshot(
  doc(db, "docs", docId),
  function (res) {
    if (res.metadata.hasPendingWrites) return;
    const text = res.exists() ? res.data().text || "" : "";

    if (!text) {
      statusMsg.textContent = "Note is empty.";
      downloadLink.style.display = "none";
      return;
    }

    if (isDataUrl(text)) {
      setupDataUrlDownload(text.trim());
    } else {
      setupTextDownload(text);
    }
  },
  function (err) {
    console.error(err);
    statusMsg.textContent = "Error: " + err.message;
    downloadLink.style.display = "none";
  },
);
