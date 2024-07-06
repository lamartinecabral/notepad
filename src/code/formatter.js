// @ts-check

/**
 * @typedef {keyof typeof import('./model').Languages} Languages
 * @typedef {import('prettier')} PrettierStandalone
 * @typedef {{estree: import('prettier/plugins/estree.js'), babel: import('prettier/plugins/babel.js'), html: import('prettier/plugins/html.js'), postcss: import('prettier/plugins/postcss.js'), markdown: import('prettier/plugins/markdown.js')}} PrettierPlugins
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
const formatOptions = new Map();

formatOptions.set("html", {
  parser: "html",
  plugins: ["html", "estree", "babel", "postcss"],
});
formatOptions.set("javascript", {
  parser: "babel",
  plugins: ["estree", "babel"],
});
formatOptions.set("css", {
  parser: "css",
  plugins: ["postcss"],
});

/**
 * @param {string} text
 * @param {Languages} language
 */
export const format = async (text, language) => {
  const options = formatOptions.get(language);
  if (!options) return text;

  try {
    await Promise.all([
      loadPkg(pkg.standalone),
      ...options.plugins.map((name) => loadPkg(pkg[name])),
    ]);
  } catch (e) {
    console.error(e);
    return text;
  }

  /** @type {{prettier: PrettierStandalone, prettierPlugins: PrettierPlugins}} */ // @ts-ignore
  const { prettier, prettierPlugins } = window;

  return prettier.format(text, {
    parser: options.parser,
    plugins: options.plugins.map((name) => prettierPlugins[name]),
  });
};
