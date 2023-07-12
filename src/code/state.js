// @ts-check

import { randomString, Subject } from "../utils";

export const State = {
  docId: location.search.slice(1),
  public: new Subject(false),
  protected: new Subject(false),
  status: new Subject("loading..."),
  isLogged: new Subject(false),
  hasOwner: new Subject(false),
  isHidden: new Subject(true),
  showOptions: new Subject(false),
  showPassword: new Subject(false),
  language: new Subject("html"),
};
if (!State.docId) location.replace("?" + randomString(6));
else {
  State.docId = State.docId.toLowerCase();
  const language = localStorage && localStorage.getItem(State.docId + "_lang");
  if (language) State.language.pub(language);
}
