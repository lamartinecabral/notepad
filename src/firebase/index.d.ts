import * as thisModule from "./firebase";

declare global {
  var _firebase: typeof thisModule;
}

export {};
