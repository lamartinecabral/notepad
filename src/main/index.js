// @ts-check

import { initEventListeners, initStateListeners } from "./control";
import { Id } from "./enum";
import { Html } from "./html";
import { initAuthListener, initDocListener } from "./service";

initStateListeners();
initEventListeners();
initDocListener();
initAuthListener();

Html.get(Id.app).hidden = false;
