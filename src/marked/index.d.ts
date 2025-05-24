import * as thisModule from "./marked";

declare global {
  var marked: typeof thisModule;
}

export {};
