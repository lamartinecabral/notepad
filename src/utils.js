// @ts-check

/** @param {number | undefined} x */
export function randomString(x = undefined) {
  let str = x && !isNaN(+x) && isFinite(+x)
    ? (+x).toString(36)
    : Math.floor(Math.random() * 36 ** 6).toString(36);
  while (str.length < 6) str = "0" + str;
  return str;
}
