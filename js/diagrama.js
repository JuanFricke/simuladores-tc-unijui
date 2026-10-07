// diagrama.js — diagrama de estados em SVG, layout e estilo proprios.
// Nos em circulo, estado atual em mostarda, aceitacao em anel duplo,
// rejeicao com borda vermelha. Sem dependencias.
"use strict";

function desenharDiagrama(svgId, def, estadoAtual, rotuloAresta) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  svg.innerHTML = "";
  const estados = def.estados || [];
  const n = estados.length;
  const W = 620, H = n > 4 ? 340 : 280;
  const cx = W / 2, cy = H / 2 + 10;
  const raioOrbita = Math.min(230, 70 + n * 28);
  const R = 30;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.width = "100%";
  svg.style.height = H + "px";

  const pos = {};
  estados.forEach((e, i) => {
    const ang = (-90 + (360 * i) / n) * (Math.PI / 180);
    pos[e] = { x: cx + raioOrbita * Math.cos(ang), y: cy + raioOrbita * 0.72 * Math.sin(ang) };
  });

  function el(nome, attrs, texto) {
    const o = document.createElementNS(NS, nome);
    for (const k in attrs) o.setAttribute(k, attrs[k]);
    if (texto !== undefined) o.textContent = texto;
    svg.appendChild(o);
    return o;
  }
  el("defs", {}).innerHTML =
    `<marker id="setaD" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">` +
    `<path d="M0,0 L8,4.5 L0,9 Z" fill="#1e4d3b"/></marker>`;

  // Agrupa arestas por (origem, destino).
  const grupos = new Map();
  (def.transicoes || []).forEach((t) => {
    const k = t.de + "→" + t.para;
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(t);
  });

  grupos.forEach((lista, k) => {
    const [de, para] = k.split("→");
    const A = pos[de], B = pos[para];
    if (!A || !B) return;
    const rotulos = lista.slice(0, 4).map(rotuloAresta);
    if (lista.length > 4) rotulos.push(`+${lista.length - 4}…`);
    if (de === para) {
      // self-loop: arco acima do no.
      el("path", {
        d: `M ${A.x - 16} ${A.y - R + 4} C ${A.x - 26} ${A.y - 62}, ${A.x + 26} ${A.y - 62}, ${A.x + 16} ${A.y - R + 4}`,
        fill: "none", stroke: "#1e4d3b", "stroke-width": 1.6, "marker-end": "url(#setaD)"
      });
      rotulos.forEach((r, i) => el("text", {
        x: A.x, y: A.y - R - 34 - (rotulos.length - 1 - i) * 12,
        "text-anchor": "middle", "font-size": 10.5, "font-family": "Consolas,monospace", fill: "#444"
      }, r));
    } else {
      const dx = B.x - A.x, dy = B.y - A.y;
      const d = Math.hypot(dx, dy) || 1;
      const x1 = A.x + (dx / d) * R, y1 = A.y + (dy / d) * R;
      const x2 = B.x - (dx / d) * (R + 3), y2 = B.y - (dy / d) * (R + 3);
      el("line", { x1, y1, x2, y2, stroke: "#1e4d3b", "stroke-width": 1.6, "marker-end": "url(#setaD)" });
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const nx = -dy / d, ny = dx / d; // normal p/ afastar o rotulo
      rotulos.forEach((r, i) => el("text", {
        x: mx + nx * 16, y: my + ny * 16 - (rotulos.length - 1 - i) * 12,
        "text-anchor": "middle", "font-size": 10.5, "font-family": "Consolas,monospace", fill: "#444"
      }, r));
    }
  });

  // Nos por cima das arestas.
  estados.forEach((e) => {
    const p = pos[e];
    const atual = e === estadoAtual;
    const aceita = (def.aceita || []).includes(e);
    const rejeita = (def.rejeita || []).includes(e);
    if (e === def.inicial) {
      el("path", { d: `M ${p.x - R - 26} ${p.y} l 20 -8 v 16 Z`, fill: "#1e4d3b" });
      el("text", { x: p.x - R - 30, y: p.y + 4, "text-anchor": "end", "font-size": 10, fill: "#6b6f61" }, "início");
    }
    el("circle", {
      cx: p.x, cy: p.y, r: R,
      fill: atual ? "#f6e3a1" : "#fffdf6",
      stroke: rejeita ? "#b3402c" : "#1e4d3b", "stroke-width": atual ? 3 : 2
    });
    if (aceita) el("circle", { cx: p.x, cy: p.y, r: R - 6, fill: "none", stroke: "#1f7a3d", "stroke-width": 1.6 });
    el("text", {
      x: p.x, y: p.y + 5, "text-anchor": "middle",
      "font-size": 13, "font-weight": "bold", "font-family": "Consolas,monospace", fill: "#22271f"
    }, e);
  });
}

function rotuloArestaMT(t) { return `${t.le}/${t.escreve},${(t.move || "D").toUpperCase()}`; }
function rotuloArestaDP(t) {
  const s = (t.simbolo ?? "") === "" ? "ε" : t.simbolo;
  const f = (v) => (v ?? "*") === "" ? "∅" : (v ?? "*");
  return `${s},${f(t.topo1)},${f(t.topo2)}`;
}

if (typeof module !== "undefined" && module.exports) module.exports = { desenharDiagrama };
