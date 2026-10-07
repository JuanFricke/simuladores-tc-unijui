// motor.js (MT) — Maquina de Turing deterministica, 1 fita, fita infinita.
// Formato JSON proprio (ver README, secao "Formato JSON").
// Estrutura original, escrita para esta atividade.
"use strict";

class MotorTuring {
  constructor(definicao) {
    this.def = definicao;
    this.mapaTransicoes = new Map();
    (definicao.transicoes || []).forEach((t) => {
      const chave = t.de + "◊" + t.le;
      if (!this.mapaTransicoes.has(chave)) this.mapaTransicoes.set(chave, t);
      // Se houver duplicata (nao-determinismo), mantem a primeira; aviso em avisos().
    });
    this.reiniciar("");
  }

  avisos() {
    const vistos = new Set(); const dup = [];
    (this.def.transicoes || []).forEach((t) => {
      const c = t.de + "◊" + t.le;
      if (vistos.has(c)) dup.push(c); else vistos.add(c);
    });
    return dup.map((d) => "Transicao duplicada (nao-deterministica) para " + d);
  }

  reiniciar(entrada, limite = 1000) {
    this.branco = this.def.branco ?? "_";
    this.fita = new Map(); // posicao -> simbolo (so guarda nao-branco)
    [...String(entrada ?? "")].forEach((ch, i) => {
      if (ch !== this.branco) this.fita.set(i, ch);
    });
    this.estado = this.def.inicial;
    this.cabeca = 0;
    this.passos = 0;
    this.limite = limite;
    this.status = "executando"; // executando | aceita | rejeita | limite
    this.motivo = "Em execucao.";
    this.ultimaRegra = null;
    this.ultimaEscrita = null; // posicao gravada no ultimo passo (p/ animar)
    this.historico = [this.foto()];
    this._conferirParadaInicial();
  }

  ler(pos) {
    return this.fita.has(pos) ? this.fita.get(pos) : this.branco;
  }

  foto() {
    const esq = Math.min(this.cabeca, ...[...this.fita.keys(), 0]) - 1;
    const dir = Math.max(this.cabeca, ...[...this.fita.keys(), 0]) + 1;
    let trecho = "";
    for (let p = esq; p <= dir; p++) {
      const s = this.ler(p);
      trecho += (p === this.cabeca ? "[" + s + "]" : " " + s + " ");
    }
    return `passo ${this.passos} | estado=${this.estado} | cabeca=${this.cabeca} |${trecho}`;
  }

  _conferirParadaInicial() {
    if ((this.def.aceita || []).includes(this.estado)) { this.status = "aceita"; this.motivo = "Estado inicial ja e de aceitacao."; }
  }

  passo() {
    if (this.status !== "executando") return false;
    if (this.passos >= this.limite) {
      this.status = "limite"; this.motivo = `Limite de ${this.limite} passos atingido sem parar.`;
      return false;
    }
    const simbolo = this.ler(this.cabeca);
    const regra = this.mapaTransicoes.get(this.estado + "◊" + simbolo);
    if (!regra) {
      // Sem transicao: aceita se estado final de aceita, senao rejeita (travou).
      if ((this.def.aceita || []).includes(this.estado)) {
        this.status = "aceita"; this.motivo = `Parou em estado de aceitacao "${this.estado}".`;
      } else {
        this.status = "rejeita";
        this.motivo = `Sem transicao para (${this.estado}, '${simbolo}'). Maquina travou → REJEITA.`;
      }
      return false;
    }
    // Aplica regra.
    this.ultimaEscrita = this.cabeca;
    if (regra.escreve === this.branco) this.fita.delete(this.cabeca);
    else this.fita.set(this.cabeca, regra.escreve);
    this.ultimaRegra = regra;
    this.estado = regra.para;
    const mov = (regra.move || "D").toUpperCase();
    if (mov === "E" || mov === "L") this.cabeca -= 1;
    else if (mov === "D" || mov === "R") this.cabeca += 1;
    // 'P' (parado) nao move.
    this.passos += 1;
    this.historico.push(this.foto());
    if ((this.def.aceita || []).includes(this.estado) && !this.mapaTransicoes.has(this.estado + "◊" + this.ler(this.cabeca))) {
      // Aceita imediatamente somente se nao ha continuacao? Nao: deixa o proximo
      // passo decidir, mas se a definicao usa transicao para estado final sem saida,
      // o proximo passo ja marcara aceita. Mantem executando aqui.
    }
    // Checagem direta: se entrou em estado de rejeicao explicito sem saida relevante,
    // ainda deixa o proximo passo confirmar; mas se for estado final isolado, antecipa:
    return true;
  }

  // Roda ate parar ou ate o limite; retorna o status final.
  executarAteFim(maxExtra = 100000) {
    const teto = Math.min(this.limite, maxExtra);
    while (this.status === "executando" && this.passos < teto) this.passo();
    if (this.status === "executando" && this.passos >= this.limite) {
      this.status = "limite"; this.motivo = `Limite de ${this.limite} passos atingido sem parar.`;
    }
    // Se parou por falta de transicao, o ultimo passo() ja definiu aceita/rejeita.
    // Caso tenha entrado em estado de aceita/rejeita com fita esgotada, confirma:
    if (this.status === "executando") {
      if ((this.def.aceita || []).includes(this.estado)) { this.status = "aceita"; this.motivo = `Parou em "${this.estado}" (aceitacao).`; }
      else if ((this.def.rejeita || []).includes(this.estado)) { this.status = "rejeita"; this.motivo = `Parou em "${this.estado}" (rejeicao).`; }
    }
    return this.status;
  }

  // Janela da fita para desenho: N celulas a esquerda/direita do cabecote.
  janela(raio = 7) {
    const celulas = [];
    for (let p = this.cabeca - raio; p <= this.cabeca + raio; p++) {
      celulas.push({ pos: p, simbolo: this.ler(p), atual: p === this.cabeca });
    }
    return celulas;
  }

  textoRegra(r) {
    if (!r) return "Nenhuma transicao aplicada ainda.";
    return `δ(${r.de}, '${r.le}') = (${r.para}, '${r.escreve}', ${r.move})`;
  }
}

if (typeof module !== "undefined" && module.exports) module.exports = { MotorTuring };
