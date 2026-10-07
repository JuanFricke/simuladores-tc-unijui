// util.js — funcoes partilhadas pelos dois simuladores (sem dependencias).
// Nomes e estrutura originais; nao derivados da referencia.
"use strict";

function lerTextoArea(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function mostrarFaixa(id, texto, classe) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.className = "faixa " + classe;
}

function renderHistorico(olId, itens) {
  const ol = document.getElementById(olId);
  if (!ol) return;
  ol.innerHTML = "";
  itens.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    ol.appendChild(li);
  });
  ol.scrollTop = ol.scrollHeight;
}

// Controla "executar automaticamente" com play/pause e velocidade.
function criarAutoExecutor(onPasso) {
  let timer = null;
  return {
    rodando() { return timer !== null; },
    iniciar(ms) {
      if (timer !== null) return;
      timer = setInterval(() => {
        const continua = onPasso();
        if (!continua) this.parar();
      }, ms);
    },
    parar() {
      if (timer !== null) { clearInterval(timer); timer = null; }
    }
  };
}

function baixarJSON(nomeArq, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nomeArq;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function validarJSON(texto) {
  try { return { ok: true, valor: JSON.parse(texto) }; }
  catch (e) { return { ok: false, erro: String(e && e.message || e) }; }
}

// Expõe para testes em Node sem quebrar no navegador.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { validarJSON };
}
