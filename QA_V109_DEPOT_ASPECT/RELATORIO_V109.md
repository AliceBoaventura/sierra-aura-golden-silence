# QA V109 — Correção de proporção do Depósito 47

**Data:** 10/11/2026  
**Escopo:** cenário jogável do Depósito 47 no Interlúdio.  
**Resultado:** **PASS na correção visual da cena; homologação global da build ainda pendente.**

## Falha original comprovada

A arte-fonte `assets/visual-v102/_source_depot-47-clean.png` mede **1672 × 941** (proporção 1,7768:1). A imagem entregue ao jogo, `depot-47-evidence-room.png`, media **2171 × 724** (proporção 2,9986:1) e era desenhada em uma área de 2200 × 720. Isso aplicava escalas horizontais e verticais muito diferentes e deformava objetos, personagens desenhados na arte e arquitetura.

## Correção aplicada

- Reamostrada a arte-fonte para **1280 × 720**, mantendo praticamente a proporção original (diferença inferior a 0,054% entre escalas horizontal e vertical).
- Reduzida a largura lógica do mundo do Depósito de 2200 para **1280**.
- Reposicionados os quatro pontos de investigação e seus marcadores: Mural 454, Fichários 716, Fita 832 e Terminal 960.
- Ajustados raio de proximidade (185 → 108) e velocidade de deslocamento (205 → 120) para manter a relação entre movimento, alcance e escala do cenário.
- Reposicionados Sierra/Jinx/Aura no novo espaço; a câmera desktop enquadra o trio e, em telas estreitas, enquadra Sierra/Jinx com zoom uniforme de 0,88.
- Corrigida a posição dos rótulos do scanner: acima da silhueta de Sierra e limitados à área visível do viewport.
- O fallback agora usa a mesma arte-fonte limpa em 16:9, sem sobrepor objetos duplicados.

## Evidências executadas

1. **96/96 testes automatizados** aprovados em `tests/run-current-qa.js`, incluindo o novo contrato V10.3 para proporção, largura de mundo, pontos de investigação, câmera, escala mobile, raio e movimento.
2. `node --check` aprovado em `interlude.js` e `interlude-engine.js`.
3. A função real `drawInterlude`, o motor real `Interlude` e os PNGs reais foram carregados em Chromium em um harness isolado de canvas. A cena foi renderizada em viewport lógico desktop **995 × 560** e mobile **390 × 650**.
4. Os quatro estados de scanner foram renderizados e confirmados como alcançáveis pelo motor: `depotBoard`, `depotArchive`, `depotTape` e `depotTerminal`. O rótulo do Fichário foi reposicionado para não cobrir a cabeça de Sierra nem ser cortado no viewport mobile.

As capturas desta pasta documentam a renderização do renderer real com os assets e as coordenadas finais. Elas não são capturas de uma sessão completa do jogo.

## Limite da homologação

A aplicação completa (`index.html`), com inicialização normal, HUD, entrada de capítulo, sequência cinematográfica e progressão integral, **não foi executada de ponta a ponta**. O Chromium local está sob política gerenciada que bloqueia URLs (`URLBlocklist: *`); a instalação de um navegador Playwright independente falhou por indisponibilidade de DNS. Portanto, não declaro a build inteira homologada nem libero um ZIP final como homologado. O que está aprovado é a correção visual/técnica do cenário do Depósito no renderer real, com os testes automatizados correspondentes.

## Arquivos alterados

- `assets/visual-v102/depot-47-evidence-room.png`
- `interlude.js`
- `interlude-engine.js`
- contratos de regressão em `tests/` (inclui `test_v103_depot_aspect_correction.js`)

Nenhum arquivo da versão publicada no itch.io foi alterado.
