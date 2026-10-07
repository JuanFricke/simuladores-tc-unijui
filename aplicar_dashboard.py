from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
REPO = Path.cwd()

(REPO / 'css' / 'estilo.css').write_text((ROOT / 'estilo.css').read_text(encoding='utf-8'), encoding='utf-8')

def add_panel_classes(html):
    classes = ['painel-controle','painel-status','painel-memoria','painel-diagrama','painel-regra','painel-historico','painel-tabela','painel-json']
    for n, cls in enumerate(classes, 1):
        pattern = rf'(<section class="cartao)(">\s*<h2>{n} ·)'
        html, count = re.subn(pattern, rf'\1 {cls}\2', html, count=1)
        if count != 1:
            raise RuntimeError(f'Seção {n} não encontrada')
    return html

def compact_buttons(html):
    for a, b in {'Executar próximo passo (R5)':'▶ Próximo passo','Iniciar automático (R6)':'▶ Automático','Rodar até o fim':'⏩ Até o fim','Reiniciar (R7)':'↻ Reiniciar'}.items():
        html = html.replace(a, b)
    return html

def add_extra_examples(html, machine):
    marker = '<div class="linha"><span class="rotulo">Testar rápido:</span><span id="rapidas" class="linha"></span></div>'
    if 'id="exemplosExtras"' not in html:
        html = html.replace(marker, marker + '\n<div class="exemplos" id="exemplosExtras"></div>', 1)
    start = html.find('function montarRapidas()')
    if start < 0: raise RuntimeError('montarRapidas não encontrada')
    end = html.find('\n}', start) + 2
    if end < 2: raise RuntimeError('fim de montarRapidas não encontrado')
    if machine == 'mt':
        data = '''const extras = String(def.nome || "").toLowerCase().includes("anbn")
    ? [{v:"ab",ok:true},{v:"aabb",ok:true},{v:"aaabbb",ok:true},{v:"aab",ok:false},{v:"abb",ok:false}]
    : [{v:"",ok:true},{v:"0",ok:true},{v:"1",ok:false},{v:"10",ok:false},{v:"101",ok:true},{v:"111",ok:false},{v:"1001",ok:true}];'''
    else:
        data = '''const extras = String(def.nome || "").toLowerCase().includes("anbncn")
    ? [{v:"abc",ok:true},{v:"aabbcc",ok:true},{v:"aaabbbccc",ok:true},{v:"aabcc",ok:false},{v:"aabbc",ok:false}]
    : [{v:"ab",ok:true},{v:"aabb",ok:true},{v:"aaabbb",ok:true},{v:"aab",ok:false},{v:"abb",ok:false}];'''
    fn = f'''function montarRapidas() {{
  const cx = $("rapidas"); cx.innerHTML = "";
  (def.entradasRapidas || []).forEach((e) => {{
    const b = document.createElement("button"); b.className = "secundario exemplo-rapido";
    b.textContent = e === "" ? "ε (vazia)" : e;
    b.title = "Carregar entrada '" + e + "' e reiniciar";
    b.onclick = () => {{ $("entrada").value = e; instalar(); }}; cx.appendChild(b);
  }});
  const ex = $("exemplosExtras"); if (!ex) return; ex.innerHTML = "";
  {data}
  extras.forEach((item) => {{
    const b = document.createElement("button"); b.className = "secundario exemplo-extra " + (item.ok ? "esperado-ok" : "esperado-no");
    b.innerHTML = `<span>${{item.v === "" ? "ε" : item.v}}</span><small>${{item.ok ? "aceita" : "rejeita"}}</small>`;
    b.title = item.ok ? "Exemplo esperado: ACEITA" : "Exemplo esperado: REJEITA";
    b.onclick = () => {{ $("entrada").value = item.v; instalar(); }}; ex.appendChild(b);
  }});
}}'''
    return html[:start] + fn + html[end:]

def patch(rel, machine):
    p = REPO / rel
    html = p.read_text(encoding='utf-8')
    html = add_panel_classes(html)
    html = compact_buttons(html)
    html = add_extra_examples(html, machine)
    p.write_text(html, encoding='utf-8')

patch('mt/index.html', 'mt')
patch('dp/index.html', 'dp')
print('Dashboard aplicado.')
