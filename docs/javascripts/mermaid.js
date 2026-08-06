async function renderMermaid() {
  const scheme = document.body.getAttribute("data-md-color-scheme");

  mermaid.initialize({
    startOnLoad: false,
    theme: scheme === "slate" ? "dark" : "default"
  });

  await mermaid.run({
    nodes: document.querySelectorAll(".mermaid")
  });
}

document$.subscribe(() => {
  void renderMermaid();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void renderMermaid();
  }, { once: true });
} else {
  void renderMermaid();
}
