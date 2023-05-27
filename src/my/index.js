import { initEventListeners, initStateListeners } from "./control";
import { initCss } from "./css";
import { initHtml } from "./html";
import { initAuthListener } from "./service";

initHtml();
initCss();
initStateListeners();
initEventListeners();
initAuthListener();
