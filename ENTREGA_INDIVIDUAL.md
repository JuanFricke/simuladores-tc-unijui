# Atividade Aula 8 — Simuladores de Modelos de Computação

**Disciplina:** Teoria da Computação e Complexidade IJ — UNIJUÍ
**Data:** 07/10/2026
**Aluno(a):** [SEU_NOME_COMPLETO]
**Grupo:** Juan Fricke · Gabriel Buron · Laura Capssa · Vinicius Dutra

**Repositório:** https://github.com/JuanFricke/simuladores-tc-unijui
**Demonstração (GitHub Pages):** http://www.juanfricke.dev/simuladores-tc-unijui/

> Para converter em PDF: colar este arquivo no Google Docs / Word e exportar como PDF
> com o nome `Atividade_Aula08_Simuladores_[SeuNome].pdf`, ou usar
> `pandoc ENTREGA_INDIVIDUAL.md -o Atividade_Aula08_Simuladores_[SeuNome].pdf`.

---

## 1 · Objetivo

Construir dois simuladores didáticos de modelos de computação, ambos
**determinísticos**, com execução passo a passo, execução automática, histórico
de configurações e indicação explícita de parada:

1. **Máquina de Turing (MT)** — 1 fita infinita nos dois sentidos, 1 cabeçote.
2. **Máquina de Duas Pilhas (DP)** — fita de entrada somente-leitura (cabeça só
   anda para frente) + 2 pilhas com operações push/pop.

## 2 · Como cada modelo é representado no simulador

### 2.1 Máquina de Turing

- **Definição (JSON):** `branco`, `estados`, `inicial`, `aceita[]`, `rejeita[]` e
  `transicoes[]` com `{de, le, para, escreve, move}` (`E` = esquerda,
  `D` = direita, `P` = parado).
- **Configuração exibida:** estado atual + posição do cabeçote + conteúdo da fita
  (crachás no topo da página).
- **Memória visual:** trilho de células; a célula do cabeçote fica destacada em
  mostarda com seta ▼; o símbolo de branco aparece nas células vazias.
- **Semântica de parada:** aplicada uma regra δ por passo; sem regra aplicável →
  **ACEITA** se o estado é de aceitação, senão **REJEITA** (travou);
  estourou o limite de passos → **LIMITE** (anti-loop).

### 2.2 Máquina de Duas Pilhas

- **Definição (JSON):** `estados`, `inicial`, `aceita[]`, `rejeita[]` e
  `transicoes[]` com `{de, simbolo, topo1, topo2, para, retira1, retira2,
  insere1[], insere2[], exigeFim?}`.
  `simbolo ""` = transição ε (não consome entrada); `topo ""` = exige pilha
  vazia; `"*"` = qualquer conteúdo; `exigeFim` = só dispara com leitura esgotada.
- **Configuração exibida:** estado + posição de leitura (`pos/tamanho`) +
  conteúdo das duas pilhas.
- **Memória visual:** fita de entrada com a próxima célula destacada + duas
  colunas de pilha (base embaixo, topo em cima); o último bloco empilhado (push)
  ganha contorno e a linha “Último movimento” registra cada pop/push.
- **Semântica de parada:** no máximo uma regra aplicável por configuração
  (duas ou mais = não-determinismo → **REJEITA**); sem regra → **ACEITA** se
  estado de aceitação com entrada esgotada, senão **REJEITA**; limite → **LIMITE**.

## 3 · Tabela requisito → onde aparece na interface

| Req. | O que é | Onde aparece (MT e DP, mesmos rótulos) |
|---|---|---|
| R1 | Entrada | Seção 1, campo “Palavra de entrada” + “Aplicar entrada e reiniciar” |
| R2 | Estado / configuração | Seção 2, crachás “Estado atual”, “Passo nº”, “Cabeçote/Pos. leitura” |
| R3 | Memória visual | MT seção 3 (trilho da fita) · DP seção 3 (fita de entrada + 2 colunas) |
| R4 | Transição atual | Seção 4, quadro “Regra aplicada agora” em notação δ |
| R5 | Próximo passo | Seção 1, botão “Executar próximo passo” |
| R6 | Automático | Seção 1, “Iniciar/Pausar automático” + “Velocidade” |
| R7 | Reiniciar | Seção 1, botão “Reiniciar” |
| R8 | Histórico | Seção 5, “Histórico de configurações” (lista numerada) |
| R9 | Fim claro | Seção 2, faixa ✅ ACEITA / ❌ REJEITA / ⏸ LIMITE + motivo |
| R10 | Fita + cabeçote (MT) | Célula mostarda + seta ▼ sobre o cabeçote |
| R11 | Push/pop (DP) | Blocos coloridos, destaque do push, linha “Último movimento” com pops |

## 4 · Demonstrações (capturas — substituir pelos prints reais)

> Rode cada caso abaixo e capture a tela da faixa de veredito + memória.
> Mantenha a legenda de cada figura no PDF final.

- **Figura 1 (MT, aceita):** exemplo “paridade de 1s”, entrada `101` → faixa
  `✅ ACEITA`. `[INSERIR_PRINT_1]`. Descrição: dois `1`s (par); varredura
  `q_par → q_impar → q_par` e decisão no branco.
- **Figura 2 (MT, rejeita):** exemplo “aⁿbⁿ”, entrada `aab` → faixa
  `❌ REJEITA`. `[INSERIR_PRINT_2]`. Descrição: falta um `b`; a máquina procura
  `b` além do fim e trava em `q1`.
- **Figura 3 (DP, aceita + rejeita):** exemplo “aⁿbⁿcⁿ”, entrada `aabbcc` →
  `✅ ACEITA` (P1 e P2 zeram); entrada `aabcc` → `❌ REJEITA`.
  `[INSERIR_PRINT_3]`. Descrição: cada `a` empilha A (P1), cada `b` move A→B
  (P1→P2), cada `c` desempilha B (P2).

## 5 · Como testar (passos curtos)

1. Acesse `[URL_DO_PAGES]` e abra um simulador.
2. Clique no **Exemplo A**, digite a entrada sugerida, clique
   **Aplicar entrada e reiniciar**.
3. Clique **Executar próximo passo** 3–5 vezes: observe fita/pilhas, regra δ e histórico.
4. Clique **Iniciar automático** até a faixa de veredito.
5. (Opcional, técnico) Rode `node testes/testes-basicos.js` — esperado `24 ok, 0 falhas`.

## 6 · Divisão de tarefas do grupo

- Juan Fricke — [ex.: motor da MT + testes].
- Gabriel Buron — [ex.: motor das 2 pilhas + exemplos DP].
- Laura Capssa — [ex.: páginas HTML/CSS + prints do relatório].
- Vinicius Dutra — [ex.: README, JSONs da MT, revisão final].
  *(Ajuste as atribuições antes de entregar.)*

## 7 · Declaração de uso de IA

- **Ferramenta:** assistente de codificação (Muse Spark, via OpenCode).
- **Finalidade:** gerar o esqueleto do projeto (pastas/HTML/CSS/motores),
  redigir a base deste relatório e do README e sugerir as transições dos exemplos.
- **O que foi revisado manualmente pelo grupo:** semântica de aceitação/rejeição/limite
  dos dois motores; traço manual dos 4 exemplos; execução real dos testes
  (`node testes/testes-basicos.js`, 24/24); textos em português; conferência de
  que nenhum código, CSS, exemplo ou texto foi copiado da referência.
- **Referência técnica (checklist funcional, sem cópia):** projeto educacional
  `tsm-simulator` (GustavCampos) — usado apenas para conferir a lista R1–R11 e a
  semântica de parada; implementação, layout, nomes e exemplos são originais.

## 8 · Referências

1. SIPSER, M. *Introdução à Teoria da Computação*. Cap. Máquinas de Turing
   (modelo básico, variantes e tese de Church-Turing); equivalência entre
   modelos de múltiplas fitas/pilhas.
2. Material de aula da disciplina (Aula 8 — Modelos de computação). [completar
   título/data do slide, se aplicável].
3. GUSTAVCAMPOS. *tsm-simulator* — referência funcional da atividade
   (checklist R1–R11). [https://github.com/GustavCampos/tsm-simulator].
