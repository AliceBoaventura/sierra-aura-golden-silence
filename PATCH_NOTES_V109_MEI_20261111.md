# Sierra & Aura: Golden Silence — V109 / Mei refinement candidate
**Data:** 11/11/2026  
**Base:** `SIERRA_AURA_RC73_V109_DEPOT_CORRIGIDO_CANDIDATA_20261110 (3).zip`  
**SHA-256 da base:** `10a9895efb03da7b59b83a0804d7a455b04bcd95561aa5de6c2d6f049441e34b`  
**Status:** candidata isolada; não publicada e não homologada integralmente.

## Alterações aplicadas

1. Substituídas as quatro poses da Mei em `assets/mei/` pelas imagens fornecidas pela usuária: `sit`, `walk`, `explore` e `reach`.
2. Removida da pose `reach` a bota de Sierra que estava fundida à composição original. As quatro imagens mantêm canal RGBA.
3. Mantida a redução suave em alta qualidade para os sprites ilustrados.
4. Normalizada a escala horizontal da pose `walk`: a largura renderizada agora fica próxima da pose `sit`, evitando que Mei encolha visualmente ao começar a andar. A altura continua menor, coerente com a postura lateral.
5. Corrigido o estado de carinho: `flags.meiPetted` é uma memória narrativa persistente, não um estado contínuo de animação. A pose `reach` agora depende de `catReactUntil` e termina quando o temporizador expira ou Sierra se afasta.
6. Atualizados os identificadores de cache de `mei-ai.js`, `interlude.js` e das quatro imagens para impedir reutilização dos recursos anteriores pelo navegador.
7. Atualizados os metadados internos para identificar explicitamente `RC73-V109-MEI-CANDIDATA-20261111`.
8. Adicionados testes para escala, temporizador de carinho, cache busting e identidade da candidata.

## Varredura rápida

- `node tests/run-current-qa.js`: **97/97 aprovados**.
- `node --check`: **171 arquivos JavaScript aprovados**.
- `index.html`: 93 referências locais diretas verificadas; nenhuma ausente.
- Folhas CSS carregadas pelo HTML: 12 referências `url()` verificadas; nenhuma ausente.
- ZIP-base original preservado; nenhum asset legado ou evidência de QA foi apagado.
- A pose `walk` foi comparada matematicamente com a pose `sit` usando as dimensões reais dos PNGs e a escala de renderização do quarto.

## Evidência visual e limite de homologação

Foi gerada uma prévia composta sobre `assets/visual-v5/sierra-home-v5.png`, usando as dimensões e a escala do renderer do Interlúdio. Ela confirma a relação de tamanho e a separação das quatro poses, mas **não é uma captura do jogo executando**.

A navegação local com Chromium foi bloqueada pela política do ambiente. O conector Chrome não conseguiu acessar o navegador conectado nesta sessão. O KERNEL abriu a publicação pública, mas o túnel necessário para carregar a candidata local não foi estabelecido. Chronos não expôs uma ferramenta executável nesta sessão.

Portanto, não foi possível validar esta candidata em jogo real, em desktop e mobile. A build permanece **não homologada** até uma execução visual e jogável da própria candidata. A versão pública no itch.io não foi modificada.

## Arquivos alterados

- `index.html`
- `assets/mei/mei-sit.png`
- `assets/mei/mei-walk.png`
- `assets/mei/mei-explore.png`
- `assets/mei/mei-reach.png`
- `mei-ai.js`
- `interlude.js`
- `tests/test_p13_sprite_consistency_20261023.js`
- `tests/test_mei_sprite_refinement_v109.js` (novo)
- `PATCH_NOTES_V109_MEI_20261111.md` (novo)
