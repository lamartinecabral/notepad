// @ts-check

/**
 * @typedef {keyof typeof import('./model').Languages} Languages
 * @typedef {import('prettier')} PrettierStandalone
 * @typedef {{estree: import('prettier/plugins/estree.js'), babel: import('prettier/plugins/babel.js'), html: import('prettier/plugins/html.js'), postcss: import('prettier/plugins/postcss.js')}} PrettierPlugins
 */

/** @type {(url: string) => Promise<any>} */
const loadPkg = (() => {
  const cache = new Map();
  return (url) => {
    if (cache.has(url)) return cache.get(url);
    cache.set(
      url,
      new Promise((res, rej) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = res;
        script.onerror = rej;
        document.body.appendChild(script);
      }),
    );
    return cache.get(url);
  };
})();

const pkgPrefix = "https://cdn.jsdelivr.net/npm/prettier@3.3.2";
const pkg = {
  standalone: pkgPrefix + "/standalone.js",
  estree: pkgPrefix + "/plugins/estree.js",
  babel: pkgPrefix + "/plugins/babel.js",
  html: pkgPrefix + "/plugins/html.js",
  postcss: pkgPrefix + "/plugins/postcss.js",
};

/** @type {Map<Languages, {parser: string, plugins: Array<Exclude<keyof typeof pkg, 'standalone'>>}>} */
const parsers = new Map();

parsers.set("html", {
  parser: "html",
  plugins: ["html", "estree", "babel", "postcss"],
});
parsers.set("javascript", {
  parser: "babel",
  plugins: ["estree", "babel"],
});
parsers.set("jsx", {
  parser: "babel",
  plugins: ["estree", "babel"],
});
parsers.set("css", {
  parser: "css",
  plugins: ["postcss"],
});

/**
 * @param {string} text
 * @param {Languages} language
 * @param {{cursorOffset?: number, requirePragma?: boolean}} [options]
 * @returns {Promise<import('prettier').CursorResult | null>}
 */
export const format = async (text, language, options) => {
  const parser = parsers.get(language);
  if (!parser) return null;

  try {
    await Promise.all([
      loadPkg(pkg.standalone),
      ...parser.plugins.map((name) => loadPkg(pkg[name])),
    ]);
  } catch (e) {
    console.error(e);
    return null;
  }

  /** @type {{prettier: PrettierStandalone, prettierPlugins: PrettierPlugins}} */ // @ts-ignore
  const { prettier, prettierPlugins } = window;

  const formatOptions = {
    parser: parser.parser,
    plugins: parser.plugins.map((name) => prettierPlugins[name]),
    requirePragma: !!options?.requirePragma,
  };

  if (options?.cursorOffset !== undefined)
    return prettier
      .formatWithCursor(text, {
        ...formatOptions,
        cursorOffset: options?.cursorOffset,
      })
      .then((res) => (res.formatted === text ? null : res));
  else
    return prettier
      .format(text, formatOptions)
      .then((formatted) =>
        formatted === text ? null : { formatted, cursorOffset: undefined },
      );
};
