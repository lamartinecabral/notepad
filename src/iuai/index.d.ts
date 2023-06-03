declare type Tags = keyof HTMLElementTagNameMap;
declare type Elem<T extends Tags> = HTMLElementTagNameMap[T];
declare type EvTypes = keyof HTMLElementEventMap;
declare type Ev<T extends EvTypes> = HTMLElementEventMap[T];
export declare class Html {
    static get<T extends Tags = "main">(id: string): Elem<T>;
    static getChild<T extends Tags = "main">(id: string): Elem<T>;
    static getParent<T extends Tags = "main">(id: string): Elem<T>;
}
export declare class Tag {
    static get<T extends Tags>(tag: T, id: string): Elem<T>;
    static getChild<T extends Tags>(tag: T, id: string): Elem<T>;
    static getParent<T extends Tags>(tag: T, id: string): Elem<T>;
}
export declare function elem<T extends Tags, W extends HTMLElement | string>(tag: T, attributes?: Partial<Elem<T>>, children?: W[]): HTMLElementTagNameMap[T];
export declare function css<T extends Partial<CSSStyleDeclaration>>(selector: string, properties: T): string;
export declare function createStyle(): CSSStyleSheet;
export declare class Events {
    static listen<W extends HTMLElement, T extends EvTypes>(element: W, eventType: T, handler: (ev: Ev<T>) => void): () => void;
}
export {};
