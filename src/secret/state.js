// @ts-check

import { Subject } from "../utils";
import { Cache } from "../cache";

let _docId = "";

export const State = {
  get docId() {
    if (State.remember)
      return (_docId = localStorage.getItem("_nopedat_secretNote") ?? "");
    else return _docId;
  },
  set docId(val) {
    _docId = val;
    if (State.remember) localStorage.setItem("_nopedat_secretNote", val);
  },
  status: new Subject("loading..."),
  isHidden: new Subject(true),
  showOptions: new Subject(!localStorage.getItem("_nopedat_secretNote")),
  nightMode: new Subject(Cache.getNightMode()),
  get remember() {
    return localStorage.getItem("_nopedat_rememberSecretNote") !== "false";
  },
  set remember(val) {
    localStorage.setItem("_nopedat_rememberSecretNote", String(val));
    if (val) {
      localStorage.setItem("_nopedat_secretNote", _docId);
    } else {
      localStorage.removeItem("_nopedat_secretNote");
    }
  },
};

if (State.remember) _docId = localStorage.getItem("_nopedat_secretNote") ?? "";

if (location.hash) {
  State.docId = location.hash.slice(1);
  location.hash = "";
}
