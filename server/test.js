// const baseUrl =
//   "https://nohvuuuxjqikdstnqcmo.supabase.co/functions/v1/notepade";
const baseUrl = "http://localhost:8000/functions/v1/notepade";

const request = (url, method, body) => {
  return fetch(url, {
    method,
    ...(method === "POST" ? { body } : {}),
  }).then((res) => res.text());
};

const get = (id) => {
  return request(baseUrl + "/?" + id, "GET");
};

const put = (id, text) => {
  return request(baseUrl + "/?" + id, "POST", text);
};

async function main() {
  const id = "testeee";
  const text = "teste" + Math.random();
  await put(id, text);
  const result = await get(id);
  if (text === result) {
    console.log("Success!");
  } else {
    throw new Error("text and result values should be equal");
  }
}
main();
