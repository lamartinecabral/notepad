type Tags = keyof HTMLElementTagNameMap;
type Elem<T extends Tags> = HTMLElementTagNameMap[T];
type EvTypes = keyof HTMLElementEventMap;
type Ev<T extends EvTypes> = HTMLElementEventMap[T];

export class Html {
  static get<T extends Tags = "main">(id: string) {
    return document.getElementById(id) as Elem<T>;
  }
  static getChild<T extends Tags = "main">(id: string) {
    return Html.get(id).children[0] as Elem<T>;
  }
  static getParent<T extends Tags = "main">(id: string) {
    return Html.get(id).parentElement as Elem<T>;
  }
}

export class Tag {
  static get<T extends Tags>(tag: T, id: string) {
    return Html.get(id) as Elem<T>;
  }
  static getChild<T extends Tags>(tag: T, id: string) {
    return Html.get(id).children[0] as Elem<T>;
  }
  static getParent<T extends Tags>(tag: T, id: string) {
    return Html.get(id).parentElement as Elem<T>;
  }
}

function setInlineStyle<
  T extends HTMLElement,
  W extends Partial<CSSStyleDeclaration>
>(element: T, style: W) {
  for (const prop in style) {
    if (prop in element.style) element.style[prop] = style[prop] as string;
    else element.style.setProperty(prop, style[prop] as string);
  }
}

export function elem<T extends Tags, W extends HTMLElement | string>(
  tag: T,
  attributes: Partial<Elem<T>> = {},
  children: W[] = []
) {
  const el = document.createElement(tag);
  for (const attr in attributes) el[attr] = attributes[attr] as any;
  if (attributes.style) setInlineStyle(el, attributes.style);
  for (const child of children) el.append(child);
  return el;
}

export function css<T extends Partial<CSSStyleDeclaration>>(
  selector: string,
  properties: T
) {
  var el = document.createElement("span");
  setInlineStyle(el, properties);
  return selector + " {" + el.style.cssText + "}";
}

export function createStyle() {
  const style = document.createElement("style");
  document.head.append(style);
  return style.sheet as CSSStyleSheet;
}

export class Events {
  static listen<W extends HTMLElement, T extends EvTypes>(
    element: W,
    eventType: T,
    handler: (ev: Ev<T>) => void
  ) {
    element.addEventListener(eventType, handler);
    return () => element.removeEventListener(eventType, handler);
  }
}
