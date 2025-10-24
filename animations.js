// Page animation handler
// Triggers fade-in animations on page load (both initial navigation and reloads)
(function() {
  const navType = performance?.getEntriesByType("navigation")?.[0]?.type;
  if (navType === "navigate" || navType === "reload") {
    document.body.classList.add('animate-appear');

    setTimeout(() => {
      document.body.classList.add('did-appear');
    }, 5000);
  }
})();

