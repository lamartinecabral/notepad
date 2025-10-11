import { elem, style } from "../iuai";
import { NoteHistory } from "../utils";

const buildList = () => {
  [...document.getElementsByTagName("table")].forEach((a) => a.remove());

  const list = Object.entries(NoteHistory.entries)
    .map(([id, lastAccess]) => ({ id, lastAccess }))
    .sort((a, b) => -a.lastAccess.localeCompare(b.lastAccess));

  document.body.appendChild(
    elem("table", [
      elem(
        "tr",
        ["id", "last access", ""].map((a) => elem("th", a)),
      ),
      list.map(({ id: docId, lastAccess }) =>
        elem(
          "tr",
          [
            elem("a", { href: location.origin + "/?" + docId }, docId),
            lastAccess,
            elem(
              "button",
              { className: "remove", onclick: () => remove(docId) },
              "remove",
            ),
          ].map((a) => elem("td", [a])),
        ),
      ),
    ]),
  );
};

style("*", { fontFamily: "monospace" });
style("table", {
  border: "0.5px solid black",
  borderSpacing: 0,
  margin: "1em 0",
});
style("td, th", { border: "0.5px solid black", padding: "8px" });
style("button.remove", { opacity: 0 });
style("tr:is(:hover, :has(:focus))", { background: "#eee" });
style("tr:is(:hover, :has(:focus)) button.remove", { opacity: 1 });

function remove(id) {
  if (!confirm(`Remove entry '${id}'?`)) return;
  NoteHistory.remove(id);
  buildList();
}

buildList();
