# Testes do comportamento atual

Execute os comandos a partir da raiz do checkout. Use Node com `WebSocket` e `fetch` globais (a linha de base usa Node 24). Instale dependências ausentes com `npm ci`, preservando o lockfile; nenhum pacote de automação adicional é necessário. No PowerShell que bloqueie `npm.ps1`, use `npm.cmd`.

Inicie o aplicativo real em um terminal:

```powershell
npm.cmd run dev-nolog -- --host 127.0.0.1
```

Em outro terminal, execute:

| Comando | Cobertura |
| --- | --- |
| `npm.cmd run test:quiz` | 19 casos de regras e APIs simuladas da UI do quiz; não renderiza navegador |
| `npm.cmd run test:quiz-visual` | Check de geometria/estados/recortes com doubles, movido de `tmp`; não renderiza navegador |
| `npm.cmd run test:scene-comparison` | Política de comparação do cenário: rejeita diferenças estáticas, duplicatas, objetos inesperados e geometria incorreta; aceita somente as variações temporais declaradas |
| `npm.cmd run test:menu` | Intro, três cartões utilizáveis e destinos, mouse nas bordas/ícones/rótulos, teclado, toque emulado, retorno real ao menu, reentradas, fontes e limpeza do editor |
| `npm.cmd run test:walk-editor` | Cenário compartilhado, seleção, arrastes, snap/Shift, cancelamento, terreno não selecionável, download real, integridade dos arquivos oficiais, descarte por recarga e retorno ao passeio |
| `npm.cmd run test:walk-ui` | Interface, diálogos, conclusão do passeio, menu e input; teste existente preservado |
| `npm.cmd run test:walk-animations` | Animações, percurso do tutor, colisões, diálogos, reentrada e editor; teste existente preservado |
| `npm.cmd run test:food-ui` | Instruções, partida, término, score, menu e reinício; teste existente preservado |
| `npm.cmd run test:browser` | Os cinco comandos de navegador acima, em sequência; para na primeira falha |
| `npm.cmd run test:walk-routes` | Verificação adicional de rotas em dev e na distribuição construída, cena definitiva, Saci/coração, animações e ausência das ferramentas em produção |
| `npm.cmd run build-nolog` | Build de produção sem executar `log.js` |
| `npm.cmd run test:distribution` | Após o build: bytes de todos os arquivos públicos, catálogo íntegro, ausência de pacotes de origem/prévias/prompts/perfis no pacote e de resíduos temporários no índice |

`test:browser` exige o servidor já iniciado; não instala ou baixa navegador, não inicia um servidor oculto e não executa os testes unitários. Rode também `test:quiz`, `test:scene-comparison`, `build-nolog` e `git diff --check` na verificação da etapa.

Na alimentação, a etapa 6 atualiza as expectativas para `Pontos`, `Tempo`,
`Partida finalizada!` e `Seus Pontos`. O check preserva os casos anteriores e
também mede o encaixe do HUD e do resultado, com pontos positivos/negativos em
PC e toque emulado, sem alterar a geometria para satisfazer o texto.

Depois de editar fontes com o Vite aberto, reinicie o servidor antes da validação
final. Os testes que localizam instâncias por import dinâmico precisam da mesma
classe carregada pelo jogo: URLs `?t=...` do HMR podem criar outra identidade de
módulo e impedir essa localização, mesmo com a cena aberta. A investigação da
etapa 4 registrou a diferença de construtores antes/depois do reinício; não se
alteram assertions ou tolerâncias para contorná-la.

## Verificar a distribuição de produção — etapa 3

A cena definitiva é `WalkGame`, em `src/game/scenes/WalkGame.js`. O atalho
compatível `?walkLearning` continua abrindo essa cena. Os testes e seus imports
dinâmicos usam o novo arquivo, classe e chave. Os scripts históricos de `tmp`
também tiveram essas referências atualizadas; seus baselines antigos continuam
preservados, com as divergências já documentadas em `organizacao-entrega.md`.

Na etapa 4, as fontes passaram a ser `src/game/data/walkMap.json` e
`public/assets/walk/walkLayout.json`, com cache JSON `walk-layout`. O teste do
editor também exige formato de exportação versão 1 intacto, novos caminhos em
`sources`, integridade oficial e ausência dos campos mortos do jogador/debug.
Valores efetivos e origem de cada configuração estão em
[configuracao-passeio.md](configuracao-passeio.md).

Além do servidor de desenvolvimento na porta 8080, construa e sirva o build
localmente em outro terminal, sem publicar:

```powershell
npm.cmd run build-nolog
node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 8081 --strictPort
```

Com ambos os servidores ativos, execute `npm.cmd run test:walk-routes`.
Esse comando é separado de `test:browser`, para preservar o uso deste último
com apenas o servidor de desenvolvimento. `WALK_UI_URL` seleciona a URL dev
(padrão `http://127.0.0.1:8080`) e `WALK_PROD_URL` a distribuição construída
(padrão `http://127.0.0.1:8081`). `WALK_EDGE_PATH` mantém a seleção do navegador.
Build ou servidor ausente provoca falha explícita; não é skip ou aprovação.

O teste adicional inspeciona o JavaScript gerado e o registro real de cenas.
Em produção, obtém o Game real pelo construtor exportado do chunk Phaser,
independentemente do nome minificado; não adiciona globals ao código do produto.
Confere a mesma política anterior das queries:

| Query | Desenvolvimento | Produção |
| --- | --- | --- |
| Nenhuma | Intro | Intro |
| `walkLearning` | WalkGame | WalkGame |
| `walkLayoutEditor` | WalkLayoutEditor | Intro |
| `walkLayoutEditor&walkLearning` | WalkLayoutEditor | WalkGame |
| `saciQuiz` | SaciGame, partida | Intro |
| `quizVisual` | SaciGame, demonstração/inspetor | Intro |
| `quizVisual&walkLearning` | SaciGame, demonstração/inspetor | WalkGame |

Exercita também menu → passeio → menu/reentrada, teclado nos dois ambientes,
Saci/coração, colisores e avanço dos três sprites animados. Na produção, testa
toque emulado, direcional, diálogo real do tutor, conclusão e reentrada sem
progresso residual. A suíte existente continua verificando os sete cuidados,
colisões detalhadas, editor, animações, controles e os demais jogos.

Capturas e relatório adicional ficam em `tmp/walk-ui-validation/routes/`, já
ignorado pelo Git. Toque emulado e WebGL/SwiftShader continuam sem substituir
aparelho físico, GPU de hardware ou Canvas real.

## Selecionar o navegador e a URL

Os testes usam CDP em um Chromium instalado, como Edge ou Chrome, em modo headless. O padrão continua sendo `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`. Não há suporte a Firefox por essa interface.

```powershell
# Um executável instalado nesta máquina; ajuste o caminho conforme necessário.
$env:WALK_EDGE_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm.cmd run test:browser
```

| Teste | Executável, em ordem de prioridade | URL e padrão |
| --- | --- | --- |
| Menu | `PET_EDUCA_EDGE_PATH`, depois `WALK_EDGE_PATH`, depois Edge padrão | `PET_EDUCA_URL`, padrão `http://127.0.0.1:8080` |
| Editor | `WALK_EDGE_PATH`, depois Edge padrão | `WALK_EDITOR_URL`, padrão `http://127.0.0.1:8080` |
| Passeio e animações | `WALK_EDGE_PATH`, depois Edge padrão | `WALK_UI_URL`, padrão `http://localhost:8080` |
| Alimentação | `WALK_EDGE_PATH`, depois Edge padrão | `FOOD_UI_URL`, padrão `http://localhost:8080` |

A variável antiga do menu `PET_EDUCA_EDGE_PATH` permanece prioritária. Para um único navegador em toda a suíte, remova esse override específico ou atribua o mesmo executável às duas variáveis. As URLs antigas também permanecem compatíveis. Para outra porta, configure as quatro URLs; não altere a configuração funcional do Vite para satisfazer testes.

Nos dois testes movidos, um executável ausente produz uma mensagem que informa o caminho e as variáveis apropriadas e encerra com código diferente de zero. Não é skip nem aprovação. Falha de conexão ou timeout do CDP também encerra com falha. Se o ambiente impedir a execução real, registre **não executado** e mantenha a entrega candidata até obter validação; não trate doubles como alternativa visual. Na linha de base Windows, a sandbox encerra o Edge; foi necessária execução autorizada fora dela.

## Comparação do cenário no editor

`tests/WalkLayoutEditor.browser-check.mjs` substitui o arquivo que ficava em `src/game/dev`. O snapshot percorre os objetos texturizados, inclusive descendentes de containers. A política não elimina objetos pelo nome, prefixo, profundidade ou visibilidade. Identifica por referência os únicos proprietários de objetos de execução: `player`, `saci`, `saci.coracao`, `touchControls.visuals`, `dialogueSystem.progressUI`, `dialogueSystem.panel`, `interactionSystem.prompt` e `menuUI`. Seus objetos recebem os papéis explícitos jogador, Saci, coração e HUD. Um papel desconhecido é rejeitado. O teste exige que jogador, Saci e coração existam na cena jogável e que o editor não os contenha.

Todos os demais objetos permanecem na comparação, incluindo terreno, decoração, composições e tutor. Comparam-se textura, quantidade (incluindo duplicatas), posição, dimensões do frame, escala, origem, profundidade, rotação, visibilidade, alpha e espelhamento. A ordem de renderização é canonicalizada como multiconjunto, sem remover membros.

Exceções temporais limitadas em `tests/helpers/walkSceneComparison.mjs`:

- `plaza-fountain-water`: apenas fase do frame, limitada a 0–5, com frame de 160 × 128.
- `plaza-spring-rider`: apenas fase do frame, limitada a 0–11, com frame de 96 × 96.
- `npc-tutor-cachorro-guia`: fase 0–3, frame de 128 × 64; no jogo, X deve estar no percurso 448–640. O editor deve manter a âncora X = 544. Apenas esse X e `flipX` são normalizados; Y, escala, origem, profundidade e demais propriedades continuam comparados. O teste existente de animações continua responsável por velocidade, pausas, espelhamento efetivo e colisão móvel.

Os testes unitários da política introduzem diferenças deliberadas em posições, dimensões, escalas, profundidade, frames estáticos, duplicatas e sprites adicionais para garantir que continuem provocando falha. Isso valida a lógica da comparação, não a renderização; a comparação também é exercitada no Edge contra as cenas reais.

As assertions existentes de IDs, contagens, grupos, offsets, posições, metadados do JSON, terreno, seleção sem deslocamento, arraste composto e hashes oficiais foram mantidas. O teste de cancelamento aciona o mouse por CDP e envia `pointercancel`/`lostpointercapture` ao handler do canvas real: valida encerramento do arraste e ausência de movimento posterior, sem alegar cancelamento por hardware. Recarregar continua devendo descartar todo o rascunho.

## Evidências e limites

O teste do menu foi movido de `src/game/ui` para `tests/petEducaUI.browser-check.mjs`. Preserva textos, medidas, fontes, filtragem, contatos simultâneos, reentradas, limpeza e erros/timeout de fontes. A expectativa de quiz indisponível foi substituída após confirmar `SaciGame` no registro e no terceiro cartão do menu; agora também exige uma rodada de 15 perguntas inicialmente zerada. Os retornos dos três jogos usam controles reais, por teclado/mouse ou toque emulado. Somente o cenário específico de limpeza do editor usa troca programática de cena, pois não existe botão de saída no editor.

Menu: viewports 1280 × 720 (DPR 1) e 740 × 360 (DPR 2, canvas exibido 640 × 360). O toque é habilitado antes de inicializar uma página nova, pois Phaser detecta capacidades na abertura. Passeio e alimentação mantêm seus próprios viewports de linha de base (1280 × 720 e 844 × 390). O editor usa o tamanho de janela já previsto em seu teste e registra capturas reais. Toque é emulado e WebGL pode usar SwiftShader; nenhum desses resultados comprova celular físico, GPU de hardware ou renderizador Canvas real.

Toda a pasta `/tmp/` é ignorada pelo Git desde a etapa 5. Saídas, fora de `public`: `tmp/pet-educa-check-*`, `tmp/walk-editor-check-*`, `tmp/walk-ui-validation`, `tmp/walk-animations-validation`, `tmp/food-ui-validation`, `tmp/distribution-validation` e `tmp/legacy-checks`. Os perfis novos ficam no diretório temporário do sistema, fora do checkout; não devem integrar commits ou relatórios de conteúdo privado.

As execuções e resultados datados estão em [organizacao-entrega.md](organizacao-entrega.md). Os relatórios antigos em `tmp/walk-player-l1-validation`, `tmp/walk-player-l2-validation` e `tmp/walk-manual-v2-validation` continuam sendo registros históricos: não foram regenerados nem incluídos na suíte atual. Suas falhas da etapa 0 estão preservadas no diagnóstico.

Na etapa 5, esses relatórios deixaram o índice, mantendo as cópias locais e o
arquivo externo de evidências. Os três scripts úteis estão em
`tools/legacy-checks`, com a fixture histórica intacta em
`tests/fixtures/walk-history/l1-baseline.json`; comandos e limitações estão no
[README das ferramentas](../tools/legacy-checks/README.md). O check antigo do quiz
passou a `tests/quizSaciVisual.check.mjs`, comando `test:quiz-visual`. Referências
datadas a `tmp` nos relatos anteriores indicam sua localização naquela execução.
Os pacotes originais de arte ficam em [art-source](../art-source/README.md), fora
do build. O relatório de `test:distribution` fica em
`tmp/distribution-validation/report.json`.
