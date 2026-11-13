# Sierra & Aura: Golden Silence — Café 02:17 / polimento narrativo

**Base:** `SIERRA_AURA_RC73_V108_HOTSPOTS_PADRONIZACAO_PILOTO_QA_20261107 (2).zip`  
**Data:** 10/11/2026  
**Status:** candidata de polimento; não homologada visualmente.

## Alterações

1. **Quatro entradas narrativas no Café:** Alexandra, Aura, conversa cotidiana e silêncio. Cada rota possui respostas próprias; Alexandra e Aura mantêm subescolhas de três alternativas.
2. **Consequências preservadas:** `choice_cafeTopic`, `choice_alex` e `choice_aura` são registradas separadamente. O segundo beat do café responde ao assunto e à subescolha realmente feita.
3. **Jinx e Sierra:** falas mais curtas, provocações, discordâncias e humor seco. A rota de Alexandra não atribui a Jinx conhecimento sobre sentimentos que Sierra não compartilhou.
4. **Caminhada sem bloqueio:** walk1, walk2, returnBeat e returnLate usam falas ambientais no canal de rádio. O estado continua `playing`, a velocidade não é zerada e Sierra pode seguir andando.
5. **Café físico:** ações para girar a xícara, observar o balcão e olhar a rua; gestos discretos de postura, foco de câmera e marcadores visuais de atitude nos retratos.
6. **Compatibilidade:** atualização do merge P54 para não reaplicar encenações por índices antigos; revisão dos testes estruturais e atualização dos identificadores de cache dos arquivos alterados.

## Verificação executada

- `node tests/run-current-qa.js`: **95/95 testes aprovados**.
- Novo teste `tests/test_cafe_editorial_polish.js`: quatro rotas, isolamento das escolhas, continuidade do movimento durante falas ambientais, acessibilidade da quarta opção e ações de xícara/balcão.
- Testes de progressão do interlúdio, escolhas do Café, consentimento de Aura, continuidade narrativa, fuga, Depósito 47 e regressões gerais continuam aprovados.

## Limite de homologação

A suíte acima valida lógica e contratos automatizados, não a qualidade visual do jogo renderizado. A tentativa de abrir a build local no Chromium foi bloqueada pelo ambiente (`ERR_BLOCKED_BY_ADMINISTRATOR`). A sessão remota KERNEL também não alcançou o servidor local porque o túnel de encaminhamento não estava ativo (`ERR_CONNECTION_REFUSED`).

Portanto, **não declaro homologação visual nem playthrough real desta candidata**. Permanecem pendentes a inspeção do layout de quatro escolhas em desktop/mobile, o enquadramento do gesto do balcão, a leitura das falas ambientais em movimento e a confirmação jogada do fluxo completo do Café.

Nenhuma publicação no itch.io ou no site GPT foi realizada.
