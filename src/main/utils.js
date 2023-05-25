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
 * @param {HTMLElement} element
 * @param {Partial<CSSStyleDeclaration | {}>} style
 */
function setInlineStyle(element, style) {
  for (var prop in style) {
    if (prop in element.style) element.style[prop] = style[prop];
    else element.style.setProperty(prop, style[prop]);
  }
}

/**
 * @typedef {'div' | 'img' | 'textarea' | 'a' | 'input'} SomeTags
 * @typedef {HTMLElementTagNameMap[SomeTags]} SomeElements
 */

/**
 * @param {keyof HTMLElementTagNameMap} tag
 * @param {Partial<SomeElements | {}>} [attributes]
 * @param {Array<string | HTMLElement>} [children]
 * @typedef {keyof HTMLElementEventMap} EventType
 * @param {Partial<Record<EventType, (ev: any) => any>>} [listenerMap]
 * */
export function elem(tag, attributes = {}, children = [], listenerMap = {}) {
  var el = document.createElement(tag);
  for (var attr in attributes) el[attr] = attributes[attr];
  // @ts-ignore
  setInlineStyle(el, attributes.style);
  for (var child of children) el.append(child);
  for (var type in listenerMap) el.addEventListener(type, listenerMap[type]);
  return el;
}

/**
 * @param {string} selector
 * @param {Partial<CSSStyleDeclaration | {}>} properties
 */
export function css(selector, properties) {
  var el = document.createElement("span");
  setInlineStyle(el, properties);
  return selector + " {" + el.style.cssText + "}";
}

/** @returns {CSSStyleSheet} */
export function createStyle() {
  const style = document.createElement("style");
  document.head.append(style);
  // @ts-ignore
  return style.sheet;
}
