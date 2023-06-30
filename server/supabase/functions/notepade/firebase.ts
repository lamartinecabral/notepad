import type { FirebaseOptions } from "https://esm.sh/firebase@9.23.0/app";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-lite.js";

const strs = [
  "2QfiMzM3QGOmRmNlFDM2QmN0ETNhFWY5cjOiV2d6QTN1QjN5gjNxQDO0oT",
  "MiojIklEcwFmIsICN1UDN2kDO2EDN4QjI6ICZJJXZk5WZTdmbpdWYzNXZt",
  "JCLi02bj5CdvB3cwBXYuQWYwVGdv5WL0JXYtFGbiojI0V2ajVnQldWYy9G",
  "dzJCLiQWYwVGdv5WL0JXYtFGbiojIklEdjVmavJHciwiIt92YuAHchV2ch",
  "JWZylmZuQWYwVGdv5WL0JXYtFGbiojIulWYt9GRoRXdhJCLiAzaXxEcIJW",
  "M4oEem9ULkNkM4dlUuRzZ1cFWIZ3bRlVaCl3UhpXSBJiOikXZLlGchJye",
];

const firebaseConfig = ((str) => {
  return [
    (k: string) =>
      [...new Array(+k[0]).fill("="), ...k.substring(1).split("")]
        .reverse()
        .join(""),
    atob,
    JSON.parse,
  ].reduce((a, b) => b(a), str) as FirebaseOptions;
})(strs.join(""));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function put(id: string, text: string) {
  const docRef = doc(db, "docs", id);
  return updateDoc(docRef, { text }).catch((err) => {
    if (err.code === "not-found") return setDoc(docRef, { text });
    throw err;
  });
}

export function get(id: string) {
  return getDoc(doc(db, "docs", id)).then((snap) => snap.data()?.text);
}
