// @ts-check

const docId = location.search.slice(1);
const cache =
  (!!docId && "localStorage" in window && window.localStorage) || null;

export const Cache = {
  /** @type {() => string | null} */
  getText() {
    return cache && cache.getItem(docId + "_text");
  },
  /** @type {(val: string | null) => void} */
  setText(val) {
    if (!val) cache && cache.removeItem(docId + "_text");
    else cache && cache.setItem(docId + "_text", String(val));
  },

  /** @type {() => boolean} */
  getNightMode() {
    return (cache && cache.getItem("nightMode")) === "true";
  },
  /** @type {(val: boolean) => void} */
  setNightMode(val) {
    cache && cache.setItem("nightMode", String(val));
  },
};
