import * as thisModule from "./marked.mjs";

declare global {
  var marked: typeof thisModule;
}

export {};
