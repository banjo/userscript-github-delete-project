// ==UserScript==
// @name       github-delete-project
// @namespace  npm/vite-plugin-monkey
// @version    0.0.1
// @author     monkey
// @icon       https://vitejs.dev/logo.svg
// @match      https://github.com/*
// @run-at     document-end
// ==/UserScript==

(function() {
  "use strict";
  const logger = (isDebug) => (statement) => {
    if (isDebug) {
      console.log("%cDEBUG SPA-RUNNER: " + statement, "color: blue");
    }
  };
  function matchWithWildcard(string, matcher) {
    const escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
    return new RegExp(
      "^" + matcher.split("*").map(escapeRegex).join(".*") + "$"
    ).test(string);
  }
  const defaultConfig = {
    timeBetweenUrlLookup: 500,
    urls: [],
    timeoutBeforeHandlerInit: 0,
    runAtStart: true,
    waitForElement: void 0,
    isDebug: false
  };
  const WAIT_FOR_ELEMENT_TIMEOUT = 200;
  const WAIT_FOR_ELEMENT_MAXIMUM_TRIES = 20;
  const run = (handler, config = defaultConfig) => {
    const log = logger(config.isDebug ?? false);
    const runHandler = () => {
      log("Preparing handler...");
      if (config.waitForElement) {
        log("Waiting for element...");
        let tries = 0;
        const element = document.querySelector(config.waitForElement);
        if (!element && tries < WAIT_FOR_ELEMENT_MAXIMUM_TRIES) {
          log("Element not found, trying again...");
          tries++;
          setTimeout(runHandler, WAIT_FOR_ELEMENT_TIMEOUT);
          return;
        }
        if (!element) {
          log("Element not found, giving up...");
          return;
        }
        log("Element found...");
      }
      log("Running handler...");
      setTimeout(handler, config.timeoutBeforeHandlerInit);
      log("Handler done...");
    };
    if (config.runAtStart) {
      log("Running at start...");
      runHandler();
    }
    let lastMatchingPath = null;
    let lastMatchingSearch = null;
    let lastPath = window.location.pathname;
    let lastSearch = window.location.search;
    const runInterval = setInterval(() => {
      var _a;
      const isNewMatchingUrl = lastMatchingPath !== window.location.pathname || lastMatchingSearch !== window.location.search;
      const isNewUrl = lastPath !== window.location.pathname || lastSearch !== window.location.search;
      const isNotInitiated = lastMatchingPath === null || lastMatchingSearch === null;
      const hasUrls = config.urls && config.urls.length > 0;
      const matchesUrl = hasUrls ? (_a = config.urls) == null ? void 0 : _a.some(
        (url) => matchWithWildcard(window.location.href, url)
      ) : true;
      if ((isNewMatchingUrl || isNotInitiated) && matchesUrl) {
        log("New url found, running handler...");
        lastMatchingPath = window.location.pathname;
        lastMatchingSearch = window.location.search;
        runHandler();
      } else if (isNewUrl) {
        lastPath = window.location.pathname;
        lastSearch = window.location.search;
        log("New url found, but does not match...");
      }
    }, config.timeBetweenUrlLookup);
    return () => {
      log("Stopping...");
      clearInterval(runInterval);
    };
  };
  const urls = ["https://github.com/*/settings"];
  run(main, {
    urls,
    isDebug: true
  });
  function main() {
    var _a, _b, _c, _d;
    const renameButton = (_d = (_c = (_b = (_a = document.querySelector("li > details > summary")) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.parentElement) == null ? void 0 : _d.lastElementChild;
    renameButton == null ? void 0 : renameButton.addEventListener("click", onClickHandler);
  }
  function onClickHandler() {
    var _a;
    const name = (_a = document.querySelector(
      "#options_bucket p > strong"
    )) == null ? void 0 : _a.textContent;
    if (!name)
      return;
    const form = document.querySelector("[action*='/delete']");
    const input = form == null ? void 0 : form.querySelector("input[name='verify']");
    const button = form == null ? void 0 : form.querySelector("button");
    if (!form || !input || !button)
      return;
    input.value = name;
    button.disabled = false;
  }
})();
