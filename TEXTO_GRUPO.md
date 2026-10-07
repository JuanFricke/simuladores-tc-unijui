# Atividade Aula 8 (grupo) — Simuladores de Modelos de Computação

**Disciplina:** Teoria da Computação e Complexidade IJ — UNIJUÍ · **Data:** 07/10/2026
**Integrantes:** Juan Fricke · Gabriel Buron · Laura Capssa · Vinicius Dutra
**Projeto:** [COLE_AQUI_A_URL_DO_REPO] · **Demonstração online:** [COLE_AQUI_A_URL_DO_PAGES]

## O que entregamos

Dois simuladores web estáticos e originais (HTML/CSS/JS puro, sem dependências),
ambos determinísticos e com os requisitos R1–R11:

1. **Máquina de Turing (1 fita):** `…/mt/` — fita visual com cabeçote ▼, regra δ
   aplicada, passo a passo, automático com velocidade, reinício, histórico e
   faixa ✅ ACEITA / ❌ REJEITA / ⏸ LIMITE.
2. **Máquina de Duas Pilhas:** `…/dp/` — entrada somente-leitura + 2 pilhas com
   push/pop destacados, mesma estrutura de controles, histórico e veredito.

Exemplos incluídos (2 por máquina, com testes): MT paridade de `1`s e MT aⁿbⁿ;
DP aⁿbⁿ (só P1) e DP aⁿbⁿcⁿ (P1 e P2). Teste rápido: `node testes/testes-basicos.js`
→ `24 ok, 0 falhas`. Detalhes de uso e do formato JSON no `README.md`.

## Quem fez o quê

- Juan Fricke — [ex.: motor da MT + testes].
- Gabriel Buron — [ex.: motor das 2 pilhas + exemplos DP].
- Laura Capssa — [ex.: páginas HTML/CSS + prints].
- Vinicius Dutra — [ex.: README, exemplos MT, revisão].
  *(Ajustar antes de entregar.)*

## Uso de IA (declaração honesta)

Assistente de codificação (Muse Spark, via OpenCode) gerou o esqueleto e a base
dos textos; o grupo revisou manualmente a semântica dos motores, os 4 exemplos
(traço à mão), os testes (executados de verdade) e os textos. Referência
`funcional` (não copiada): `tsm-simulator` (GustavCampos) — só o checklist R1–R11;
código, visual, nomes e exemplos são originais.
