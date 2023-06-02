type Tags = keyof HTMLElementTagNameMap;
type Elem<T extends Tags> = HTMLElementTagNameMap[T];

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
