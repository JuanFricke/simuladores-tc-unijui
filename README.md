# Simuladores de Modelos de Computação — UNIJUÍ

Trabalho da aula 8 · **Teoria da Computação e Complexidade IJ** · 07/10/2026.
Dois simuladores web **estáticos e originais** (HTML/CSS/JS puro, sem CDN, sem build):
uma **Máquina de Turing determinística de 1 fita** e uma **Máquina de Duas Pilhas**
com entrada somente-leitura.

> Referência usada **só como checklist funcional/semântico** (não copiada):
> `tsm-simulator` de GustavCampos (lista de requisitos R1–R11 e semântica de aceitação).
> Todo o código, CSS, layout, textos e exemplos deste repo foram escritos do zero
> para esta entrega. Ver “Declaração de uso de IA” ao final.

**Grupo:** Juan Fricke · Gabriel Buron · Laura Capssa · Vinicius Dutra

**Links:** repo `https://github.com/JuanFricke/simuladores-tc-unijui` · demonstração `http://www.juanfricke.dev/simuladores-tc-unijui/`

---

## 1 · Como publicar no GitHub (site estático)

1. Crie o repositório (ex.: `simuladores-tc-unijui`) e suba todos os arquivos desta pasta.
2. No GitHub: **Settings → Pages → Deploy from a branch → branch `main`, pasta `/ (root)`**.
3. Aguarde 1–2 min. O endereço fica como `https://SEU-USUARIO.github.io/simuladores-tc-unijui/`.
4. Teste: abra `/`, `/mt/` e `/dp/` no navegador. Não há backend nem segredo: é só arquivo estático.

Uso local sem servidor também funciona (duplo clique no `index.html`);
o botão de exemplo tenta `fetch` do JSON e, se falhar por `file://`, usa um exemplo embutido.

## 2 · Como usar

1. Abra o portal (`index.html`) e escolha o simulador.
2. Escolha um **exemplo** (botões) ou cole seu próprio JSON na área de definição → **Aplicar JSON**.
3. Digite a **palavra de entrada**, ajuste o **limite de passos** e clique **Aplicar entrada e reiniciar**.
4. **Executar próximo passo** avança uma transição (a regra δ aplicada aparece no quadro).
5. **Iniciar automático** executa com a velocidade escolhida; **Reiniciar** volta à configuração inicial.
6. Acompanhe **estado, fita/pilhas, transição atual e histórico**; o veredito sai na faixa
   **✅ ACEITA / ❌ REJEITA / ⏸ LIMITE**.

### Roteiro rápido de demonstração (2 min por máquina)

- **MT paridade:** entrada `101` → ACEITA; entrada `1` → REJEITA.
- **MT aⁿbⁿ:** entrada `aabb` → ACEITA; `aab` → REJEITA.
- **DP aⁿbⁿ:** entrada `aaabbb` → ACEITA (P1 enche e esvazia); `abb` → REJEITA.
- **DP aⁿbⁿcⁿ:** entrada `aabbcc` → ACEITA (P1 e P2 zeram); `aabcc` → REJEITA.

## 3 · Formato JSON das máquinas

### 3.1 Máquina de Turing

```json
{
  "nome": "minha-mt",
  "branco": "_",
  "estados": ["q0", "q_sim", "q_nao"],
  "inicial": "q0",
  "aceita": ["q_sim"],
  "rejeita": ["q_nao"],
  "transicoes": [{ "de": "q0", "le": "0", "para": "q0", "escreve": "0", "move": "D" }]
}
```

- `move`: `"E"` (esquerda) · `"D"` (direita) · `"P"` (parado). Aceita minúsculas/`L,R,S` como sinônimo.
- Determinismo: no máximo uma transição por par `(de, le)`. Duplicadas geram aviso e a primeira prevalece.
- Parada: sem transição na configuração atual → **ACEITA** se o estado está em `aceita`,
  senão **REJEITA** (travou). Passou do `limite` → **LIMITE**.

### 3.2 Máquina de Duas Pilhas

```json
{
  "nome": "minha-dp",
  "estados": ["q_a", "q_sim"],
  "inicial": "q_a",
  "aceita": ["q_sim"],
  "rejeita": [],
  "transicoes": [{
    "de": "q_a", "simbolo": "a", "topo1": "*", "topo2": "*",
    "para": "q_a", "retira1": false, "retira2": false,
    "insere1": ["A"], "insere2": [], "exigeFim": false
  }]
}
```

- `simbolo`: caractere consumido da entrada; `""` = transição **ε** (não consome, não anda).
- `topo1/topo2`: `""` exige pilha vazia · `"*"` aceita qualquer (inclusive vazia) · outro valor exige aquele símbolo no topo.
- `retira1/retira2`: `true` = `pop` antes de empilhar. `insere1/insere2`: lista empilhada na ordem dada
  (o **último** da lista vira o topo). `exigeFim`: só dispara se a leitura já chegou ao fim.
- Determinismo: no máximo **uma** regra aplicável por configuração; duas ou mais → **REJEITA**
  com motivo de não-determinismo. Sem regra aplicável → **ACEITA** se estado de aceitação com
  entrada esgotada, senão **REJEITA**.

## 4 · Exemplos incluídos (4, textos próprios)

| Arquivo | Linguagem | Ideia |
|---|---|---|
| `exemplos/turing-paridade.json` | парidade de `1`s | dois estados varredores + decisão no branco |
| `exemplos/turing-anbn.json` | {aⁿbⁿ} | marca X/Y indo e voltando; checa sobra |
| `exemplos/pilhas-anbn.json` | {aⁿbⁿ} | P1 como contador de `a` menos `b` |
| `exemplos/pilhas-anbncn.json` | {aⁿbⁿcⁿ} | P1 conta `a−b`, P2 conta `b−c` |

Cada arquivo traz um campo `testes` com entradas e vereditos esperados.

## 5 · Testes

```bash
node testes/testes-basicos.js
```

Roda os `testes` dos 4 exemplos + um caso de `limite` (máquina que anda para sempre).
Esperado: `24 ok, 0 falhas` (5 + 6 + 6 + 6 testes de exemplo + 1 caso-limite).
Sem dependências: só Node 16+.

## 6 · Estrutura

```
index.html  portal + tabela R1–R11
css/estilo.css  estilo próprio (creme + verde-mata)
js/util.js  faixa, histórico, auto-executor, JSON
mt/index.html + mt/motor.js  simulador e motor da MT
dp/index.html + dp/motor.js  simulador e motor das 2 pilhas
exemplos/*.json  4 máquinas com testes
testes/testes-basicos.js  verificação em Node
```

## 7 · Créditos e declaração de uso de IA

- Autoria do código/textos: grupo (ver divisão em `TEXTO_GRUPO.md`).
- Base teórica: material da disciplina e Sipser, *Introdução à Teoria da Computação*
  (cap. Máquinas de Turing; equivalência de modelos com múltiplas pilhas/fitas).
- Checklist funcional inspirado no projeto educacional `tsm-simulator` (GustavCampos) —
  **nenhum código, CSS, texto ou exemplo foi copiado**; a semântica (aceita/rejeita/limite,
  passo, histórico) foi reimplementada de forma independente.
- **Uso de IA:** assistente de codificação (Muse Spark, via OpenCode) usado para
  gerar o esqueleto do projeto, redigir README/documentos e sugerir transições de exemplo.
  **Revisado manualmente pelo grupo:** semântica dos motores, os 4 arquivos de exemplo
  (traços conferidos à mão), os testes (`node testes/testes-basicos.js` executado),
  os textos em português e a diferença visual em relação à referência.
