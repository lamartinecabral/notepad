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
