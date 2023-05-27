// @ts-check

import { elem, Html } from "../utils";
import { Id } from "./enum";

const components = [elem("h1", {}, ["hello world!"])];

export function initHtml() {
  document.body.id = Id.app;
  Html.get(Id.app).append(...components);
}
