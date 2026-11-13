# SIERRA & AURA: GOLDEN SILENCE | BUILD ÚNICA INTEGRADA · REVISÃO ESCONDERIJO / ENLACE / MEI

**Origem integral:** SIERRA_AURA_GOLDEN_SILENCE_BUILD_UNICA_INTEGRADA.zip (345 arquivos). Esta revisão foi mesclada contra essa ZIP fornecida, preservando os scripts e assets anteriores de P61/P62, a gaveta aberta de Aura, o scanner, HUD, oito capítulos, escolhas e salvamento. Nenhuma mudança foi publicada no itch.io automaticamente.

## Integração implementada

- Capítulo 1: trecho de acesso clandestino ao esconderijo, cenário composto de passagem de manutenção e ambiente doméstico; eliminação de repetição de catracas na arte deste trecho; pistas offline preservadas (fita, índice, câmera, entrada), contato de pés com o chão.
- Mobile: SCAN ativado no início do toque, E / USAR com área física sensível, agachar representado por ↓, responsividade visual e dimensionamento de controles.
- Corte 2→3: acordo explícito e autorização do enlace, sequência visual com retratos e pulsos dos circuitos, Capítulo 3 inicia nos relés, não repete a conversa do Cap. 2. Flags de consentimento registradas.
- Cadillac: duas máscaras de rodas da arte original (traseira e dianteira), centros de giro ajustados e animação de rotação; carroceria base preservada.
- Ghost Track: proporção do sprite de Sierra padronizada no quarto, terminal de Alexandra com função narrativa contextualizada; último sinal visualizado como câmera de segurança de segundos com Alexandra em uma cela e fala "Espera...". Sem garantir que a captura seja atual.
- Mei: sprite branco de pelo longo em quatro estados (sentada, andar, explorar, aproximar), com pequenas decisões próprias sem interferir na lógica dos puzzles.

## QA desta integração

- Integridade e regressões: TODOS os 345 arquivos originais preservados; 11 arquivos originais de código/markup/estilo mesclados; 8 novos assets/scripts acrescentados. Sintaxe JavaScript: 61/61.
- Testes legados Node: 77/79 passaram. Dois contratos antigos esperam explicitamente (1) a escala 1850/1200 do Ghost Track que foi corrigida e (2) a textura relay-corridor.png da galeria que foi substituída pelo esconderijo. Não são tratados como aprovados.
- Chromium: 10 estados de cena por dispositivo, 20/20 desktop e mobile sem erros JS ou arquivos ausentes. São fixtures de cena, NÃO campanha jogada em sequência.
- Enlace Capítulos 2→3: escolhas reais e botões de continuação, aprovado em desktop e mobile com Capítulo 3 entrando em relay.
- Toque mobile: pointerdown de SCAN e toque no USAR validados no primeiro capítulo; o uso concluiu a calibração da bancada.
- Testes adicionais P60 de cenas: 9 por dispositivo (18/18), sem JavaScript error ou asset ausente.
- CRC ZIP: validado no empacotamento.

**Não homologado integralmente:** uma partida contínua do prólogo ao fim dos oito capítulos não foi completada; não houve teste nesta revisão em aparelho Android físico nem validação da versão final na hospedagem itch.io. A publicação anterior continua intacta. Use esta build para substituir a anterior somente depois de guardar a versão em uso.

## Como executar

Extrair todo o conteúdo em uma pasta, mantendo `index.html` na raiz, ou enviar o ZIP completo como jogo HTML5 no itch.io. Não misturar com os arquivos descompactados da versão anterior.
