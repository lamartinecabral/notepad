import * as thisModule from "./codemirror";

declare global {
  var codemirror: typeof thisModule;
}

export {};
