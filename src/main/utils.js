// @ts-check

/** @param {number} length */
export function randomString(length) {
  let str = Math.floor(Math.random() * 36 ** length).toString(36);
  while (str.length < length) str = "0" + str;
  return str;
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
    /** @type {(callback: (value: T)=>void)=>()=>boolean} */
    this.sub = function (callback) {
      if (this.value !== undefined) callback(this.value);
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
 * @param {string} tag
 * @param {Partial<HTMLElement | HTMLInputElement | HTMLAnchorElement | {}>} [attributes]
 * @param {Array<HTMLElement | string>} [children]
 * @param {Array<{type: keyof HTMLElementEventMap, handler: (ev: Event)=>any}>} [listeners]
 * */
export function elem(tag, attributes = {}, children = [], listeners = []) {
  var el = document.createElement(tag);
  for (var attr in attributes) el[attr] = attributes[attr];
  for (var child of children) el.append(child);
  for (var entry of listeners) el.addEventListener(entry.type, entry.handler);
  return el;
}
