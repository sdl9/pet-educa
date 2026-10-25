# Configuração vigente do passeio

A etapa 4 mantém dois contratos separados, sem mudar o formato dos dados úteis:

- `src/game/data/walkMap.json` (antes `walkStage18Map.json`): composição ambiental,
  interações educativas e cuidados obrigatórios. Importado pela cena e pelo editor.
- `public/assets/walk/walkLayout.json` (antes `walk-prototype-layout.json`): mundo,
  terreno, cercas, decorações e placements. Carregado pelo catálogo na chave JSON
  `walk-layout` e usado pelos builders, cena e editor. É a fonte vigente da praça.

O Preloader chama `preloadAnimatedWalkAssets`, que lê `WALK_JSON_ASSETS` em
`walkAssetCatalog.js`. A textura antiga `walk-map` continua sendo uma imagem;
não foi renomeada nem confundida com o novo arquivo de dados `walkMap.json`.

## Valores conferidos na entrada e preservados

A entrada da etapa é `baa91259e4ab0bad8066d11d149e374e4d6973bc`. Antes de editar,
os dois JSONs completos e uma medição do aplicativo real foram registrados em
`$env:TEMP\pet-educa-etapa-4-20261024\dados-entrada.json`. Esse registro preserva
todas as posições e dados, inclusive os metadados removidos; o mapa atual mantém
os mesmos bytes do mapa de entrada. O backup está descrito em
[organizacao-entrega.md](organizacao-entrega.md).

| Propriedade efetiva | Valor e fonte |
| --- | --- |
| Mundo | 1600 × 896, grade 50 × 28 e tiles de 32 px, em `walkLayout.world` |
| Grama | Variante pelo módulo 17, em `terrain.grassVariantModulo` |
| Caminho vertical | Colunas 23–26, linhas 1–26 |
| Caminho horizontal | Colunas 2–47, linhas 12–15 |
| Água | Colunas 4–10, linhas 4–8; colisor de terreno |
| Terra | Colunas 38–44, linhas 4–8 |
| Cerca | X 1/48, Y 1/26, abertura inferior nas colunas 24/25 |
| Decorações | Dez registros, com tiles e coordenadas preservados no layout |
| Início do jogador | `(800, 832)`, argumentos de `new WalkPlayer` em `WalkGame.js` |
| Velocidade do jogador | 200 px/s, `WalkPlayer.velocidade`; diagonal normalizada |
| Escala/origem do jogador | 1,5; `(0.5, 61/64)` em `WalkPlayer.js` |
| Frame do jogador | 64 × 64 no catálogo, 16 frames; quatro animações a 8 fps na classe |
| Corpo do jogador | Shape 28 × 28, offset `(18, 34)` no manifesto; corpo real 42 × 42 após escala |
| Câmera do jogo | Limites do mundo, zoom 1, segue jogador com lerp `(0.15, 0.15)`; canvas 1280 × 720 com FIT |
| Câmera do editor | Mesmo mundo, painel de 300 px; zoom mínimo entre largura disponível/mundo e altura/mundo |
| Colisões estáticas | 37 corpos na entrada real: água, cerca e objetos; shapes do `collision-depth-manifest.json`, aplicados por `WalkCollisionBuilder` |
| Composição ambiental | 24 registros, ordem, chaves, posições, camadas e flags de colisão intactos no mapa |
| Escalas ambientais especiais | Hidrante 0,6; bicicletário 0,7; fonte 1,25; demais 1, em `walkVisualConfig.js` |
| Tutor | Escala 1,8; início `(544, 368)`, percurso X 448–640, 48 px/s e pausa 320 ms, em `WalkTutorPatrol.js` |
| Estande | Escala 1,35; humanos 1,5, recuos X −16/Y −12, em `walkVisualConfig.js` |
| Descanso | Escala 1,35, pessoa 1,5, offsets pessoa `(−24, 0)` e cão `(32, 0)` |

Os placements permanecem `(544,368)` tutor, `(1136,352)` estande,
`(1312,192)` Saci, `(368,592)` descanso, `(560,592)` bebedouro,
`(608,592)` pote, `(944,352)` placa e `(960,640)` lixeira. Nem todos comandam
visuais: tutor e descanso vêm das interações; placa e lixeira não são criadas
por esses placements. O bebedouro/pote usam seus X e o Y da interação `agua`.
Esses registros foram preservados, inclusive para conferência das ferramentas.

| Interação | Ponto inicial | Raio | Cuidados |
| --- | --- | --- | --- |
| guia | `(544, 368)` | 120 | guia; posição acompanha o tutor durante a execução |
| feevalepet | `(1110, 350)` | 105 | feevalepet |
| veterinaria | `(1184, 350)` | 105 | guarda, brincadeiras, cuidados; três tópicos |
| descanso | `(368, 592)` | 125 | descanso |
| agua | `(560, 592)` | 125 | agua |

São sete cuidados obrigatórios na mesma ordem: guia, feevalepet, guarda,
brincadeiras, cuidados, descanso e agua. Rótulos, diálogos, controles PC/toque,
animações, regras de conclusão e colisões não foram alterados.

## Metadados e campos sem efeito

O bloco `player` do layout declarava X 800, Y 784, velocidade 240 e frame 64 × 64.
Nenhum consumidor o lia: a cena, classe e catálogo já forneciam os valores acima.
Foi removido para não sugerir uma configuração que não funcionava. Não houve
migração dos valores reais para JSON. Também foi retirado `controls.debugKey: C`,
sem handler de depuração; C continua selecionando o terceiro tópico do diálogo.
`controls.keyboard/touch` permanecem descritivos;
os handlers reais ficam na cena, em `DirectionInput` e `VirtualDPad`.

`version`, `validationStatus`, `purpose`, `stage: 18` e `acceptance` são metadados
ou critérios documentais, não comandos da cena. O número 18 registra a integração
anterior, não uma fase selecionável do jogo. Foram preservados; somente a descrição
do layout foi corrigida para identificar sua função vigente.

`walkAssetCatalog.js` é mantido manualmente. Não existe neste checkout
`scripts/build_runtime_asset_catalog.py`, outro gerador ou uma fonte reproduzível
do catálogo completo. Manifestos ajudam a conferir entradas, mas não constituem
um processo de geração disponível. A antiga instrução de geração foi retirada;
nenhum gerador foi inventado e o inventário não foi regravado.

## Editor e referências históricas

A exportação continua `walk-layout-draft`, versão 1, com os mesmos campos, IDs,
grupos, membros, offsets, posições, data e nome de download `walk-layout-draft.json`.
Somente `sources.ambient` e `sources.placements` apontam para os novos caminhos.
O rascunho de referência em `docs/layout` recebeu a mesma atualização de origem.
Os relatórios/snapshots históricos em `tmp` mantêm seus caminhos datados.

O prompt original do pacote de assets continua intacto para reprodução histórica;
onde cita `WalkGameLearning.js`/`walkStage18Map.json`, os equivalentes atuais são
`WalkGame.js`/`walkMap.json`. O editor continua exclusivo de desenvolvimento.
Comandos e variáveis de navegador estão em [testes-navegador.md](testes-navegador.md).
