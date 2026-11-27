// Visor de capturas: amplía la imagen sin salir de la página.
// Flechas para pasar de una a otra y Escape para cerrar. Sin JavaScript, el enlace
// abre la captura en una pestaña nueva como antes.
(() => {
  const links = [...document.querySelectorAll(".article figure > a")];
  if (!links.length || !window.HTMLDialogElement) return;

  const dialog = document.createElement("dialog");
  dialog.className = "visor";
  dialog.setAttribute("aria-label", "Captura ampliada");
  dialog.innerHTML = `
    <figure>
      <img alt="">
      <figcaption><span class="visor-text"></span><span class="visor-count"></span></figcaption>
    </figure>
    <button type="button" class="visor-close" aria-label="Cerrar">✕</button>
    <button type="button" class="visor-prev" aria-label="Captura anterior">←</button>
    <button type="button" class="visor-next" aria-label="Captura siguiente">→</button>`;
  document.body.append(dialog);

  const img = dialog.querySelector("img");
  const text = dialog.querySelector(".visor-text");
  const counter = dialog.querySelector(".visor-count");
  const prev = dialog.querySelector(".visor-prev");
  const next = dialog.querySelector(".visor-next");
  let current = 0;

  function show(i) {
    current = (i + links.length) % links.length;
    const link = links[current];
    const thumb = link.querySelector("img");
    const caption = link.parentElement.querySelector("figcaption");
    img.src = link.getAttribute("href");
    img.alt = thumb.alt;
    text.textContent = caption ? caption.textContent : thumb.alt;
    counter.textContent = links.length > 1 ? `${current + 1} / ${links.length}` : "";
    prev.hidden = next.hidden = links.length < 2;
  }

  links.forEach((link, i) =>
    link.addEventListener("click", (e) => {
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; // abrir en pestaña sigue funcionando
      e.preventDefault();
      show(i);
      dialog.showModal();
    })
  );
  prev.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));
  dialog.querySelector(".visor-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close(); // clic fuera de la imagen
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
  dialog.addEventListener("close", () => img.removeAttribute("src"));
})();

// Botón para copiar cada bloque de código.
(() => {
  if (!navigator.clipboard) return;
  for (const pre of document.querySelectorAll(".article pre")) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy";
    button.textContent = "Copiar";
    button.setAttribute("aria-label", "Copiar el código");
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pre.querySelector("code")?.innerText ?? pre.innerText);
        button.textContent = "Copiado";
      } catch {
        button.textContent = "No se pudo copiar";
      }
      setTimeout(() => (button.textContent = "Copiar"), 1800);
    });
    const wrap = document.createElement("div");
    wrap.className = "code-wrap";
    pre.before(wrap);
    wrap.append(pre, button);
  }
})();

// Índice lateral: marca la sección que se está leyendo.
(() => {
  const links = new Map(
    [...document.querySelectorAll(".toc a")].map((a) => [decodeURIComponent(a.hash.slice(1)), a])
  );
  if (!links.size || !("IntersectionObserver" in window)) return;
  const headings = [...document.querySelectorAll(".article h2[id]")].filter((h) => links.has(h.id));
  let current;
  const observer = new IntersectionObserver(
    () => {
      // La sección activa es el último título que ya ha pasado por la parte superior.
      const passed = headings.filter((h) => h.getBoundingClientRect().top < window.innerHeight * 0.3);
      const active = passed[passed.length - 1] ?? headings[0];
      if (active === current) return;
      links.get(current?.id)?.removeAttribute("aria-current");
      links.get(active.id)?.setAttribute("aria-current", "true");
      current = active;
    },
    { rootMargin: "0px 0px -60% 0px", threshold: [0, 1] }
  );
  headings.forEach((h) => observer.observe(h));
})();
