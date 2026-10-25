# Pet Educa

Pet Educa é um jogo educativo sobre cuidados com animais. A apresentação do jogo
credita seu desenvolvimento à colaboração entre o projeto FeevalePet, da
Universidade Feevale, e a aluna Laíssa Dornelles Salles. Criado sem fins lucrativos,
convida a aprender sobre alimentação e cuidado responsável por meio de três minigames.

Esta entrega está no repositório [sdl9/pet-educa](https://github.com/sdl9/pet-educa).
As referências a `sdl9/proj-pet` nos materiais anteriores identificam a origem
histórica. Este README não indica uma URL pública do jogo: `homepage` nos
metadados aponta para a documentação do repositório.

## Jogos e apresentação atual

O fluxo normal é Boot → Preloader → Intro → MainMenu. Os três cartões estão
disponíveis e retornam ao mesmo menu:

| Minigame | Cena | Comportamento |
| --- | --- | --- |
| Jogo da Alimentação | `FoodGame` | Mover Caramelo, coletar alimentos adequados e evitar os inadequados; rodada de 60 segundos, Pontos e resultado |
| Passeio Consciente | `WalkGame` | Explorar a praça, conversar em cinco pontos e concluir sete cuidados, incluindo três tópicos da veterinária |
| Quiz do Saci | `SaciGame` | Responder 15 perguntas na ordem fornecida, receber feedback, avançar manualmente, ver o resultado e reiniciar |

A interface é horizontal, em resolução lógica **1280 × 720**. O Phaser usa
`Scale.FIT` e `CENTER_BOTH` para ajustar e centralizar o canvas no espaço disponível.
Em aparelhos com toque, use a orientação horizontal. Não há mecanismo de bloqueio
de orientação implementado.

As verificações registradas usam Edge headless/WebGL (SwiftShader), teclado,
mouse e toque emulado, incluindo viewports 1280 × 720, 844 × 390 e 740 × 360.
Isso não confirma funcionamento em todo navegador/dispositivo. Ainda é necessário
validar em celular físico; GPU de hardware e renderização Canvas real não foram
verificadas. As APIs simuladas de Canvas nos testes não equivalem a essa execução.

## Controles

| Tela/jogo | PC | Mouse e toque |
| --- | --- | --- |
| Intro e menu | Setas cima/baixo para foco; Enter/Espaço para ativar | Botão Menu e três cartões inteiros |
| Alimentação | WASD ou setas; Enter inicia e retorna do resultado; Escape volta ao menu | Continuar, direcional virtual e Menu, inclusive no resultado |
| Passeio | WASD ou setas; E/Espaço interage e avança; A/B/C seleciona tópicos; Tab/setas/Enter navega nos diálogos; Escape fecha quando permitido | Direcional, interação, opções/avanço e Menu |
| Quiz | Cima/baixo ou Tab para foco, Enter/Espaço para ativar ao soltar, Escape para Menu | Alternativas, avanço, reinício e retorno ao menu |

No passeio, o botão Menu permite sair durante exploração ou diálogo. Os controles
virtuais aparecem quando o navegador informa toque/ponteiro impreciso; `?touchControls`
também pode solicitá-los. O editor de layout usa mouse e não é uma fase jogável.

## Executar localmente

Use Node.js e npm. A linha de base dos testes utiliza **Node 24.19.0 / npm 11.17.0**,
com `fetch` e `WebSocket` globais. As versões resolvidas estão no lockfile:
Phaser 4.0.0 e Vite 6.4.3 nesta entrada. Instale com o lockfile, sem atualizá-lo:

```sh
git clone https://github.com/sdl9/pet-educa.git
cd pet-educa
npm ci
npm run dev-nolog -- --host 127.0.0.1 --strictPort
```

Abra `http://127.0.0.1:8080`. Confira a branch e as alterações locais antes de
editar; quando houver trabalho por etapas, siga a branch autorizada registrada
em [docs/organizacao-entrega.md](docs/organizacao-entrega.md).

No PowerShell que bloqueie `npm.ps1`, use `npm.cmd` em lugar de `npm`.
Os scripts `dev` e `build` do template foram preservados e executam `log.js`,
que faz uma requisição externa de métricas. Use **`dev-nolog` e `build-nolog`**;
eles não executam esse arquivo. Não é necessário removê-lo ou reformular os scripts.

## Build e publicação manual

```sh
npm run build-nolog
npm run test:distribution
node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 8081 --strictPort
```

O preview em `http://127.0.0.1:8081` serve o build local para conferência. Para
publicar manualmente, copie **todo o conteúdo de `dist/`** para a raiz de conteúdo
de um servidor HTTP estático, preservando nomes e caminhos. Confira ali a abertura
dos três jogos, fontes e ausência de 404. O build usa caminhos relativos no Vite,
mas HTML/CSS também têm referências a `/style.css` e `/favicon.png`; implantação
em subdiretório exige conferência própria e não é um suporte validado.

`art-source`, ferramentas, prompts e prévias de criação ficam fora de `public`
e do build. `test:distribution` confere essa separação e a integridade dos arquivos
públicos. O `dist.zip` local antigo não representa o build atual. Estes comandos
não fazem deploy; nenhum serviço de hospedagem ou jogo publicado é presumido.

## Testes

Execute a partir da raiz. Os testes de navegador precisam do servidor dev já
iniciado; `test:walk-routes` também precisa do build e preview na porta 8081.
O navegador deve estar instalado: os comandos não baixam um executável.

| Comando | O que verifica |
| --- | --- |
| `npm run test:quiz` | Regras das 15 perguntas e UI com doubles; não renderiza navegador |
| `npm run test:quiz-visual` | Geometria, estados e recortes nas APIs simuladas WebGL/Canvas |
| `npm run test:scene-comparison` | Política explícita de comparação entre cenário jogável e editor |
| `npm run test:menu` | Intro, três cartões/destinos, fontes, PC/toque emulado e retornos |
| `npm run test:walk-editor` | Cenário compartilhado, seleção/arraste/snap/cancelamento e exportação sem mudar dados oficiais |
| `npm run test:walk-ui` | Diálogos, sete cuidados, conclusão e reentrada no aplicativo real |
| `npm run test:walk-animations` | Animações, percurso/pausas/retomada do tutor, colisões e editor |
| `npm run test:food-ui` | Controles, coleta/pontuação, rótulos/encaixe, limpeza, rodada completa e reabertura |
| `npm run test:browser` | Menu, editor, passeio, animações e alimentação em sequência; para na primeira falha |
| `npm run test:walk-routes` | Rotas e cenas reais em dev/produção; ausência do editor/inspetor em produção |
| `npm run test:distribution` | Arquivos públicos iguais ao build por SHA-256, catálogo resolvido e ausência de resíduos/pacotes de origem |
| `git diff --check` | Espaçamento do diff local |

Os testes CDP usam um Chromium instalado, como Edge ou Chrome. O caminho padrão
é `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`. Para escolher
outro executável no PowerShell:

```powershell
$env:WALK_EDGE_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm.cmd run test:browser
```

O menu preserva `PET_EDUCA_EDGE_PATH` como override prioritário. URLs/variáveis,
requisitos, perfis temporários e limites estão em
[docs/testes-navegador.md](docs/testes-navegador.md). Falta de navegador/conexão
é falha de execução, não aprovação. Reinicie o dev após editar fontes antes da
validação final: imports dinâmicos dos testes podem ter identidade distinta das
URLs HMR com timestamp. Relatos datados de execução estão em
[docs/organizacao-entrega.md](docs/organizacao-entrega.md); não são uma validação
manual de aparelhos físicos.

## Estrutura e responsabilidades

| Caminho | Responsabilidade |
| --- | --- |
| `index.html`, `src/main.js`, `src/game/main.js` | Página, bootstrap e configuração/registro do Phaser |
| `src/game/scenes/` | Boot/Preloader carregam; Intro/MainMenu navegam; FoodGame, WalkGame e SaciGame coordenam as partidas |
| `src/game/objects/` | Player da alimentação, WalkPlayer, Saci e fábrica FoodObjects; comportamento dos objetos |
| `src/game/systems/` | Entrada/direcional, montagem visual e colisões do passeio, interações/diálogos, patrulha do tutor e estado da rodada do quiz |
| `src/game/data/` | Perguntas/diálogos, catálogos, configurações visuais/animações e contrato `walkMap.json` |
| `src/game/ui/` | Telas comuns, botões/painéis, molduras compartilhadas e interface do quiz |
| `src/game/dev/` | WalkLayoutEditor/WalkLayoutDraft e QuizVisualInspector, ferramentas exclusivas de desenvolvimento |
| `public/assets/`, `public/style.css` | Arquivos servidos pelo jogo, fontes locais/licenças e CSS |
| `art-source/` | Pacotes originais, referências e instruções de geração preservados fora da distribuição |
| `tests/`, `tools/` | Suíte atual, fixture histórica, diagnósticos legados e verificação da distribuição |
| `docs/`, `anotacoes.md` | Documentação técnica, registros de validação/recuperação e material de estudo |
| `tmp/`, `dist/`, `dist.zip` | Saídas locais ignoradas; não são fontes versionadas da aplicação |

O passeio usa dois contratos separados: `src/game/data/walkMap.json` contém
composição/interações/cuidados e `public/assets/walk/walkLayout.json` contém
mundo/terreno/placements. A configuração efetiva está em
[docs/configuracao-passeio.md](docs/configuracao-passeio.md). O catálogo é mantido
manualmente; não há gerador reproduzível dele neste checkout.

### Ferramentas de desenvolvimento

| Query | Destino |
| --- | --- |
| `?walkLearning` | Atalho compatível para `WalkGame`, em dev e produção |
| `?walkLayoutEditor` | Editor somente em dev; não fica acessível em produção |
| `?saciQuiz` | Partida do quiz diretamente, somente em dev |
| `?quizVisual` | Demonstração/inspetor visual do quiz em dev, sem rodada |

O editor reutiliza o cenário, sem jogador, Saci ou HUD da partida. Permite
selecionar/arrastar com mouse, snap de 16 px, Shift para arraste livre e exportar
`walk-layout-draft.json`. O rascunho fica em memória; recarregar o descarta, e o
download não altera os JSONs oficiais. A cena jogável aplica movimento, colisões,
patrulha, diálogos e progresso. Ferramentas históricas em
[tools/legacy-checks](tools/legacy-checks/README.md) têm snapshots antigos e
divergências conhecidas; não compõem a suíte atual.

## Autoria, origem e licenças

O crédito de desenvolvimento do **Pet Educa** é o informado na apresentação:
FeevalePet/Universidade Feevale e Laíssa Dornelles Salles. Isso é separado da
autoria das tecnologias e materiais reutilizados:

- Base do projeto: [Phaser Vite Template](https://github.com/phaserjs/template-vite),
  de Phaser Studio Inc. O [LICENSE](LICENSE) existente, MIT, mantém o copyright
  de 2025 de Phaser Studio Inc; não foi reatribuído ou substituído.
  Aviso original do template: The Phaser logo and characters are © 2011 - 2025
  Phaser Studio Inc. All rights reserved.
- Engine [Phaser](https://github.com/phaserjs/phaser), de Richard Davey/Phaser
  Studio Inc; Vite e demais dependências mantêm seus créditos/licenças nos pacotes.
- Lilita One: Juan Montoreano, SIL OFL 1.1, conforme
  [licença preservada](public/assets/pet-educa-ui/fonts/LICENSE-LilitaOne.txt).
- Nunito Sans: The Nunito Sans Project Authors, SIL OFL 1.1, conforme
  [licença preservada](public/assets/pet-educa-ui/fonts/LICENSE-NunitoSans.txt).
- Assets: materiais originais, manifestos, créditos disponíveis, licenças e
  referências de geração foram preservados em [art-source](art-source/README.md),
  com as cópias efetivas usadas em `public/assets`. Este README não atribui autoria
  individual de arte sem registro nem amplia a licença desses materiais.

## Contribuição e relatos

Use [este repositório](https://github.com/sdl9/pet-educa) para instalação e
contribuição. Relate problemas nas [issues](https://github.com/sdl9/pet-educa/issues),
incluindo versão/commit, navegador, viewport, tipo de entrada e passos para reproduzir.
Propostas podem ser apresentadas em [pull requests](https://github.com/sdl9/pet-educa/pulls).
Preserve os créditos, o lockfile, os dados e a recuperação do trabalho local.
Mudanças de comportamento devem indicar as verificações executadas e seus limites.
