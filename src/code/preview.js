import { Html } from "./html";
import { State } from "./state";

let isWorkerReady = false;
const codeWorker = new Worker("/js/code.worker.js");

codeWorker.onmessage = (ev) => {
  if (ev.data === "codeWorkerReady") {
    isWorkerReady = true;
  }
};

export const getParsedCode = async () => {
  if (!isWorkerReady) throw new Error("codeWorker unavailable");
  return await new Promise((resolve) => {
    codeWorker.postMessage({
      type: "codeWorkerMessage",
      value: { language: State.language.value, source: Html.text },
    });
    isWorkerReady = false;
    codeWorker.onmessage = (ev) => {
      if ("type" in ev.data && ev.data.type === "codeWorkerMessage") {
        isWorkerReady = true;
        resolve(ev.data.value);
      }
    };
  });
};
