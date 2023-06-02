// @ts-check

import { Subject } from "../utils";

/** @typedef {{id: string, text: string, protected?: string, public?: boolean}} Doc */

export const State = {
  /** @type {Subject<boolean>} */ // @ts-ignore
  isLogged: new Subject(null),
  signupMode: new Subject(false),
  /** @type {Doc[]} */ // @ts-ignore
  docs: [],
  /** @type {Subject<string>} */ // @ts-ignore
  message: new Subject("Loading..."),
};
