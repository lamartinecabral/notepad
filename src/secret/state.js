// @ts-check

import { Subject } from "../utils";
import { Cache } from "../cache";

export const State = {
  get docId() {
    return localStorage.getItem("_nopedat_secretNote") ?? "";
  },
  set docId(val) {
    localStorage.setItem("_nopedat_secretNote", val);
  },
  status: new Subject("loading..."),
  isHidden: new Subject(true),
  showOptions: new Subject(!localStorage.getItem("_nopedat_secretNote")),
  nightMode: new Subject(Cache.getNightMode()),
};
