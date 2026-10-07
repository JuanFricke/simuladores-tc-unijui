// testes-basicos.js — testes sem dependencias. Rode: node testes/testes-basicos.js
// Carrega os motores e os 4 exemplos e confere aceita/rejeita.
"use strict";
const fs = require("fs");
const path = require("path");

function carregar(rel) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "..", rel), "utf8"));
}

// Motores embutidos via require dos arquivos (eles exportam via module.exports).
const { MotorTuring } = require("../mt/motor.js");
const { MotorDuasPilhas } = require("../dp/motor.js");

let pass = 0, fail = 0;
function confere(rotulo, obtido, esperado) {
  if (obtido === esperado) { pass++; console.log(`ok   ${rotulo} → ${obtido}`); }
  else { fail++; console.log(`FALHA ${rotulo} → obtido=${obtido} esperado=${esperado}`); }
}

for (const arq of ["exemplos/turing-paridade.json", "exemplos/turing-anbn.json"]) {
  const def = carregar(arq);
  for (const t of def.testes) {
    const m = new MotorTuring(def);
    m.reiniciar(t.entrada, 2000);
    m.executarAteFim();
    confere(`${def.nome} '${t.entrada}'`, m.status, t.esperado);
  }
}
for (const arq of ["exemplos/pilhas-anbn.json", "exemplos/pilhas-anbncn.json"]) {
  const def = carregar(arq);
  for (const t of def.testes) {
    const m = new MotorDuasPilhas(def);
    m.reiniciar(t.entrada, 2000);
    m.executarAteFim();
    confere(`${def.nome} '${t.entrada}'`, m.status, t.esperado);
  }
}
// Caso de limite: maquina que anda para sempre.
const loop = { nome: "loop", branco: "_", estados: ["q"], inicial: "q", aceita: [], rejeita: [],
  transicoes: [{ de: "q", le: "_", para: "q", escreve: "_", move: "D" }] };
{
  const m = new MotorTuring(loop); m.reiniciar("", 50); m.executarAteFim();
  confere("limite de passos", m.status, "limite");
}
console.log(`\n${pass} ok, ${fail} falhas.`);
process.exit(fail ? 1 : 0);
