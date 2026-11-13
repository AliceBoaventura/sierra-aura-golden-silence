# Sierra & Aura: Golden Silence — V10 / Passe de animação e QA espacial

## Origem preservada
V9 etapa 1, SHA-256 `31ea22f34b990a69979ffa0412e610e4cfea50f385657f1919981860e900433c`. O ZIP de origem não foi modificado.

## Alterações efetivamente integradas
- 16 poses normalizadas para Sierra, Aura, Jinx e Alexandra, a partir das artes originais; os quatro quadros de cada personagem compartilham altura visível calibrada e pés na mesma linha do solo.
- 8 poses adicionais registradas para os dois figurinos existentes de Alexandra: casual descalça (capítulo 7) e boné/jaqueta (Ghost Track). Os dois estilos continuam separados.
- Renderizador `neo-art-actors.js` usa os novos PNGs com fallback para os originais e sinalização de falhas via `NeoActors.assetQA()`.
- `game.js` não desloca verticalmente os personagens ao respirar ou caminhar. **Hitboxes, coordenadas, física e velocidade não foram modificadas.**
- `ghost.js` e `interval.js` conectados aos respectivos conjuntos de animação; memória da investigação intacta.
- `scenery-finish.js` remove faixas e rebites falsos desenhados por cima do piso já presente nos fundos.
- `interval.js` remove colunas geométricas duplicadas no corredor, preservando `brace`, `trace` e as interações.

## Evidências e QA
- **75/87 testes aprovados**, **12 falhas herdadas da V9**. Novo teste de geometria cobre pés ancorados nos 4 personagens e 2 figurinos. O teste antigo de caminhada foi migrado para o novo contrato, em vez de simplesmente ser apagado.
- **155/155 scripts JS** aprovados pelo Node `--check`.
- **24 novos PNGs** passaram pela inspeção real de pixels alpha. Desvio de altura visível entre poses: **máximo 2,55%**.
- **14 fundos** documentados de oito capítulos e **59 hotspots** verificados quanto à responsabilidade visual, com inventário de resolução.
- No ZIP base, **880 arquivos anteriores permanecem bit a bit intactos**; as únicas modificações em arquivos já existentes são: game.js, ghost.js, interval.js, neo-art-actors.js, scenery-finish.js, tests/test_p6_sierra_walk.js.
- `QA_V10/qa_normalized_actor_keys.png`: painel real dos PNGs registrados.
- `QA_V10/qa_cast_walk_registration.gif`: reprodução gráfica do ciclo de 4 tempos (prévia offline, não gravação do jogo).
- `QA_V10/qa_campaign_art_inventory.jpg`: 13 fundos reais de capítulos (inventário de fontes, não captura de gameplay).

## Pendências explícitas
- **SEM HOMOLOGAÇÃO VISUAL DO JOGO RENDERIZADO:** Chromium local bloqueou `file://` e `http://127.0.0.1` por política administrativa; a build V10 não está publicada. A inspeção de assets e geometria não substitui uma partida real em desktop/mobile.
- Os dois passos distintos do figurino casual de Alexandra ainda são os únicos quadros authored disponíveis para a caminhada nesse figurino; normalizá-los não produz animação artística adicional. Não classificar como ciclo de 8 poses inéditas.
- O Depósito 47 mantém sprites cinematográficos próprios. A revisão V10 não substituiu esses retratos nem reescreveu a cena.
- Persistem as 12 falhas da suíte de testes existente: test_ch3_puzzle_focused_space.js, test_finale_reachable_20261030.js, test_interlude_sprite_scale.js, test_p1_environment_consequences.js, test_p1_room_scale_consistency.js, test_p49_narrative_escape_integration.js, test_p50_trace_service_gallery.js, test_p53_romance_finale.js, test_qa_progression_ch2_ch3.js, test_qa_progression_ch6.js, test_rc66_engine.js, test_relay_three_nodes_integrated_20261101.js. Elas precisam ser triadas por contrato desatualizado vs falha de jogo, sem presumir homologação.
- Não foi publicado no itch.io. A tela de carregamento original foi mantida sem alteração.

## Publicação / rollback
`index.html`, `style.css`, `abertura-original.gif`, `loading-screen.js`, `cadillac-intro.js`, `terrace.js`, `terrace-story.js` e a lógica de salvamento não foram alterados. Para reverter, restaurar os seis arquivos editados da V9; os PNGs adicionais são isolados em `assets/animation-v10/`.
