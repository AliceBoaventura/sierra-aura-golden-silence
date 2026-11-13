# Sierra & Aura: Golden Silence — V10.7 / candidata pública

## Escopo efetivo

Base preservada: `SIERRA_AURA_RC73_V106_CADILLAC_RASTROS_QA_CANDIDATA_20261107.zip` (SHA-256 `b85522c7b7015401c315ac87a2915049ba90b5141187078a9a6323a0cc36ac83`). Nenhuma publicação remota foi alterada. A V10.6 permanece recuperável como arquivo independente.

Mudanças: prólogo reescrito em cinco cenas sem alterar avanço; oito teses dramáticas em transições; seleção de capítulos com objetivos mais claros; chamadas iniciais curtas; sete ajustes autorais em diálogos já existentes; diário opcional com contexto de investigação, observações dependentes de flags e dicas explicitamente solicitadas; encerramento do Depósito 47 com pergunta baseada no caso e botão para rever o diário.

Não mudou: assets de personagem e cenário, câmera, hitboxes, velocidade, scanner, sistema de investigação, escolhas/IDs, flags, modelo de salvamento, áudio, tela de carregamento original, transição até o Cadillac ou os acontecimentos pós-demo.

## Cobertura de QA

- **93/93** testes de Node da suíte atual (92 herdados + 1 novo de consistência editorial/estados da V10.7).
- **71/71** scripts JS de raiz analisados por `node --check`.
- **92/92** recursos locais em tags script/link do `index.html` presentes em disco.
- Auditadas nove mensagens temáticas (prólogo e capítulos 01–08), cinco telas canônicas de prólogo e sete cortes editoriais com a mesma contagem de escolhas/IDs.
- Teste do diário em Chromium **isolado** em 1365×768 e 390×844: abrir, mostrar informação do estado, revelar/ocultar dica, fechar, manter capítulo, sem exceções JS, sem estouro da seção na largura mobile.
- Comparação de arquivos contra a V10.6: nove arquivos modificados, quatro novos arquivos de runtime e um teste; 623 arquivos de pasta idênticos antes da inclusão do relatório. Nenhuma imagem ou áudio modificado.

## Limite de evidência

A navegação da build local pelo Chromium retornou `ERR_BLOCKED_BY_ADMINISTRATOR` ao abrir `http://127.0.0.1`. Os testes em Chromium cobrem **somente o componente de diário em uma página isolada**, não a campanha real. Não houve partida completa renderizada nesta rodada, nem teste real em Android físico, nem teste da V10.7 hospedada no itch.io. Por isso a V10.7 é **candidata pública com QA estrutural aprovado**, não build integralmente homologada para publicação.

A revisão do texto respeita as condições conhecidas do manuscrito e da campanha: autonomia e consentimento de Aura, amizade Sierra/Jinx, ambivalência de Alexandra, a ausência de causa comprovada pelos registros e a distinção entre observação e inferência. A pergunta final não identifica um culpado nem antecipa a história pós-demo.

## Aceite visual ainda obrigatório antes da publicação

Executar campanha contínua do prólogo ao interlúdio em navegador real; inspecionar movimento, proporções, física, hotspots e transições em todas as fases; executar a cena do café, fuga ao Cadillac, ECHO, Depósito 47, terminal de conclusão; testar controle touch, leitura do diário e restauração de save na hospedagem; capturar diferenças visuais antes/depois e fechar eventuais P0/P1. A suíte automatizada não substitui essas evidências.
