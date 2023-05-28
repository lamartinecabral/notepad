// @ts-check

import { Subject } from "../utils";

export const State = {
  /** @type {Subject<boolean>} */ // @ts-ignore
  isLogged: new Subject(null),
  /** @type {Subject<string[]>} */ // @ts-ignore
  docs: new Subject([]),
  signupMode: new Subject(false),
};
