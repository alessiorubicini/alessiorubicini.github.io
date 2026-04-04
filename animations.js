// Page animation handler + stagger
(function () {
  var navType = performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0] && performance.getEntriesByType("navigation")[0].type;
  if (navType === "navigate" || navType === "reload") {
    document.body.classList.add("animate-appear");
    setTimeout(function () {
      document.body.classList.add("did-appear");
    }, 5000);
  }

  function initStagger() {
    var roots = document.querySelectorAll("header.vcard, aside, main > section, .legal-links");
    roots.forEach(function (root) {
      root.querySelectorAll("[data-appear]").forEach(function (el, i) {
        el.style.setProperty("--delay", String(i));
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStagger);
  } else {
    initStagger();
  }
})();
