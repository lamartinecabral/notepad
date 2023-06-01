// @ts-check

import { Subject } from "../utils";

/** @typedef {{id: string, text: string, protected?: string, public?: boolean}} Doc */

export const State = {
  /** @type {Subject<boolean>} */ // @ts-ignore
  isLogged: new Subject(null),
  signupMode: new Subject(false),
  /** @type {Doc[]} */ // @ts-ignore
  docs: [],
  /** @type {Subject<Doc>} */ // @ts-ignore
  addDoc: new Subject(null),
  /** @type {Subject<Doc>} */ // @ts-ignore
  removeDoc: new Subject(null),
};
