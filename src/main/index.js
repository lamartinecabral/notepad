// @ts-check

import { initEventListeners, initStateListeners } from "./control";
import { initCss } from "./css";
import { app } from "./refs";
import { initHtml } from "./html";
import { initAuthListener, initCache, initDocListener } from "./service";

initHtml();
initCss();
initStateListeners();
initEventListeners();
initCache();
initDocListener();
initAuthListener();

app().hidden = false;
