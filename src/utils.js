// @ts-check

/** @param {number} length */
export function randomString(length) {
  let str = Math.floor(Math.random() * 36 ** length).toString(36);
  while (str.length < length) str = "0" + str;
  return str;
}

/** @type {(str: string, maxLen: number)=>string} */
export function trunc(str, maxLen) {
  return String(str).length > maxLen
    ? String(str).substring(0, maxLen - 1) + "…"
    : str;
}

/** @template T */
export class Subject {
  /** @param {T} [value] */
  constructor(value) {
    // @ts-ignore
    /** @type {T} */ this.value = value;
    let c = 0;
    const cb = {};
    /** @type {(value: T)=>void} */
    this.pub = function (value) {
      if (value === this.value) return;
      this.value = value;
      for (const i in cb) cb[i](value);
    };
    /** @type {(callback: (value: T)=>void, opts?: {latest?: boolean})=>()=>boolean} */
    this.sub = function (callback, opts) {
      const latest = opts?.latest ?? true;
      if (latest && this.value !== undefined) callback(this.value);
      const i = c++;
      cb[i] = callback;
      return () => delete cb[i];
    };
  }
}

/**
 * @template T
 * @param {T extends Function ? T : never} handler
 * @param {number} timeout
 * @returns {(...a: Parameters<T>)=>void}
 * */
export function debounce(handler, timeout) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => {
      handler(...args);
    }, timeout);
  };
}

/**
 * @template T
 * @param {T extends Function ? T : never} handler
 * @returns {(timeout: number, ...a: Parameters<T>)=>void}
 * */
export function delayLatest(handler) {
  let id;
  return (timeout, ...args) => {
    clearTimeout(id);
    id = setTimeout(() => {
      handler(...args);
    }, timeout);
  };
}

/** @type {<T>(val: T | null | undefined) => T} */
export function assert(val) {
  if (val === null || val === undefined) throw new Error("invalid value");
  return val;
}

export const NoteHistory = {
  /** @type {Record<string,string>} */
  get entries() {
    return JSON.parse(localStorage.getItem("__NoteHistory") || "{}");
  },
  set entries(val) {
    localStorage.setItem("__NoteHistory", JSON.stringify(val));
  },
  add: function (id) {
    const entries = this.entries;
    entries[id] = new Date().toISOString();
    this.entries = entries;
  },
  remove: function (id) {
    const entries = this.entries;
    delete entries[id];
    this.entries = entries;
  },
};

export const Img = {
  /**
   * convert a file to a src base64 string.
   * Usage example: input file to img element
   * @param {File} file File to be processed
   * @returns {Promise<string>}
   */
  toDataURL(file) {
    return new Promise((resolve) => {
      let fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.readAsDataURL(file);
    });
  },

  /** @returns {Promise<string>} */
  resize(dataURL, maxSize) {
    return new Promise((resolve) => {
      let img = document.createElement("img");
      img.src = dataURL;
      img.onload = () => {
        let multiplier = Math.min(maxSize / Math.max(img.height, img.width), 1);

        let canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * multiplier);
        canvas.height = Math.round(img.height * multiplier);
        let ctx = canvas.getContext("2d");

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg"));
      };
    });
  },
};
