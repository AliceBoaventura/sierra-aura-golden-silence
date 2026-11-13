# Sierra & Aura — RC73 V10.6 — Cadillac e rastros

## Base
- Arquivo-fonte imutável: `SIERRA_AURA_RC73_V105_FUGA_CLUBE_AURA_CAFE_QA_20261107.zip`.
- Objetivo: corrigir a diferença de escala do Cadillac, a repetição do ciclo de Sierra na investigação e a redundância dos marcadores de rastros sem alterar as escolhas nem a progressão.

## Intervenções efetivas
1. `club.js`: Cadillac estático da saída redimensionado de 425 para 760 unidades, centro reposicionado a x=2500 para conservar a carroceria dentro da área de 2900; ponto interativo preservado em x=2630 e solo y=800. No plano de direção, escala limitada a 850 ou 92% da viewport. Não altera o jogo da perseguição nem o gatilho do embarque.
2. `assets/animation-v106/trace-sierra-0..7.png`: ciclo investigativo de oito fases elaborado a partir das poses autorizadas de Sierra em V10 e V10.2, com registro pelo eixo do tronco, soles uniformes e altura alfa de 659 pixels. Sem geração de partes corporais por interpolação e sem alterar física.
3. `neo-art-actors.js` e `game.js`: ciclo investigativo aplicado apenas à galeria de rastros, acesso ao esconderijo e apartamento antes de Aura ser encontrada; com fallback para V10.2 caso a arte ainda não tenha carregado.
4. `prelude.js`: suprime a silhueta de rastro duplicada no corredor, preservando o efeito antigo na perseguição externa do distrito.
5. `apartment.js`: indicador flutuante persistente sobre Sierra passa a aparecer apenas ao escanear uma interação próxima.
6. `trace-gallery.js`: marcadores de console, áudio, arquivo e portas deixam de usar três LEDs indistintos; continuam interativos nas coordenadas originais.
7. `tests/test_p48_dialogue_portrait_grounding.js`: expectativa estática de carro antigo foi substituída por verificação do apoio no solo. `tests/test_v106_cadillac_investigation.js`: novo contrato de geometria, caminho e assets.

## Dados geométricos
- PNG Cadillac: retângulo alfa visível de 1747 × 468 px; proporção H/W ≈ 0,2679.
- V10.5: 425 × 113,85 unidades; V10.6: 760 × 203,59.
- Jinx: 278; Sierra: 218 (alturas nominais do renderizador).
- Ciclo Sierra: oito quadros de 660×690 pixels; alfa de y=31 até y=689; centro do tronco mediano em x=330..332. Pé apoiado na mesma linha em todos os quadros.

## Testes
- 92/92 verificações automatizadas aprovadas com `node tests/run-current-qa.js`. Incluem o percurso integral simulado da perseguição para três variantes de evidência, regras de scanner, entrada no Cadillac, estados de capítulo, arte e narrativa anterior.
- `node --check` dos módulos alterados aprovado.
- Chromium real, sobre `about:blank`, renderizou uma comparação controlada com os PNGs de carcaça, cenário, Jinx e Sierra, disponível em `QA_V106/cadillac_scale_browser_comparison.png`. **Essa composição é uma prévia isolada, não uma captura da build jogada.**
- A navegação Chromium até `http://127.0.0.1:8776/` e até URLs com as rotas interceptadas retornou `net::ERR_BLOCKED_BY_ADMINISTRATOR` nesta sessão. Portanto, **não houve homologação visual de gameplay da V10.6** nem teste da campanha contínua em Android físico.

## Compatibilidade e regressão
- `club-engine.js`, `prelude-engine.js` e `apartment-engine.js` preservados byte a byte, inclusive as hitboxes, progressão e triggers.
- Ciclos anteriores continuam presentes como fallback. Narrativa Sierra/Aura V10.4 e as correções V10.5 permanecem intocadas.
- Tela de carregamento original intocada.
- Publicação itch.io não modificada.

**Estado:** candidata V10.6 funcionalmente testada e com prévia visual isolada. Homologação integral pendente; não confundir 92/92 testes de suíte com prova de ausência de todos os bugs de jogabilidade ou qualidade final.
