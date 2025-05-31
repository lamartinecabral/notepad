// @ts-check
import { randomString } from "../utils";

const [docId, hash] = (document.URL.split("?")[1] || "").split("#");
const State = { docId: docId.toLowerCase(), hash };
if (!State.docId) location.replace("?" + randomString(6));
export { State };
