# Sierra & Aura: Golden Silence — RC73 V10.5

## Escopo aplicado

1. **Fuga do clube**: remoção dos figurantes e da DJ como corpos de cena durante a perseguição, 2 guardas na pista e 1 na saída, sem menu de escolhas durante tiros. Alexandra atua pelo rádio. A decisão anterior à perseguição mantém as variáveis; a conversa posterior ocorre no Cadillac, após cessarem os disparos. Proteção de Jinx, scanner da porta e embarque de ambos continuam operacionais.
2. **Passagem de serviço**: arte arquitetônica derivada da referência visual enviada. A imagem usada no motor não contém personagens nem controles pintados. O leitor permanece um hotspot real em x=1370, a saída em x=2630, e a comporta geométrica redundante não é desenhada sobre a nova porta.
3. **Aura nos capítulos 6 e 7**: pose parada orientada para Sierra, sem herdar a direção de entrada dela. Ciclo de locomoção usa o eixo do respectivo sprite. Sprite original preservado como fallback.
4. **Café às 02:17**: Jinx e Sierra sentados com sprites recortados independentes; apoio de pés consistente, maior coerência de escala, e oclusão feita apenas pela borda física da mesa. Composite anterior fica como fallback; não são pintados corpos duplicados no fundo.
5. **Texto**: reduzidos os blocos de fuga, recados de rádio e explicação de encerramento; sem alterar o roteiro Sierra/Aura da V10.4 e a tela de carregamento original.

## Verificação

- Suíte Node: **RESULTADO 91/91**. Contratos incluem orientação de Aura, patrulha, sprites do café e ausência do menu de fuga.
- Chromium local (arte e motor reais): carregamento, cena de fuga, café em desktop/mobile, Aura no capítulo 7; sem exceções ou requisições 404 nas execuções concluídas.
- Chromium com controles: gabinete / cabine -> fuga sem pausa -> perseguição -> scanner (1,12 s) -> abertura do leitor -> embarque com Jinx -> Cadillac. **7 checkpoints dirigidos**, sem exceções nem recursos ausentes.
- Mobile 390×844: tela sem scroll horizontal; HUD da cobertura reposicionado para não cortar.
- Os testes dirigidos começam por seleção de capítulo ou estados preparados. **Não houve partida contínua do prólogo ao interlúdio nesta V10.5.**
- Não testado em aparelho Android físico nem publicação itch.io. Chrome conectado não acessível nesta sessão; o Chromium local foi usado para QA real da candidata. Nenhuma alteração publicada.

## Artes recentes

- `assets/visual-v105/service-corridor.png` é o fundo arquitetônico integrado ativamente ao motor.
- `assets/visual-v105/cafe-seat-jinx.png`, `cafe-seat-sierra.png`, `cafe-real-table-occlusion.png` estão integrados ao café.
- As imagens geradas de *prancha de walk cycles* e *arquivo de evidências* permanecem em `QA_V105/` como referências visuais, **não** foram declaradas animações jogáveis ou novos mapas, pois têm interface e personagens pintados e não sprites isolados. Os sprites jogáveis aprimorados V10.2 foram preservados.

## Arquivos modificados (comparação SHA-256 com V10.4)

- `club-engine.js`
- `club-story.js`
- `club.js`
- `coffee-sprites.js`
- `ghost.js`
- `index.html`
- `interlude.js`
- `interval.js`
- `tests/test_interlude_sprite_scale.js`
- `tests/test_p14_cafe_trace_regression_20261023.js`
- `tests/test_p2_render_collision_alignment.js`
- `tests/test_p48_club_live_pursuit.js`
- `tests/test_p49_homologacao_fuga_integral.js`
- `tests/test_qa_progression_ch5.js`
- `uprising.js`

## Limites

A suíte automatizada passou e foram verificadas cenas renderizadas e um percurso dirigido da fuga. Homologação integral da campanha e Android físico: pendentes. A V10.4 permanece como origem preservada e esta V10.5 é uma **candidata cumulativa de QA**.
