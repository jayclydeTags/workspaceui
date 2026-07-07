// No-flash theme init. Loaded as a parser-blocking external script from the
// static HTML <body> so it runs before paint. External (src) rather than inline
// so React 19 doesn't warn about a script rendered inside a component.
// Keep the "theme" storage key in sync with src/components/theme-provider.tsx.
(function () {
  try {
    var e = localStorage.getItem("theme") || "system";
    var d =
      e === "dark" ||
      (e === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    var r = document.documentElement;
    r.classList.toggle("dark", d);
    r.style.colorScheme = d ? "dark" : "light";
  } catch (e) {}
})();
