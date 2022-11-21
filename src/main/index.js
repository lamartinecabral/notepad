// @ts-check

import { Server } from "./server.js";
import { View } from "./view.js";
import { State } from "./state.js";

// @ts-ignore
window.View = View;

function initApp() {
  console.log("initApp");
  document.body.hidden = false;

  Server.liveContent(State.docId);
  Server.liveAuth();
  View.Action.theme();
}

initApp();
