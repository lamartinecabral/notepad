// @ts-check

const [docId, hash] = (document.URL.split("?")[1] || "").split("#");
const State = {docId: docId.toLowerCase(), hash};
export { State };