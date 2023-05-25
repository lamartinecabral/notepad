// @ts-check

import { initEventListeners, initStateListeners } from "./control";
import { initCss } from "./css";
import { Id } from "./enum";
import { Html, initHtml } from "./html";
import { initAuthListener, initDocListener } from "./service";

initHtml();
initCss();
initStateListeners();
initEventListeners();
initDocListener();
initAuthListener();

Html.get(Id.app).hidden = false;
