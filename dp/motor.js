// motor.js (DP) — Maquina de Duas Pilhas deterministica.
// Configuracao: (estado, posicao de leitura, pilha1, pilha2).
// Entrada e somente leitura; cabeca so anda para frente (ou fica parada no epsilon).
// Formato JSON proprio — ver README.
"use strict";

class MotorDuasPilhas {
  constructor(definicao) {
    this.def = definicao;
    this.reiniciar("");
  }

  reiniciar(entrada, limite = 1000) {
    this.entrada = String(entrada ?? "");
    this.pos = 0;
    this.pilha1 = []; // topo = ultimo elemento
    this.pilha2 = [];
    this.estado = this.def.inicial;
    this.passos = 0;
    this.limite = limite;
    this.status = "executando";
    this.motivo = "Em execucao.";
    this.ultimaRegra = null;
    this.ultimoMovimento = null; // {empilhou1, desempilhou1, ...} para destacar na UI
    this.historico = [this.foto()];
  }

  topo(pilha) {
    return pilha.length === 0 ? "" : pilha[pilha.length - 1];
  }

  foto() {
    const prox = this.pos < this.entrada.length ? `'${this.entrada[this.pos]}'` : "fim";
    return `passo ${this.passos} | estado=${this.estado} | prox=${prox} (pos ${this.pos}/${this.entrada.length}) | P1=[${this.pilha1.join(" ")}] P2=[${this.pilha2.join(" ")}]`;
  }

  // Uma regra casa quando: simbolo bate (ou epsilon), topos batem, exigeFim ok.
  casa(regra) {
    const simb = regra.simbolo ?? "";
    const consome = simb !== "";
    if (consome) {
      if (this.pos >= this.entrada.length) return false;
      if (this.entrada[this.pos] !== simb) return false;
    }
    if (regra.exigeFim && this.pos < this.entrada.length) return false;
    if (!this.topoCasa(this.topo(this.pilha1), regra.topo1)) return false;
    if (!this.topoCasa(this.topo(this.pilha2), regra.topo2)) return false;
    return true;
  }

  topoCasa(real, exigido) {
    const e = exigido ?? "*";
    if (e === "*") return true;      // qualquer (inclusive vazia)
    if (e === "") return real === ""; // exige pilha vazia
    return real === e;
  }

  aplicaveis() {
    return (this.def.transicoes || []).filter((r) => r.de === this.estado && this.casa(r));
  }

  passo() {
    if (this.status !== "executando") return false;
    if (this.passos >= this.limite) {
      this.status = "limite";
      this.motivo = `Limite de ${this.limite} passos atingido sem parar.`;
      return false;
    }
    const cand = this.aplicaveis();
    if (cand.length === 0) {
      if ((this.def.aceita || []).includes(this.estado) && this.pos >= this.entrada.length) {
        this.status = "aceita"; this.motivo = `Entrada consumida e estado "${this.estado}" e de aceitacao.`;
      } else {
        this.status = "rejeita";
        this.motivo = `Sem regra para (estado=${this.estado}, prox=${this.pos < this.entrada.length ? "'" + this.entrada[this.pos] + "'" : "fim"}, topos='${this.topo(this.pilha1) || "∅"}/${this.topo(this.pilha2) || "∅"}') → REJEITA.`;
      }
      return false;
    }
    if (cand.length > 1) {
      this.status = "rejeita";
      this.motivo = `Nao-determinismo: ${cand.length} regras aplicaveis em "${this.estado}". Maquina deterministica nao pode continuar → REJEITA.`;
      return false;
    }
    const r = cand[0];
    const mov = { retirou1: null, retirou2: null, pos1: [], pos2: [] };
    // Desempilha.
    if (r.retira1) mov.retirou1 = this.pilha1.pop();
    if (r.retira2) mov.retirou2 = this.pilha2.pop();
    // Empilha: lista insere1/insere2; o ULTIMO da lista vira o topo.
    (r.insere1 || []).forEach((s) => { this.pilha1.push(s); mov.pos1.push(s); });
    (r.insere2 || []).forEach((s) => { this.pilha2.push(s); mov.pos2.push(s); });
    // Avanca leitura se consumiu simbolo.
    if ((r.simbolo ?? "") !== "") this.pos += 1;
    this.ultimaRegra = r;
    this.ultimoMovimento = mov;
    this.estado = r.para;
    this.passos += 1;
    this.historico.push(this.foto());
    return true;
  }

  executarAteFim(maxExtra = 100000) {
    const teto = Math.min(this.limite, maxExtra);
    while (this.status === "executando" && this.passos < teto) this.passo();
    if (this.status === "executando" && this.passos >= this.limite) {
      this.status = "limite"; this.motivo = `Limite de ${this.limite} passos atingido sem parar.`;
    }
    return this.status;
  }

  textoRegra(r) {
    if (!r) return "Nenhuma transicao aplicada ainda.";
    const s = (r.simbolo ?? "") === "" ? "ε" : `'${r.simbolo}'`;
    const t1 = r.topo1 ?? "*"; const t2 = r.topo2 ?? "*";
    const a1 = `${r.retira1 ? "pop" : "mantem"};push[${(r.insere1 || []).join(",") || "–"}]`;
    const a2 = `${r.retira2 ? "pop" : "mantem"};push[${(r.insere2 || []).join(",") || "–"}]`;
    return `δ(${r.de}, ${s}, topo1='${t1 || "∅"}', topo2='${t2 || "∅"}') → (${r.para}, P1:${a1}, P2:${a2})${r.exigeFim ? " [exige fim]" : ""}`;
  }
}

if (typeof module !== "undefined" && module.exports) module.exports = { MotorDuasPilhas };
