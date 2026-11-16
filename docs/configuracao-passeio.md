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

## Apresentação antes da exploração

Cada entrada em `WalkGame`, pelo menu ou por `?walkLearning`, abre a apresentação
"Hora do passeio!". `src/game/ui/walkInstructions.js` usa como referência direta
`foodInstructions.js`: mesmos assets de painel e botão verde, dimensões lógicas,
bordas/sombra, fontes Lilita One e Nunito Sans e cores de `PET_EDUCA_UI`. O texto
é renderizado pelo Phaser. Os emojis opcionais foram omitidos.

O texto menciona **7 cuidados**, conforme aprovado: continuam existindo **5 locais
de interação**, com 3 temas na veterinária. Mapa, diálogos e regras não mudaram.
O botão **Controles**, disponível após Começar, abre o texto original
`WALK_DIALOGUES.intro`, incluindo WASD/setas e Espaço, com apenas o botão Fechar.
Não é uma segunda
apresentação automática.

Enquanto `walkStarted` é falso, física, direcional, atualização do tutor e
interações do cenário ficam bloqueados. Uma camada fixa intercepta os eventos
de ponteiro, com Menu acessível acima dela. Começar exige pressão e soltura no
botão; cancelamento/arraste para fora não inicia. A soltura interrompe a
propagação antes de liberar a exploração. Teclas pendentes e toques são limpos.
Início e saída destroem a apresentação e removem seus listeners de input,
cancelamento e perda de foco; uma nova entrada recria uma única caixa.

Validação em 2026-11-03: passaram `test:walk-ui`, `test:walk-animations`,
`test:walk-editor`, `test:menu`, `test:walk-routes` (dev e produção),
`test:quiz` (21 casos), `test:quiz-visual` (doubles), `test:scene-comparison`
(4 casos), `build-nolog`, `test:distribution` e `git diff --check`.
O build manteve o aviso de chunk acima de 500 kB. O check da apresentação compara
painel/botão e título com o FoodGame real, mede os textos e testa bloqueio de
comandos, tecla pendente, cancelamento, propagação com `topOnly=false`, descarte e
contagens de eventos após reentrada. A suíte preservou os cinco locais, os três
temas da veterinária e a conclusão em sete cuidados. O editor confirmou o cenário
compartilhado intacto. Capturas de 1280 × 720, 844 × 390 e 740 × 360 foram
inspecionadas visualmente, sem cortes ou sobreposições. Edge headless com
WebGL/SwiftShader e toque emulado; não houve teste em aparelho físico.
Evidências: `tmp/walk-ui-validation/report.json`, PNGs nessa pasta e relatórios
em `tmp/walk-animations-validation`, `tmp/walk-ui-validation/routes` e
`tmp/walk-editor-check-*`.

## Interação por Espaço — 2026-11-03

O Passeio usa **Espaço** para iniciar uma interação e avançar/concluir páginas.
A origem do atalho adicional E era `WalkGame.create`, que registrava a tecla,
e `WalkGame.update`, que combinava E ou Espaço no sinal enviado ao diálogo.
O registro e a leitura de E foram removidos. `DirectionInput` só trata movimento;
`VirtualDPad` e os botões compartilhados não precisaram mudar.

As dicas do prompt, das páginas e do botão Controles indicam somente Espaço
como atalho de interação. O metadado `acceptance.keyboardInteractionKeys` em
`walkMap.json` passou a conter somente `SPACE`; posições, IDs, cinco locais e
sete cuidados foram preservados. A/B/C, Tab/setas/Enter e Escape mantêm suas
funções contextuais existentes. Toques e cliques usam os controles anteriores.

Na validação desta correção passaram `test:walk-ui`, `test:walk-animations`,
`test:walk-routes` (dev/produção), `test:menu`, `test:quiz` (21 casos),
`test:quiz-visual` (APIs simuladas), `test:scene-comparison` (4 casos),
`build-nolog`, `test:distribution` e `git diff --check`.
O build manteve o aviso de chunk acima de 500 kB.
Os testes reais no Edge conferiram E/e, Shift+E e repetição sem ações,
inclusive com botões focados, páginas abertas, temas e resultado. A rodada
completa foi concluída por Espaço e, separadamente, por toque emulado nos cinco
locais/sete cuidados. Uma pressão mantida de Espaço abre uma única página;
concluir não reabre o diálogo. Foram mantidos os testes de cliques, bloqueios,
cancelamento, retorno ao menu e contagens de eventos após reentrada.
As capturas do prompt, Controles e página móvel foram inspecionadas visualmente:
texto sem E como atalho e sem cortes. Isso não equivale a uma partida manual
ou teste em celular físico. Relatórios e PNGs em `tmp/walk-ui-validation`,
`tmp/walk-animations-validation` e `tmp/walk-ui-validation/routes`.

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
na etapa 5, foi movido com o pacote para `art-source/WalkGame_Assets_Animados`,
fora de `public` e da distribuição. Os scripts históricos úteis estão em
`tools/legacy-checks`, com fixture preservada em `tests/fixtures/walk-history`.
Onde o prompt cita `WalkGameLearning.js`/`walkStage18Map.json`, os equivalentes atuais são
`WalkGame.js`/`walkMap.json`. O editor continua exclusivo de desenvolvimento.
Comandos e variáveis de navegador estão em [testes-navegador.md](testes-navegador.md).
