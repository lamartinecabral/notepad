// @ts-check

import { randomString } from './utils.js'

export const State = {
  /** @type {{public?: boolean, protected?: boolean, login?: boolean}} */
  obj: {},
  aux: {},
  docId: (document.URL.split("?")[1] || "").split("#")[0],

  diff: function () {
    for (let i in State.obj)
      if (State.obj[i] !== State.aux[i])
        return (State.aux = Object.assign({}, State.obj)), true;
    return false;
  },
};

if (!State.docId) location.replace("?" + randomString());
else State.docId = State.docId.toLowerCase();
console.log(State.docId);
