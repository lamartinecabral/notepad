// @ts-check

import { initEventListeners, initStateListeners } from "./control";
import { initCss } from "./css";
import { app } from "./refs";
import { initHtml } from "./html";
import { initDocListener } from "./service";

initHtml();
initCss();
initStateListeners();
initEventListeners();
initDocListener();

app().hidden = false;
