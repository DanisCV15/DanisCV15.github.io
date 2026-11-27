// Buscador y filtro de la portada.
// Busca primero en las palabras clave de cada tarjeta y, en cuanto carga el índice de
// Pagefind, también en el texto completo de los laboratorios. Sin JavaScript se ven todos.
const search = document.querySelector("#search");
const system = document.querySelector("#system");
const countEl = document.querySelector("#count");
const emptyEl = document.querySelector("#empty");
const cards = [...document.querySelectorAll(".card")];
const techButtons = [...document.querySelectorAll(".tech[data-tecnica]")];
const techChip = document.querySelector("#filtro-tecnica");
let activeTech = null; // técnica ATT&CK elegida en la matriz

const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
const page = (url) => url.replace(/^\//, "").replace(/(\.html)?$/, ".html");

// Pagefind también devuelve coincidencias aproximadas («xyzzy» acaba resaltando «-X»).
// Solo se aceptan si alguna palabra resaltada comparte al menos 3 letras iniciales
// (o la palabra entera, si es más corta) con alguna palabra buscada.
const clean = (s) => norm(s).replace(/[^a-z0-9]/g, "");
function relevant(query, excerpt) {
  const terms = norm(query).split(/\s+/).map(clean).filter(Boolean);
  const marks = [...excerpt.matchAll(/<mark>(.*?)<\/mark>/g)].map((m) => clean(m[1]));
  return marks.some((mark) =>
    terms.some((term) => {
      const need = Math.min(3, term.length);
      let i = 0;
      while (i < mark.length && i < term.length && mark[i] === term[i]) i++;
      return i >= need;
    })
  );
}

let pagefindLoad; // promesa única: el índice se carga y configura una sola vez
let textHits = new Map(); // página → fragmento del texto donde aparece la búsqueda
let lastQuery = "";

function loadPagefind() {
  pagefindLoad ??= import(/* @vite-ignore */ "/pagefind/pagefind.js")
    .then(async (pf) => {
      await pf.options({ excerptLength: 18 });
      await pf.init();
      return pf;
    })
    .catch(() => false); // sin índice: se sigue filtrando por palabras clave
  return pagefindLoad;
}

function render() {
  const query = norm(search.value.trim());
  let count = 0;
  for (const card of cards) {
    const href = card.getAttribute("href");
    const inKeywords = norm(card.dataset.search || "").includes(query);
    const excerpt = query && !inKeywords ? textHits.get(href) : undefined;
    const inTech = !activeTech || (card.dataset.tecnicas || "").split(" ").includes(activeTech);
    const match =
      (inKeywords || excerpt !== undefined) &&
      inTech &&
      (!system.value || card.dataset.system === system.value);
    card.hidden = !match;
    if (match) count++;

    let hit = card.querySelector(".hit");
    if (excerpt) {
      if (!hit) {
        hit = document.createElement("span");
        hit.className = "hit";
        card.querySelector(".tags").before(hit);
      }
      hit.innerHTML = "…" + excerpt + "…"; // Pagefind devuelve el texto escapado con <mark>
    } else if (hit) {
      hit.remove();
    }
  }
  countEl.textContent = count + " laboratorio" + (count === 1 ? "" : "s");
  emptyEl.hidden = count !== 0;
}

async function onInput() {
  const query = search.value.trim();
  lastQuery = query;
  if (query.length < 2) {
    textHits = new Map();
    render();
    return;
  }
  render();
  const pf = await loadPagefind();
  if (!pf) return;
  const result = await pf.debouncedSearch(query, {}, 200);
  if (result === null || query !== lastQuery) return; // llegó otra búsqueda después
  const data = await Promise.all(result.results.slice(0, 40).map((r) => r.data()));
  if (query !== lastQuery) return;
  textHits = new Map(
    data.filter((d) => relevant(query, d.excerpt)).map((d) => [page(d.url), d.excerpt])
  );
  render();
}

function setTech(id) {
  activeTech = id;
  for (const b of techButtons) b.setAttribute("aria-pressed", String(b.dataset.tecnica === id));
  if (techChip) {
    techChip.hidden = !id;
    if (id) {
      const b = techButtons.find((x) => x.dataset.tecnica === id);
      techChip.querySelector("b").textContent = `${id} · ${b.querySelector(".tech-name").textContent}`;
    }
  }
  render();
}

for (const b of techButtons) {
  b.addEventListener("click", () => {
    const id = b.dataset.tecnica === activeTech ? null : b.dataset.tecnica;
    setTech(id);
    if (id) document.querySelector("#laboratorios").scrollIntoView();
  });
}
techChip?.querySelector("button").addEventListener("click", () => setTech(null));

search.addEventListener("input", onInput);
search.addEventListener("focus", loadPagefind, { once: true });
system.addEventListener("change", render);
onInput();
