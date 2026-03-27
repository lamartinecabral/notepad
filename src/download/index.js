// @ts-check
import { elem, style } from "../iuai";
import * as firebase from "../firebase";
import { Cache } from "../cache";

// this page is completely AI generated

const docId = (location.search.slice(1) || "").toLowerCase();
if (!docId) location.replace("/");

const { db } = firebase.initApp(docId);
const { doc, onSnapshot } = firebase.firestore;

style("*", { fontFamily: "monospace", boxSizing: "border-box" });
style("body", { margin: "0", padding: "0", background: "#fff", color: "#000" });
style(":root", {
  "--bg": "#fff",
  "--fg": "#000",
  "--border": "#ccc",
  "--accent": "#0066cc",
});

style("body.dark", {
  "--bg": "#181b20",
  "--fg": "#abb2bf",
  "--border": "#444",
  "--accent": "#61afef",
});

style("body", { background: "var(--bg)", color: "var(--fg)" });

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

const noteId = elem(
  "p",
  {
    style: { color: "var(--accent)", marginBottom: "2em", fontWeight: "bold" },
  },
  docId,
);

const statusMsg = elem(
  "p",
  { id: "status", style: { marginBottom: "1em" } },
  "Loading…",
);

const downloadLink = elem("a", {
  id: "download-link",
  style: {
    display: "inline-block",
    padding: "0.6em 1.4em",
    background: "var(--accent)",
    color: "var(--bg)",
    textDecoration: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    letterSpacing: "0.04em",
    marginTop: "0.5em",
  },
});

const backLink = elem("p", { style: { marginTop: "2em" } }, [
  elem(
    "a",
    {
      href: location.origin + "/?" + docId,
      style: { color: "var(--accent)", textDecoration: "underline" },
    },
    "← back to note",
  ),
]);

container.append(heading, noteId, statusMsg, downloadLink, backLink);
document.body.appendChild(container);

if (Cache.getNightMode()) {
  document.body.classList.add("dark");
}

/**
 * Detects if a string is a data URL.
 * @param {string} text
 * @returns {boolean}
 */
function isDataUrl(text) {
  return /^data:[^;]+;base64,/.test(text.trim());
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
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
    "image/tiff": "tiff",
    "image/avif": "avif",
    "audio/mpeg": "mp3",
    "audio/ogg": "ogg",
    "audio/wav": "wav",
    "audio/webm": "webm",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/ogg": "ogv",
    "application/pdf": "pdf",
    "application/zip": "zip",
    "application/json": "json",
    "text/plain": "txt",
    "text/html": "html",
    "text/css": "css",
    "text/csv": "csv",
  });
  return map[mime] || mime.split("/")[1] || "bin";
}

/**
 * Sets up the download anchor for a data URL.
 * @param {string} dataUrl
 */
function setupDataUrlDownload(dataUrl) {
  const mime = mimeFromDataUrl(dataUrl);
  const ext = extFromMime(mime);
  const filename = docId + "." + ext;
  downloadLink.href = dataUrl;
  downloadLink.download = filename;
  downloadLink.textContent = "Download " + filename;
  downloadLink.hidden = false;
  statusMsg.textContent = "File detected (" + mime + ")";
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
  downloadLink.hidden = false;
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
      downloadLink.hidden = true;
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
    downloadLink.hidden = true;
  },
);
