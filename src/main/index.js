// @ts-check

import { initEventListeners, initStateListeners } from "./control";
import { initCss } from "./css";
import { Id } from "./refs";
import { initHtml } from "./html";
import { elem } from "iuai";
import { initAuthListener, initDocListener } from "./service";

initHtml();
initCss();
initStateListeners();
initEventListeners();
initDocListener();
initAuthListener();

elem.get(Id.app).hidden = false;
