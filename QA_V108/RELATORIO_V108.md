# Sierra & Aura — RC73 V10.8 / Padronização de hotspots (piloto)

## Diretriz de aceite
O relatório apresentado pela usuária passa a ser o diagnóstico de referência da V10.7: **110 hotspots em 22 cenas**, amplitude de 60–185 px, inconsistências de raio, foco, geometria, animação e escala de cenários. São **não conformidades a tratar**, não sugestões opcionais. Esses números são o inventário fornecido pelo relatório externo, e não uma segunda auditoria de 110 pontos efetuada nesta rodada.

## Implementado efetivamente na V10.8
- V10.7 preservada em arquivo ZIP; apenas 6 arquivos preexistentes foram alterados, nenhum removido.
- Piloto de geometria **declarativa, normalizada entre 0 e 1** em 3 cenários/26 hotspots: apartamento de Aura, casa de Sierra no Cap. 6 e estúdio de Alexandra no Cap. 6. Registro `hotspot-registry-v108.js` com `uid` `chNN_cena_tipo_NNN`, tipos `examinar`, `pegar`, `usar`, `falar` e `transicao`, nome, coordenadas, prioridade e raio. Identificadores antigos preservados para não interromper escolhas, checkpoints e eventos.
- Prioridade de foco baseada na rotina original do jogo; raio de 65 px para objetos densos no estúdio (banheiro, geladeira, sofá), 100 px nos demais, mínimo de 48 px de diâmetro por objeto.
- Capítulo 2: o hotspot do vinil ganhou um **sprite visual próprio de discos**, junto à posição interativa existente. Não há item invisível descolado do cenário no ponto migrado. Acesso condicionado à descoberta da estante foi mantido.
- Auditoria de hotspots com overlay de alcance/IDs acionado por **F8**; botão de toque disponível somente ao abrir com `?qa=hotspots`. Overlay não aparece na demo pública por padrão.
- Sem alterações às falas de Sierra/Aura, à fuga do clube, ao Cadillac, aos sprites de caminhada ou à tela de carregamento original.

## Evidência de execução
- `node tests/run-current-qa.js`: **94/94 aprovados**, incluindo `tests/test_v108_hotspot_standard.js` (26 UIDs únicos, normalização, raios, foco e disponibilidade do overlay).
- Chromium isolado executou a **build realmente carregada**, com `ready=true`, 8 frames iniciais e 5 assets de Ghost, sem exceções JavaScript e sem requisições de assets ausentes. Foram capturados o apartamento com vinil e o overlay em dois cenários (`QA_V108/`). O navegador foi colocado diretamente nos estados alvo para verificação; **isso não equivale a jogar o capítulo integral**.
- O fundo do estúdio atual desenha um sofá na mesma região do hotspot 480. A suspeita espacial do diagnóstico continua como item de QA para qualquer composição alternativa: não se deslocou o sofá para a mesa de áudio e não se promoveu correção não sustentada que criaria regressão.

## Não conformidades ainda abertas — não declarar como resolvidas
1. Migração declarativa dos demais cenários e hotspots do inventário externo (alvo total: 22/110; concluído: 3/26). Homologar o foco mouse/toque/teclado e prioridade no mapa real de cada cena.
2. Cobertura da matriz completa de animação personagem × estado, em especial deslocamento lateral de Jinx (29,6 px) e Alexandra (20,3 px), direção, pivôs, idles e transições.
3. Normalização/validação de escalas visuais por cena: diferenças relatadas de 1,93× no distrito e 0,66× no terraço; testar câmera, oclusão e área caminhável.
4. Playthrough **contínuo real** prólogo → FIM DA DEMO, sem saltos entre capítulos; hospedagem real, saves e recuperação; mobile real ou emulado com toque.

## Decisão de qualidade
Candidata técnica V10.8, **ainda não homologada para lançamento**. O diagnóstico foi aceito como requisito vinculante; aceitação de um defeito não é prova de que a correção foi visualmente homologada. A V10.7 continua preservada. Nenhuma publicação itch.io foi alterada.
