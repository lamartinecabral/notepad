// @ts-check
const puppeteer = require("puppeteer");
const child_process = require("node:child_process");
const { expect, beforeAll, afterAll } = require("@jest/globals");
const { docId, host } = require("./test.env");

describe(`notepad ${host} app`, () => {
  /** @type {child_process.ChildProcess} */ let server;
  /** @type {puppeteer.Browser} */ let browser;
  /** @type {puppeteer.Page} */ let page;
  /** @type {string} */ let baseUrl;
  /** @type {string} */ let currentText;

  beforeAll(async () => {
    if (host === "remote") {
      baseUrl = "https://nopedat.web.app";
    } else {
      server = child_process.spawn("python3", [
        ..."-m http.server 8001 -d ../dist".split(" "),
      ]);
      baseUrl = "http://localhost:8001";
    }
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  });
  afterAll(async () => {
    server?.kill();
    await browser.close();
  });

  describe("main page", () => {
    beforeAll(async () => {
      page = await browser.newPage();
      [currentText] = await Promise.all([
        getNote(docId),
        page.goto(`${baseUrl}/?${docId}`),
      ]);
      await page.waitForFunction(`document.readyState === 'complete'`);
    });
    afterAll(async () => {
      await page.close();
    });

    it("should show a textarea field", async () => {
      await page.waitForSelector("textarea:not([hidden])");
      const textarea = await page.$("textarea");
      expect(await textarea?.isHidden()).toBe(false);
    });

    it("should show the same text as other pages", async () => {
      const textarea = await page.$("textarea");
      const value = await textarea?.evaluate((el) => el.value);
      expect(value).toBe(currentText);
    });

    it("should be editable", async () => {
      const newText = String(Math.random());

      const textarea = await page.$("textarea");
      await textarea?.evaluate((el) => el.select());
      await page.evaluate(
        `document.execCommand("insertText", false, "${newText}")`,
      );

      const status = `document.querySelector('body > div > span')`;
      await page.waitForFunction(`${status}.innerText === 'Saving...'`);
      await page.waitForFunction(`${status}.innerText === ''`);

      const value = await textarea?.evaluate((el) => el.value);
      expect(value).toBe(newText);
    });

    it("should show the new text after reload", async () => {
      let textarea = await page.$("textarea");
      const newText = await textarea?.evaluate((el) => el.value);

      await page.reload();
      await page.waitForSelector("textarea:not([hidden])");

      textarea = await page.$("textarea");
      const value = await textarea?.evaluate((el) => el.value);

      expect(value).toBe(newText);
    });
  });

  describe("code page", () => {
    beforeAll(async () => {
      page = await browser.newPage();
      [currentText] = await Promise.all([
        getNote(docId),
        page.goto(`${baseUrl}/code/?${docId}`),
      ]);
      await page.waitForFunction(`document.readyState === 'complete'`);
    });
    afterAll(async () => {
      await page.close();
    });

    it("should show an editor", async () => {
      await page.waitForFunction(
        `document.querySelector('.cm-editor')?.parentElement.hidden == false`,
      );

      const editor = await page.$(".cm-editor");
      const hidden = await editor?.isHidden();
      expect(hidden).toBe(false);
    });

    it("should show the same text as other pages", async () => {
      const editor = await page.$("div.cm-editor");
      const innerText = await editor?.evaluate((el) => el.innerText);
      expect(innerText).toContain(currentText);
    });
  });

  describe("markdown page", () => {
    beforeAll(async () => {
      page = await browser.newPage();
      [currentText] = await Promise.all([
        getNote(docId),
        page.goto(`${baseUrl}/markdown/?${docId}`),
      ]);
      await page.waitForFunction(`document.readyState === 'complete'`);
    });
    afterAll(async () => {
      await page.close();
    });

    it("should show the same text as other pages", async () => {
      const content = `document.querySelector('div#content')`;
      await page.waitForFunction(`${content}.innerText.length > 0`);
      const innerText = await page?.evaluate(`${content}.innerText`);
      expect(innerText).toBe(currentText);
    });
  });

  describe("qrcode page", () => {
    beforeAll(async () => {
      await setNote(docId, "QRCODE TEST");
      page = await browser.newPage();
      await page.goto(`${baseUrl}/qrcode/?${docId}`);
      await page.waitForFunction(`document.readyState === 'complete'`);
    });
    afterAll(async () => {
      await page.close();
    });

    it("should show an image", async () => {
      await page.waitForSelector("#content > img");
    });
  });

  describe("drive page", () => {
    beforeAll(async () => {
      page = await browser.newPage();
      await page.goto(`${baseUrl}/drive/?${docId}`);
      await page.waitForFunction(`document.readyState === 'complete'`);
    });
    afterAll(async () => {
      await page.close();
    });

    it("should show a list with one item", async () => {
      const loadingMessage = `document.querySelector('#wait')`;
      await page.waitForFunction(`${loadingMessage}.hidden == false`);
      await page.waitForFunction(`${loadingMessage}.hidden == true`);

      const table = await page.$("table#table");
      const childCount = await table?.evaluate((el) => el.children.length);
      expect(childCount).toBe(1);
    });
  });

  describe("play page", () => {
    beforeAll(async () => {
      const source = `<div id="this_div_should_render">play page test</div>`;
      await setNote(docId, source);
      page = await browser.newPage();
      await page.goto(`${baseUrl}/play/?${docId}`);
    });
    afterAll(async () => {
      await page.close();
    });

    it("should render note's content", async () => {
      const iframeDocument = `document.querySelector('iframe')?.contentDocument`;
      await page.waitForFunction(`${iframeDocument}?.body?.children.length`);

      const iframe = await page.$("iframe");
      const contentFrame = await iframe?.contentFrame();
      const div = await contentFrame?.$("div#this_div_should_render");

      const innerText = await div?.evaluate((el) => el.innerText);
      expect(innerText).toBe("play page test");
    });
  });
});

// ======================================
//                UTILS

const sleep = (t) => new Promise((r) => setTimeout(r, t));
const getNote = (docId) =>
  fetch("https://nopedat.netlify.app/api/?id=" + docId).then((a) => a.text());
const setNote = (docId, text) =>
  fetch("https://nopedat.netlify.app/api/?id=" + docId, {
    method: "post",
    body: text,
  });
