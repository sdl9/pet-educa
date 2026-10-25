# Organização da entrega — Pet Educa

## Escopo e fluxo de branches

Registro da etapa 0, executada em 24/10/2026 (America/Sao_Paulo): linha de base, diagnóstico e recuperação. As etapas posteriores autorizadas estão registradas em suas próprias seções. Os limites específicos da etapa 0 abaixo são históricos. O ajuste de branches fornecido pela usuária prevalece sobre a orientação anterior de criar `organizacao-entrega`.

- Trabalhar somente na branch existente da etapa solicitada, conferindo-a antes de editar.
- A etapa 0 usa `etapa-0`; nenhuma branch foi criada ou trocada.
- A usuária criará cada próxima branch a partir da anterior após os commits da etapa concluída.
- Não avançar automaticamente; não fazer push, merge, publicação ou reescrita de histórico.
- Não modificar implementação, assets, configurações funcionais ou testes nesta etapa.

| Etapa | Branch | Commit de entrada | Commit de conclusão técnica | Pendências |
| --- | --- | --- | --- | --- |
| 0 | `etapa-0` | `dd334db2a1ffae306ce45c91bc04526821a76ac7` | `a06f1159a7caae3c41ae24eab78fc881b08c5347` | Expectativas históricas divergentes; aparelho físico e GPU de hardware não verificados |
| 1 | `etapa-1` | `140655f14ba60b65a98bfe469c34ee24c0fe9ef5` | `947b2cb2d1e6a0ff9ddb63bb0830b53aebea6c4e` | Pendência temporal encerrada pelo complemento abaixo; cobertura física/hardware permanece pendente |
| 1 — complemento de retomada | `etapa-1` | `77317bf82076adffea050f1d1e5060f2d60f32eb` | `28ecef3aa571d1ef8eecce6d9c476798559bacb1` | Sem pendência de sincronização identificada; limites da captura histórica detalhados abaixo |
| 2 | `etapa-2` | `4edf6a8bb46f1013ece46173d9932e0ce39baf8b` | `093f56271bf2792cb2c3fb4c9c86483c22f401d5` | Sem falha funcional identificada; limites físicos/hardware permanecem |
| 3 | `etapa-3` | `1ac7801f0ef38182be3e898772b7948832eff270` | `cdb772ff1f4d58778aefc3b8ebdc4248b107388e` | Scripts históricos divergentes; limites físicos/hardware permanecem |

O commit de conclusão técnica da etapa 0 contém o diagnóstico e a linha de base. Commits exclusivamente documentais posteriores registraram seu SHA e complementaram aquele encerramento, evitando a referência circular de um commit conter seu próprio SHA. O HEAD final da etapa 0 foi `140655f14ba60b65a98bfe469c34ee24c0fe9ef5`. A autorização posterior da etapa 1 está limitada à seção correspondente; não autoriza avançar à etapa 2.

## Identidade e estado de entrada

Conferências executadas nesta sessão:

- Raiz Git: `D:/ARQUIVOS/Documents/pet-educa`.
- `origin`, leitura e envio: `https://github.com/sdl9/pet-educa.git` em ambos os casos; não foram alterados.
- Branch e HEAD conferidos antes das mutações: `etapa-0`, `dd334db2a1ffae306ce45c91bc04526821a76ac7`.
- Referências locais encontradas: `etapa-0`, `main` e `origin/main`. Não houve checkout de `main`, fetch ou importação de histórico.
- `git status --porcelain=v2 --branch --untracked-files=all`: árvore limpa, sem arquivos novos não ignorados, staged, unstaged ou remoções. Diffs do índice e da árvore vazios.
- 306 arquivos versionados inventariados por caminho, tamanho e SHA-256 dos bytes locais.
- Nenhum `AGENTS.md` encontrado no checkout, nem nos diretórios ancestrais aplicáveis até a raiz do volume. Este documento não existia.

O contrato identifica a análise antiga em `sdl9/proj-pet`, branch `walk-game-l5-interactions`, commit `9ea98986d7807b6dde50f1e36d07da01de398876`. `git cat-file -t` confirmou que esse objeto não está disponível localmente; a branch também não aparece nas referências locais. Portanto, **não foi produzido diff Git com a referência histórica**. Sua ausência não bloqueia a etapa. O repositório original não foi acessado nem alterado.

O campo `repository` de `package.json` e o README ainda descrevem o template Phaser. Isso não substitui a identidade conferida pela raiz e por `origin`; fica como achado documental anterior, sem correção nesta etapa.

## Recuperação verificada

Diretório externo ao repositório: `$env:TEMP\pet-educa-etapa-0-20261024` (PowerShell). Ele é local e temporário: deve ser preservado enquanto esta linha de base for necessária.

| Artefato | Finalidade e conferência |
| --- | --- |
| `entrada.bundle` | Histórico completo alcançável de `etapa-0` na entrada; `git bundle verify` passou e confirmou a referência no HEAD de entrada |
| `entrada-bytes/` | Cópias dos 306 arquivos versionados, com caminhos relativos preservados; cada cópia comparada por SHA-256 ao manifesto de entrada |
| `arquivos-entrada.json` | Caminhos, tamanhos e SHA-256 dos bytes locais, incluindo diferenças de finais de linha em relação aos blobs Git |
| `estado-entrada.txt` | Branch, HEAD e status inicial |
| `staged.patch`, `unstaged.patch` | Diffs binários separados do índice e da árvore; ambos vazios na entrada |
| `checks-historicos-isolados/` | Cópia de trabalho descartável para os checks antigos que sobrescrevem relatórios em `tmp`; não é o backup imutável |

SHA-256 de `entrada.bundle`: `6CFFC0FD3A9B70EC702B7552DF0AA16440039FD5547CA4DFCE686888E127E0AE`.

Não havia alterações locais versionadas ou arquivos novos não ignorados a copiar separadamente. Os arquivos ignorados e desconhecidos não foram varridos nem limpos. Os testes criaram perfis de navegador novos fora do checkout; seu conteúdo não integra o backup, relatório, evidências ou commits. Capturas existentes e `dist.zip` versionados foram preservados.

Para recuperar sem destruir trabalho posterior, conferir primeiro o hash do bundle e executar `git bundle verify`, então clonar **o bundle local** em uma pasta nova com `git clone --branch etapa-0 <caminho-do-bundle> <nova-pasta>`. Para recuperar os bytes exatos de um arquivo, copiar seu caminho correspondente de `entrada-bytes/` para uma pasta de conferência e comparar o SHA-256 com `arquivos-entrada.json`. Não aplicar reset, clean ou restauração ampla sobre a árvore de trabalho atual. Nesta entrada não há mudanças staged/unstaged ou remoções a reaplicar. Em futuras etapas, esses estados e arquivos novos precisarão de backup próprio antes de qualquer mutação que os afete.

## Conteúdo lido e fluxo atual

Foram lidos `package.json`, lockfile, configurações Vite, entradas da aplicação, registro das cenas, Boot, Preloader, Intro, MainMenu, cenas dos três jogos, componentes de navegação, editor, controles, verificações existentes, README, anotações e os documentos de interface e integração em `docs`.

Fluxo normal real: `index.html` → `src/main.js` (DOMContentLoaded) → `StartGame` em `src/game/main.js` → `Boot` → `Preloader` → `Intro` → `MainMenu`. O preload carrega os assets e aguarda fontes locais antes de Intro, quiz e passeio. O menu abre três jogos disponíveis:

| Cartão | Cena utilizada | Comportamento de entrada e retorno |
| --- | --- | --- |
| Jogo da Alimentação | `FoodGame` | Instruções → Continuar/Enter → partida de 60 segundos → resultado; Menu/Escape retornam e a reentrada reinicia |
| Passeio Consciente | `WalkGameLearning` | Jogador, colisões, tutor animado e diálogos; sete cuidados, cinco pontos e três tópicos; Menu retorna |
| Quiz do Saci | `SaciGame` | 15 perguntas, resposta única, feedback, avanço manual, resultado, reinício e retorno ao menu |

Registro atual: `Boot`, `Preloader`, `Intro`, `MainMenu`, `FoodGame`, `SaciGame`, `WalkGame`, `WalkGameLearning`, `Game` e `GameOver`; `WalkLayoutEditor` é acrescentada somente em desenvolvimento. `WalkGame` tem o corpo do protótipo comentado. `Game` e `GameOver` são cenas remanescentes do template sem entrada pelo menu atual. Não se conclui que sejam removíveis.

Atalhos existentes, conferidos no código:

- `?walkLearning`: abre `WalkGameLearning`, também fora da condição DEV.
- `?walkLayoutEditor`: editor somente em DEV, com prioridade sobre as demais queries.
- `?saciQuiz`: partida do quiz somente em DEV.
- `?quizVisual`: demonstração visual do quiz e inspetor somente em DEV; sem rodada, e a flag é consumida para permitir reentrada normal pelo menu.
- `?touchControls`: solicita direcional virtual, além da detecção de dispositivo de toque.
- Intro/menu: mouse, toque, setas para foco, Enter/Espaço para ativação.
- Alimentação/passeio: setas ou WASD e direcional virtual. Alimentação: Enter para iniciar/retornar do resultado, Escape para Menu. Passeio: E/Espaço ou botão para interagir; Tab/Enter nos controles de diálogo; Escape respeita as restrições de fechamento. Menu permanece disponível durante exploração e diálogo.
- Quiz: setas/Tab, Enter/Espaço ao soltar e Escape para Menu; mouse/toque exigem pressão e soltura no mesmo controle.
- Editor: seleção/arraste por mouse, snap de 16 px, Shift para movimento livre, download de JSON provisório; recarregar descarta o rascunho, sem gravar os JSONs oficiais.

## Linha de base executada nesta sessão

Ambiente: Windows, Node `v24.19.0`, npm `11.17.0`, Vite instalado pelo lockfile `6.4.3`, Phaser `4.0.0`. `node_modules` não existia. `npm.cmd ci --no-audit --no-fund` instalou 28 pacotes sem alterar versões/lockfile. O npm avisou que o postinstall de esbuild não estava aprovado na política de scripts; não foi alterada essa política, e build/dev funcionaram. O PowerShell bloqueia `npm.ps1`; usou-se `npm.cmd` sem mudar a política do sistema.

Somente os scripts sem telemetria foram usados. `log.js` não foi executado. Servidor: `npm.cmd run dev-nolog -- --host 127.0.0.1`, porta 8080, encerrado ao terminar as verificações. Nenhum serviço foi publicado.

| Comando | Resultado atual |
| --- | --- |
| `npm.cmd run test:quiz` | Passou: 19/19; testes de lógica e objetos simulados de UI, sem comprovar renderização real |
| `npm.cmd run build-nolog` | Passou, código 0; aviso de chunk acima de 500 kB |
| `npm.cmd run test:walk-ui` | Passou no Edge real: 12 páginas medidas, NPCs, teclado, toque emulado, cinco pontos/sete cuidados, conclusão, Menu/reentrada e resposta/avanço no quiz |
| `npm.cmd run test:walk-animations` | Passou: três spritesheets, percurso, animações, colisão móvel, interação E/Espaço/toque, congelamento em diálogo, reentrada e arraste no editor |
| `npm.cmd run test:food-ui` | Passou: instruções, input, alternância/espaçamento, timer/spawn, término, score positivo/negativo, resultado único, retorno e reinício |
| `node src/game/ui/petEducaUI.browser-check.mjs` | Falhou, código 1, linha 176: espera o texto `Indisponível`, ausente porque `SaciGame` já está disponível |
| `node src/game/dev/WalkLayoutEditor.browser-check.mjs` | Falhou, código 1, linha 111: exige visuais integralmente iguais entre cena jogável e editor |
| `node tmp/walk-player-l1.browser-check.mjs` | Falhou, código 1, linha 129: hashes/inventário atuais diferem do `baseline.json` histórico |
| `node tmp/walk-player-l2.browser-check.mjs` | Falhou, código 1, linha 150: layout atual difere do snapshot L1 histórico |
| `node tmp/walk-manual-v2.browser-check.mjs` | Falhou, código 1, linha 144: conta 52 elementos contra 41 membros do rascunho editável, incluindo elementos exclusivos do jogo |
| `node tmp/quiz-visual-validation/check-ui.mjs` | Passou nas APIs simuladas WebGL/Canvas; não é teste de navegador |
| `node "$env:TEMP\pet-educa-etapa-0-20261024\fluxo-quiz-editor.mjs"` | Diagnóstico complementar fora do checkout: passou, código 0; cartões reais, quiz completo e reinício por mouse/toque, editor e limpeza do painel; sem erros de execução/console/assets |
| `git diff --check` e `git diff --cached --check` | Passaram; revisão restrita ao documento da etapa |

Os três checks históricos de `tmp` foram executados com seus scripts e arquivos inalterados em cópia externa, contra o aplicativo real servido pelo checkout. A primeira cópia via `git archive` normalizou finais de linha; L1 e L2 foram repetidos com cópias dos 306 arquivos verificadas byte a byte, mantendo as falhas. Os resultados definitivos estão nos logs com sufixo `-bytes`. Nenhum baseline foi regenerado e nenhuma expectativa foi trocada.

As três primeiras tentativas dos testes atuais de navegador, dentro da sandbox, encerraram a conexão com o Edge. As execuções autorizadas fora da sandbox passaram. Classificação: limitação do ambiente restrito, sem evidência de falha do jogo.

## Aplicativo real, medidas e evidências

Navegador instalado: Edge headless com WebGL/SwiftShader. Testes atuais em viewports `1280 × 720` e `844 × 390`, DPR 1, com mouse/teclado e toque **emulado**. O canvas lógico permanece `1280 × 720`, FIT/CENTER_BOTH; em `844 × 390`, o navegador mediu a área exibida em `693,328125 × 390`, com x `75` e y `0` (arredondamento do layout CSS).

Os testes existentes acessam cenas do Phaser via CDP e leem estado real. Alguns cenários reposicionam o jogador para alcançar NPCs, aceleram o TimerEvent da alimentação e injetam itens para conferir scores: são verificações instrumentadas no aplicativo real, não uma sessão manual contínua ou prova de toque físico. O diagnóstico temporário complementar usa os cartões reais, mouse/teclado/toque emulado e aguarda também os 60 segundos naturais da alimentação; não modifica o código do projeto.

Resultados efetivamente observados agora:

| Cenário | Evidência e limite |
| --- | --- |
| Intro → menu → três jogos → menu | Cartões reais exercitados no diagnóstico e testes atuais; os três estão disponíveis |
| Alimentação até o fim | Teste existente percorreu 60 ticks com aceleração e scores positivo/negativo; diagnóstico complementar também aguardou os 60 segundos naturais até timer zero e voltou por Enter |
| Passeio com diálogos e conclusão | Teste atual percorreu cinco pontos/sete cuidados, mediu 12 páginas, confirmou conclusão e retorno; usa reposicionamento do jogador para os casos de diálogo |
| Quiz com resposta, avanço e reinício | Duas rodadas completas de 15 perguntas, resultado 15/15, reinício para índice/acertos zero e retorno ao menu; mouse em 1280 × 720 e toque emulado em 844 × 390 |
| Editor em desenvolvimento | Abertura, painel, captura, arraste pelo teste de animações e remoção do painel ao retornar à Intro; teste integral antigo continua falhando na comparação inicial |

Capturas da conclusão do passeio, resultado da alimentação em celular horizontal, editor, menu, feedback longo da pergunta 13, resultado 15/15 no PC, pergunta 6 e reinício no celular horizontal foram abertas e inspecionadas visualmente nesta sessão. `fluxo-real/measurements.json`, no diretório externo da etapa, guarda viewport, DPR, renderer, canvas, retângulo exibido, imagens e limites de textos, incluindo feedbacks das perguntas 1, 6, 11, 13 e 15 nos dois viewports. Renderer observado: tipo 2 (WebGL).

O diagnóstico temporário teve tentativas parciais: duas expressões de inspeção e as aspas de um seletor precisaram de correção no próprio script; a troca de mouse para emulação de toque na mesma página foi substituída por uma página nova com a emulação ativa desde a inicialização. Esses erros do diagnóstico não foram classificados como falhas do jogo. `fluxo-real-final.log` registra o percurso e os 60 segundos naturais antes da interrupção posterior do diagnóstico; `fluxo-quiz-editor-final.log` e `fluxo-real/report.json` registram a execução complementar final, aprovada. O campo `foodElapsedMs` desse último JSON é nulo porque a espera natural já havia sido executada separadamente; não representa medição ausente do fluxo de término, comprovado pelo log e pela captura `food-result-natural-pc.png`.

Referências geométricas preservadas: mundo do passeio `1600 × 896`, início do jogador `(800, 832)`, escala `1,5`, velocidade `200`; fonte `(800, 470)`, escala `1,25`; tutor começa em `(544, 368)`, escala `1,8`, percorre X `448–640` a `48 px/s`, pausas de `320 ms`; editor com painel lógico de `300` px. Menu: três cartões em `(156, 194/344/494)`, `704 × 128`. Quiz: painéis das respostas `1032 × 112`, y `248/368/488`, molduras em escala 2. Nenhuma dessas medidas foi alterada.

Evidências atuais fora de `public`: `tmp/walk-ui-validation/`, `tmp/walk-animations-validation/`, `tmp/food-ui-validation/`, `tmp/pet-educa-check-Wt6Zlm/` e `tmp/walk-editor-check-VFP2Xp/`. São saídas locais ignoradas pelo Git; seus PNGs/JSONs foram copiados com comparação de hashes para `evidencias-checks-atuais/` no diretório externo da etapa. Os diagnósticos complementares já gravam diretamente em `fluxo-real/`, fora do checkout. Os logs definitivos dos checks antigos L1/L2 terminam em `-bytes.log`; os demais logs de comando também estão nesse diretório externo. `evidencias-sha256.json` inventaria 61 PNGs/JSONs atuais por hash. Nenhum perfil, cache, `dist`, `node_modules`, screenshot ou backup integra os commits.

## Diagnóstico e pendências

- O quiz já funciona no menu atual. O relato de indisponibilidade em `docs/pet-educa-ui.md` e seu teste antigo estão desatualizados; não foram corrigidos nesta etapa.
- A falha antiga de igualdade total do editor se reproduz: jogador, Saci, coração, direcional e UI não pertencem ao cenário editável. Frames animados e posição do tutor também variam entre capturas. O teste atual de animações confirma o editor e arraste sem executar o percurso do tutor.
- Os snapshots/hashes L1, L2 e do rascunho manual não representam integralmente o conteúdo atual. Sua falha foi medida antes de qualquer mudança no jogo; não é regressão introduzida pela etapa 0 nem justificativa para restaurar assets antigos.
- O catálogo de assets menciona `scripts/build_runtime_asset_catalog.py`, ausente neste checkout, como já relatado na documentação de integração. Catálogo, fontes dos assets, manifestos, licenças, créditos, arquivos de template e artefatos históricos permanecem preservados; não se deduz descarte seguro pelo nome.
- O aviso de chunk grande é anterior à organização. Não houve otimização/configuração nesta etapa.
- Ao recolher a saída final do servidor Vite, foram observados avisos repetidos sobre importar `public/assets/quiz-saci/quiz-saci-assets-manifest.json` a partir de JavaScript. O import já existe em `src/game/data/quizSaciAssets.js` na entrada. Classificação: achado anterior à organização, a investigar em etapa autorizada; build e verificações atuais de navegador passaram, com zero erros de execução/console/assets nos relatórios. Não foi corrigido.
- Não foram executados testes em celular físico, GPU de hardware ou renderizador Canvas real. A emulação não substitui esses cenários. Não são apresentados como validação executada.
- Relatos de execuções em datas anteriores, contidos nos outros documentos, são contexto histórico. Apenas as execuções descritas acima foram feitas agora; nenhuma comparação Git com o repositório antigo foi inventada.

Conferência de preservação: os 306 arquivos de entrada foram comparados novamente com seus SHA-256, sem divergências. A única alteração de entrega é este documento; implementação, assets, configurações funcionais, testes e lockfile permaneceram byte a byte iguais à entrada. Nenhum comportamento fora do escopo foi alterado.

Status da **etapa 0: aprovada tecnicamente para estabelecimento da linha de base e recuperação**, com as falhas anteriores e limitações de cobertura explicitadas. Isso não declara toda a suíte histórica aprovada nem valida aparelho físico/GPU de hardware. As pendências históricas ficam para decisão em etapas posteriores autorizadas. A etapa 1 não foi iniciada.

## Etapa 1 — testes do comportamento atual

Execução em 24/10/2026 (America/Sao_Paulo), após autorização explícita da usuária. Branch de entrada e trabalho: `etapa-1`, já existente, no HEAD `140655f14ba60b65a98bfe469c34ee24c0fe9ef5`. Branch conferida antes de editar; nenhuma branch criada ou trocada. A raiz e os URLs de leitura/envio de `origin` continuam sendo os registrados na etapa 0. Árvore inicial limpa: nenhum arquivo novo não ignorado, staged, unstaged ou removido. Nenhum AGENTS.md aplicável encontrado.

### Linha de base e recuperação

O HEAD inicial corresponde exatamente ao encerramento documental da etapa 0. `git diff 140655f14ba60b65a98bfe469c34ee24c0fe9ef5 HEAD` estava vazio, e os 306 hashes de arquivos da linha de base original foram conferidos sem divergência antes das mudanças. As duas falhas antigas foram inspecionadas nos scripts e relacionadas às execuções reais já registradas na etapa 0; esse relato anterior não é apresentado como uma nova execução dos originais nesta etapa.

Recuperação própria, fora do checkout: `$env:TEMP\pet-educa-etapa-1-20261024`.

- `entrada.bundle`: referência de entrada `etapa-1`, histórico completo alcançável, `git bundle verify` aprovado. SHA-256: `EBF05FEB146135185CB6D517CDF5A692724AE993DED0C119690E5F2A88842B9E`.
- `entrada-bytes/`: 307 arquivos de entrada, incluindo o documento da etapa 0, copiados com caminhos preservados e hashes dos bytes de cada cópia conferidos.
- `arquivos-entrada.json`, `estado-entrada.txt`, `staged.patch` e `unstaged.patch`: inventário e estado separado do índice/árvore, sem alterações ou remoções na entrada.
- Para recuperar: conferir hash e bundle, clonar o bundle em uma pasta nova e comparar arquivos específicos com `entrada-bytes/` e o manifesto. Não aplicar restauração ampla sobre trabalho posterior. Não houve stash, reset, clean, importação do histórico antigo ou alteração de remotes.

### Mudanças permitidas e comparação adotada

Os testes `src/game/ui/petEducaUI.browser-check.mjs` e `src/game/dev/WalkLayoutEditor.browser-check.mjs` foram movidos para `tests/petEducaUI.browser-check.mjs` e `tests/WalkLayoutEditor.browser-check.mjs`. Imports HTTP das cenas continuam apontando para os arquivos reais em `src`; caminhos de assets e hashes continuam relativos à raiz de execução. Nenhuma cena foi renomeada.

No menu, confirmou-se `SaciGame` no registro e no terceiro cartão de `PET_EDUCA_UI` antes de atualizar a expectativa histórica. O teste agora exige três cartões interativos, cada destino, rodada inicial do quiz zerada e 15 perguntas, bordas/ícones/rótulos, teclado com seleção circular e Enter/Espaço, toque emulado e retorno pelos controles reais dos três jogos. Medidas, textos da Intro, fontes, filtragem, contatos simultâneos, listeners, limpeza e erros/timeout de fontes foram preservados. A inicialização de toque usa página nova para refletir a detecção inicial do Phaser.

No editor, a política identifica por referência somente jogador, Saci, coração e proprietários explícitos do HUD, incluindo descendentes dos containers. Nenhum filtro por prefixo, profundidade, invisibilidade ou exclusão genérica de texturas foi introduzido. O multiconjunto do cenário retém duplicatas e objetos inesperados. A comparação preserva posição, dimensões, escala, origem, profundidade, rotação, alpha, visibilidade e frames estáticos. Apenas fases válidas dos três sprites animados e X/espelhamento horizontal do tutor no percurso declarado são normalizados; a âncora do editor é exigida, e Y e demais propriedades continuam comparados. A política completa está em [testes-navegador.md](testes-navegador.md), com quatro testes unitários que provocam diferenças deliberadas para garantir sua rejeição.

As assertions de seleção, arraste, snap, Shift, grupos/offsets, exportação por download real, hashes oficiais, terreno não selecionável, descarte ao recarregar e retorno à cena jogável foram mantidas. Foram acrescentados cancelamento e perda de captura, com mouse CDP e eventos enviados ao handler do canvas real. Não se afirma que esses eventos são cancelamento de hardware. O teste original era interrompido na igualdade total antes de alcançar essas verificações.

Novos comandos em `package.json`: `test:menu`, `test:walk-editor`, `test:scene-comparison` e `test:browser`. Os comandos existentes de quiz, passeio, animações e alimentação não foram alterados. Os arquivos desses testes também permanecem byte a byte iguais à entrada. Nenhuma dependência, versão, lockfile ou configuração funcional foi modificada. A documentação explica as variáveis antigas, o fallback compatível `WALK_EDGE_PATH` no menu e o erro explícito de navegador ausente.

Arquivos da etapa: os dois testes movidos; `tests/helpers/walkSceneComparison.mjs`; `tests/walkSceneComparison.test.js`; `package.json` (somente scripts); `docs/testes-navegador.md`; nota sobre testes atuais em `docs/pet-educa-ui.md`; este registro. Os relatos antigos e seus nomes de comandos foram preservados como históricos, com orientação atual no início da documentação.

### Verificação desta etapa

Servidor local: `npm.cmd run dev-nolog -- --host 127.0.0.1`, sem `log.js`, encerrado ao concluir a validação. Dependências já presentes pelo `npm ci` da etapa 0; nenhuma instalação nova. Navegador real: Edge headless/WebGL (SwiftShader), fora da sandbox conforme limitação já comprovada na etapa 0. Menu em 1280 × 720/DPR 1 e 740 × 360/DPR 2; emulação habilitada antes da abertura da página de toque. Editor mantém a janela 1600 × 1000 prevista no script. Passeio/alimentação mantêm 1280 × 720 e 844 × 390.

| Verificação executada agora | Resultado |
| --- | --- |
| `npm.cmd run test:quiz` | 19/19 passaram; objetos simulados e lógica, sem renderização real |
| `npm.cmd run test:scene-comparison` | 4/4 passaram; política rejeita diferenças úteis, sem alegação visual |
| `npm.cmd run build-nolog` | Passou; aviso anterior de chunk acima de 500 kB |
| `npm.cmd run test:menu` | Passou no navegador real: três cartões, teclado/toque, retornos, geometria, fontes, reentradas e cenários de erro |
| `npm.cmd run test:walk-editor` | Passou no navegador real: 1595 objetos do cenário compartilhado, geometria/invariantes, seleção/arraste/cancelamento, download, recarga e dados oficiais intactos |
| `npm.cmd run test:walk-ui` | Passou; teste existente preservado, incluindo diálogos, conclusão, menu e resposta/avanço no quiz |
| `npm.cmd run test:walk-animations` | Passou; teste existente preservado, incluindo percurso, colisões, reentrada e editor |
| `npm.cmd run test:food-ui` | Passou; teste existente preservado, incluindo término, scores, resultado e reinício |
| `npm.cmd run test:browser` | Última execução completa passou, código 0: menu, editor, passeio, animações e alimentação; tentativas anteriores detalhadas abaixo |
| Executável inexistente, menu/editor e fallback legado do menu | Três casos terminaram com código 1, mensagens explícitas e variável correta; nenhum falso sucesso |
| `node --check` nos dois testes movidos; `git diff --check` | Passaram |

A primeira execução agregada passou pelo menu e alcançou as novas verificações do editor, mas parou no ponto fixo antigo do teste de terreno. Os arrastes adicionais haviam ocupado essa coordenada com o hidrante; a tentativa de serializar a seleção completa produziu erro CDP de cadeia de referências. O teste passou a usar `(800, 600)`, ponto fixo do caminho vertical, com assertion explícita de ausência de objeto selecionável antes do gesto, e compara o ID selecionado com null. A assertion de não seleção e igualdade integral do rascunho após arraste do terreno foi preservada. A repetição do editor passou; nenhuma alteração de produção foi necessária.

Uma execução agregada intermediária passou menu/editor/passeio e falhou em `tests/walkAnimations.browser-check.mjs:194`: após uma espera fixa de 650 ms, a animação do tutor ainda estava pausada. O teste preservado passou tanto na execução isolada atual quanto contra uma cópia da entrada, e a última execução agregada completa também passou sem qualquer alteração de teste ou produção entre essas tentativas. Classificação: intermitência de uma assertion temporal em teste preexistente e inalterado; a causa exata não foi comprovada. Não se afirma reprodução da falha na entrada nem correção dessa intermitência, e nenhuma assertion foi removida ou relaxada. Ela permanece pendência explícita para investigação futura autorizada.

Para essa conferência adicional, `baseline-runtime/` no diretório externo contém 267 arquivos do aplicativo de entrada, todos comparados por SHA-256, e reutiliza as dependências instaladas por junction. Um servidor temporário na porta 8081 usou essas fontes. As primeiras tentativas não validaram o jogo: o watcher nativo do Windows encerrou uma delas (`fs-event.c`), e o alias 8.3 da pasta temporária causou 403 do Vite em outra. O lançador temporário passou a usar o caminho longo, polling e allowlist limitada à própria cópia e às dependências; nenhum arquivo de configuração do checkout foi modificado. A execução final do teste preservado contra essa cópia passou. O servidor adicional também foi encerrado.

Evidências e logs estão em `$env:TEMP\pet-educa-etapa-1-20261024`: `test-browser.log` (primeira tentativa), `test-editor-final.log`, `test-browser-final.log` (intermitência), `test-animations-baseline-caminho-longo.log` (entrada) e `test-browser-conclusao.log` (suíte completa aprovada). Capturas/JSONs atuais, inclusive download real do editor, foram copiados com hashes conferidos para `evidencias/`; nenhuma captura ou perfil entra no commit. Capturas do menu em celular horizontal e de seleção composta no editor foram abertas e inspecionadas visualmente.

Preservação final: 302 dos 307 arquivos de entrada, fora dos cinco caminhos explicitamente permitidos para alteração/movimentação (`package.json`, dois testes antigos e dois documentos existentes), mantiveram seus hashes. Isso inclui produção, assets, configurações Vite, lockfile e todos os testes existentes de quiz, passeio, animações e alimentação. A revisão de diff e arquivos novos confirmou somente os oito arquivos lógicos da etapa (contando cada movimentação como um arquivo), sem artefatos gerados. Não há alteração de comportamento funcional do jogo.

As falhas históricas L1/L2/manual em `tmp` não foram corrigidas, regeneradas ou incluídas no comando atual: são snapshots antigos documentados na etapa 0, fora dos dois testes solicitados. Os avisos de chunk e do import de manifesto em `public` permanecem achados anteriores. Não foram executados celular físico, GPU de hardware ou renderizador Canvas real. Essas limitações não são substituídas pelos doubles do quiz.

Status da **etapa 1: candidata com validação pendente**. A implementação dos testes solicitados está concluída e a última suíte agregada passou, mas permanece pendente esclarecer a intermitência observada no teste preservado de animações. Sua causa não foi comprovada nem sua falha reproduzida na cópia de entrada; portanto, ela não é descartada como limitação do ambiente ou declarada corrigida apenas por uma repetição verde. O commit `947b2cb2d1e6a0ff9ddb63bb0830b53aebea6c4e` reúne a implementação e os resultados; este registro acrescenta seu SHA em commit documental posterior, evitando referência circular ao próprio commit. A etapa 2 não foi iniciada; sem push, merge, publicação ou modificações de produção.

## Complemento da etapa 1 — investigação da retomada do tutor

Investigação autorizada em 24/10/2026, exclusivamente para a pendência acima. Branch conferida antes de editar: `etapa-1`, HEAD de entrada `77317bf82076adffea050f1d1e5060f2d60f32eb`, árvore limpa. Os commits `947b2cb` e `77317bf` foram preservados. Raiz e URLs de leitura/envio de `origin` conferidos e inalterados; nenhum AGENTS.md aplicável encontrado. Nenhuma branch criada/trocada e nenhuma etapa 2 executada.

### Recuperação deste complemento

Diretório externo: `$env:TEMP\pet-educa-tutor-investigacao-20261024`. `entrada.bundle` contém a referência de entrada e passou em `git bundle verify`; SHA-256 `D5E5868BE0667ABA652FF20F1A872BF485B79FF5C3C5DE2FE43C225F94FB7C5F`. Os 310 arquivos versionados de entrada foram copiados, com caminhos e hashes conferidos, para `entrada-bytes/`. `arquivos-entrada.json`, `estado-entrada.txt`, `staged.patch` e `unstaged.patch` registram o estado limpo e recuperável, inclusive o índice separado da árvore. Nenhum arquivo local alterado/novo não ignorado existia na entrada.

O bundle da entrada anterior `140655f` também foi novamente verificado, com o mesmo SHA-256 registrado na etapa 1. A cópia isolada `baseline-runtime/` daquela recuperação contém 267 arquivos do aplicativo, todos novamente comparados com seus hashes de entrada sem divergência. Ela foi servida na porta local 8081, enquanto o checkout atual usou 8080. Não houve checkout, importação de histórico ou substituição de arquivos atuais. Para recuperar, conferir o bundle e cloná-lo em uma pasta nova; os bytes locais exatos estão em `entrada-bytes/`. Não restaurar amplamente sobre trabalho posterior.

### Assertion e condições conhecidas

A falha histórica está em `tests/walkAnimations.browser-check.mjs:194` na versão de entrada: `assert.equal((await tutorState()).paused,false)`, depois de `await pause(650)` em Node. A verificação anterior exigia deslocamento menor que 35 px. O caso abre e conclui um diálogo real, verifica que o tutor ficou congelado e espera sua retomada.

O laço cobre direita/E, esquerda/Espaço, direita/toque e centro/E. Três casos possuem pausa de extremidade de 320 ms, e o último não. Na ocorrência histórica, o teste rodava no Edge headless/WebGL (SwiftShader), dentro da sequência menu → editor → passeio → animações. O log registra `true !== false`, sem erro de execução do navegador; não guardava o caso exato do laço, frames, deltas ou carga naquele instante. Portanto, não é possível reconstruir o frame ou o bloqueio específico daquela ocorrência. As reproduções abaixo demonstram o mecanismo em experimentos controlados; não inventam telemetria histórica.

### Causa demonstrada: preparo de estado e relógios diferentes

O teste montava `reset(x, x===640 ? -1 : 1, 320)`. Isso coloca o tutor na extremidade **com direção de saída e pausa ainda pendente**. O controlador real retém a direção de chegada durante a pausa e só a inverte ao consumir os 320 ms. O diagnóstico congelou o avanço automático, chamou o próprio controlador da cena real com deltas conhecidos e registrou os estados, sem substituir a implementação por doubles.

| Estado em X=640 | Direção inicial | Após 320 ms entregues ao controlador | Após 500 ms | Início da retomada |
| --- | --- | --- | --- | --- |
| Preparo antigo do teste, pausa 320 | −1 | X=640, direção +1, pausa novamente 320, animação pausada | X=640, pausa 140, ainda pausada | Pausa acaba em 640 ms; em 650 ms X=639,52 |
| Chegada produzida pelo controlador real, pausa 320 | +1 | X=640, direção −1, pausa 0, animação liberada | X=631,36, em movimento | Uma única pausa de 320 ms |

Na extremidade X=448 ocorre o caso simétrico. As quatro séries (duas extremidades × preparo antigo/natural), comparadas em 0, 319, 320, 321, 500, 639, 640 e 650 ms, tiveram posição, direção, pausa e estado de animação idênticos entre o checkout atual e a cópia `140655f`. A chegada também foi derivada a partir de X=544 com 2000 ms de avanço pelo controlador, confirmando a direção correta e a pausa original de 320 ms.

O segundo problema é de sincronização: `setTimeout` de Node mede relógio real, enquanto `WalkGameLearning.update(time, delta)` passa **delta** ao tutor, não o timestamp absoluto. O Phaser instalado calcula `rawDelta`, aplica limitação/suavização em `TimeStep.smoothDelta` e entrega esse delta à cena. Um bloqueio de event loop reduz o número de frames e pode deixar o somatório de deltas muito abaixo do tempo real. `Systems.step` emite `postupdate(time, delta)` após o update da cena com esse mesmo delta. Isso foi conferido nos arquivos locais da dependência instalada, sem atualizar versões.

Medições no aplicativo real, usando bloqueio de event loop declarado apenas no diagnóstico temporário:

| Aplicativo e condição | Tempo real observado | Delta acumulado / frames | Resultado após a espera antiga |
| --- | --- | --- | --- |
| Atual, preparo antigo, bloqueio de 250 ms | 655,2 ms | 415,98 ms / 25 frames | Pausa restante 174,08; `paused=true` |
| `140655f`, mesmo preparo/bloqueio | 652,8 ms | 432,69 ms / 26 frames | Pausa restante 157,38; `paused=true` |
| Atual, chegada natural, bloqueio de 450 ms | 667,8 ms | 249,58 ms / 15 frames | Pausa restante 20,52; `paused=true` |
| `140655f`, chegada natural, mesmo bloqueio | 659,4 ms | 216,43 ms / 13 frames | Pausa restante 53,65; `paused=true` |

Ao observar uma janela fixa de **650 ms de deltas entregues à cena**, o mesmo bloqueio de 450 ms levou cerca de 1083–1099 ms reais e 40 frames nas reproduções, mas o tutor estava efetivamente em movimento, com pausa zero e animação liberada em ambas as extremidades e versões. O experimento não mudou os 320 ms da pausa, os 48 px/s ou as regras de diálogo.

Conclusão causal: há dois defeitos preexistentes no teste — um estado inicial incompatível com a chegada natural e uma espera em relógio diferente do controlador. A carga/escalonamento do navegador revela o segundo defeito; não precisa ser presumida como defeito do jogo. A igualdade dos fontes relevantes entre `140655f` e a entrada deste complemento, e as séries controladas idênticas, afastam uma regressão introduzida pelas mudanças da etapa 1. O controlador retoma corretamente no estado natural. Não foi identificado problema anterior de produção que exigisse correção. A reprodução controlada explica por que a assertion antiga pode falhar; a causa ambiental exata do instante histórico continua não registrada, sem impedir a demonstração dos defeitos do teste.

### Correção mínima e controles

Somente `tests/walkAnimations.browser-check.mjs` e este documento foram modificados:

- As extremidades agora são alcançadas pelo controlador real a partir do centro, com assertions de posição, direção de chegada e pausa de 320 ms, em vez de atribuir direção incompatível com a pausa.
- A observação continua com orçamento de 650 ms, agora somando os deltas de `postupdate`. O estado é capturado no próprio frame da medição. Não se espera indefinidamente até o estado ficar favorável: após a janela fixa, todas as assertions são avaliadas. Uma cena sem atualizações ou encerrada falha explicitamente; o watchdog de 9 s é apenas limite de infraestrutura, inferior ao timeout CDP já existente de 10 s, não uma tolerância extra de retomada.
- Foram preservadas a exigência `paused=false`, a limitação de deslocamento **menor que 35 px**, os 320 ms da pausa e todos os demais cenários. Foram acrescentadas exigências de deslocamento não nulo, direção correta e pausa consumida. Relatório inclui deltas, frames, relógio real e deslocamento dos quatro casos.
- A cópia externa do teste corrigido passou com um bloqueio de event loop de 450 ms em cada uma das quatro retomadas. Mediu 650,03–665,77 ms de cena, 39–40 frames e 1061,7–1079,1 ms reais; deslocamentos de aproximadamente 18,24–18,99 px nas extremidades e 33,61 px no centro, mantendo o limite de 35 px.
- Controle negativo externo: somente em memória, liberou-se a animação e a pausa sem permitir translação. O teste falhou especificamente com `Tutor deve realmente se mover após o diálogo`, código 1. Assim, animação liberada ou mera passagem de tempo não bastam para aprovação. Essa mutação diagnóstica não foi aplicada a arquivos de produção nem incluída no commit.

### Verificações e evidências do complemento

| Verificação | Resultado |
| --- | --- |
| Diagnóstico na cena atual e em `140655f` | Quatro séries de estado idênticas e reprodução controlada da assertion antiga nos dois aplicativos |
| `npm.cmd run test:walk-animations` corrigido | Passou: quatro retomadas, congelamento em diálogo, percurso, colisões, reentrada e editor |
| Cópia diagnóstica corrigida, com bloqueios de 450 ms | Passou, sem alterar assertions de comportamento ou limite de 35 px |
| Controle negativo sem translação | Falhou como exigido, na assertion de movimento real |
| `npm.cmd run test:quiz` | 19/19 passaram; lógica e doubles de UI, sem alegação de renderização |
| `npm.cmd run test:scene-comparison` | 4/4 passaram; política de comparação, sem alegação visual |
| `npm.cmd run build-nolog` | Passou; aviso anterior de chunk acima de 500 kB |
| `node --check tests/walkAnimations.browser-check.mjs`; `git diff --check` | Passaram |
| `npm.cmd run test:browser` | Passou, código 0, na ordem da ocorrência histórica: menu → editor → passeio → animações → alimentação |

Evidências externas: `diagnostico-8080/traces.json`, `diagnostico-8081/traces.json`, `diagnostico-atual.log`, `diagnostico-140655f.log`, `validacao-com-bloqueio/report.json`, `validacao-bloqueio.log`, `controle-negativo.log`, `test-animations-corrigido.log` e `test-browser-final.log`, todos dentro do diretório de recuperação deste complemento. Os scripts `investigar-tutor.mjs`, `validar-bloqueio.mjs` e `validar-imobilidade.mjs` ficam nesse mesmo diretório externo para reproduzir os experimentos; não integram o produto ou os testes oficiais. Perfis de navegador não integram evidências, backups ou commits.

Preservação conferida por SHA-256: os outros 308 arquivos versionados de entrada estão intactos, incluindo produção, assets, Vite, package.json, lockfile e demais testes. Nenhuma dependência, versão, tolerância de movimento ou configuração funcional foi alterada. Ambos os servidores locais de validação foram encerrados. Os limites de aparelho físico, GPU de hardware e Canvas real continuam sem validação, sem relação com a demonstração de sincronização no Edge real.

Status atual da **etapa 1 após este complemento: aprovada tecnicamente**, com a pendência de sincronização encerrada por demonstração causal, correção restrita ao teste, validação sob bloqueio controlado, controle negativo e suíte completa aprovada. Os estados candidatos e suas execuções anteriores acima permanecem como histórico. O log antigo não permite atribuir o frame, a modalidade de input ou a carga exatos do episódio passado; essa limitação foi mantida explicitamente e não confundida com causa indeterminada do mecanismo reproduzido. O commit `28ecef3aa571d1ef8eecce6d9c476798559bacb1` contém a correção e a investigação; este registro acrescenta seu SHA em commit documental posterior, sem referência circular ao próprio commit. Sem avanço à etapa 2, push, merge, publicação ou reescrita de commits.

## Etapa 2 — ciclo de vida da alimentação

Execução autorizada em 24/10/2026 (America/Sao_Paulo). Branch existente conferida antes de editar: `etapa-2`, HEAD `4edf6a8bb46f1013ece46173d9932e0ce39baf8b`, encerramento documental da etapa 1. Raiz `D:/ARQUIVOS/Documents/pet-educa`; `origin` de leitura/envio `https://github.com/sdl9/pet-educa.git`, ambos inalterados. Árvore inicial limpa, sem arquivos novos não ignorados, staged, unstaged ou remoções. Nenhum AGENTS.md aplicável encontrado. Nenhuma branch criada/trocada; commits anteriores preservados. A referência histórica antiga não foi importada.

### Recuperação e inspeção da entrada

Recuperação fora do checkout em `$env:TEMP\pet-educa-etapa-2-20261024`:

- `entrada.bundle`, com a referência de entrada `etapa-2`, passou em `git bundle verify`. SHA-256: `630DC06C528AF62979E21B3325089125F0E438B1B96B79DDEE3AFA5BDBA26990`.
- `entrada-bytes/` contém os 310 arquivos versionados, com caminhos preservados e hashes de cada cópia verificados contra a origem. `arquivos-entrada.json` registra esses hashes.
- `estado-entrada.txt`, `staged.patch` e `unstaged.patch` registram branch/HEAD e índice/árvore separados, sem alterações na entrada. Não havia arquivos locais alterados/novos não ignorados a preservar separadamente. Arquivos ignorados desconhecidos não foram limpos ou varridos.
- Para recuperar: conferir o hash e o bundle, cloná-lo em pasta nova e comparar arquivos específicos com `entrada-bytes/`; não restaurar amplamente sobre trabalho posterior.

Foram inspecionados o contrato, registro anterior, `package.json`, Vite, registro de cenas/menu, `FoodGame`, `FoodObjects`, `Player`, teste e documentação de alimentação. A versão instalada é Phaser **4.0.0**. O export ESM usado pelo Vite é `dist/phaser.esm.js`; foram conferidos os métodos relevantes também nesse bundle, além dos fontes instalados de `PhysicsGroup`, `Group`, `Collider`, `World`, `ProcessQueue`, `GameObject`, `Body`, `Clock` e `TimerEvent`.

Na entrada, cada evento de spawn criava um sprite e um overlap separado. A coleta destruía o sprite, mas não o detector que o referenciava; itens não coletados continuavam andando para a esquerda indefinidamente. Fim do tempo parava física/timers, e o shutdown geral do Phaser só então descartava a cena. Uma medição no aplicativo real, feita **antes de editar**, mostrou:

| Tempo de jogo | Alimentos vivos | Totalmente fora à esquerda | Corpos físicos | Overlaps ativos |
| --- | --- | --- | --- | --- |
| 2 s | 4 | 0 | 5 | 4 |
| 4 s | 6 | 1 | 7 | 8 |
| 6 s | 8 | 2 | 9 | 12 |
| 8 s | 9 | 4 | 10 | 16 |
| 10 s | 13 | 7 | 14 | 20 |
| 12 s | 14 | 9 | 15 | 24 |

São amostras observadas, com coletas naturais e sorteios de altura/textura, não contagens determinísticas de todos os itens em outras execuções. O crescimento dos detectores acompanha cada spawn, inclusive quando o item foi coletado.

### Mudança limitada ao ciclo de vida

- `FoodGame` cria um grupo físico e um único overlap jogador × grupo ao iniciar a partida, depois da guarda de início único. A fábrica mantém responsabilidade pela criação: `FoodObjects.criar(cena, tipo, grupo)` cria um sprite novo pelo grupo e aplica os mesmos parâmetros. Nenhum pooling foi introduzido.
- Na versão instalada, `PhysicsGroup.createCallbackHandler` aplica defaults ao adicionar/criar membros, incluindo velocidade inicial. A fábrica aplica origem, escala, tamanho/offset do corpo, gravidade e velocidade **depois** da criação no grupo; assim os defaults não zeram os −500 px/s.
- A coleta exige item ativo pertencente ao grupo atual. A remoção do grupo e a destruição ocorrem antes da pontuação, impedindo chamadas duplicadas ou reentrantes de pontuar o mesmo item. Pontuação e efeitos permanecem iguais.
- O descarte usa `getBounds().right < 0` no `postupdate`, considerando dimensões visuais reais. O teste posiciona um alimento com a borda visual em +1 px e o corpo já fora da tela: ele permanece. Ao passar a borda visual para −1 px, ele deve ser destruído e sair do grupo.
- `limparPartida` é idempotente e usado no fim do tempo, Menu e shutdown. Para os timers, `remove(false)` agenda encerramento sem callback e `destroy()` libera callback/scope/args; as referências da cena são anuladas. A reação vermelha também libera seu TimerEvent ao cancelar.
- O overlap é destruído e suas referências liberadas; o grupo é destruído com os filhos. O descarte periódico é desregistrado. A destruição do GameObject libera o corpo pelo fluxo de `Body.destroy`/`World.postUpdate`; o teste observa tanto corpos habilitados quanto eventuais corpos aguardando a fila do Phaser.

O Phaser remove colliders por `ProcessQueue`: depois de `Collider.destroy`, o objeto fica inativo, sem world, objetos ou callback, embora uma entrada inerte possa aguardar o próximo passo físico. Como o resultado pausa a física, o teste distingue essa entrada de um detector ativo; o shutdown limpa a fila e a reentrada cria outro World. Não foram manipuladas filas privadas em produção para forçar contagens. Durante a partida, o teste exige exatamente **uma entrada e um detector ativo**, sem crescimento por spawn; após término exige zero detectores ativos e referências do collider liberadas.

### Comportamento preservado e comparação efetiva

Frequência de 500 ms; sequência começa em bom e alterna bom/ruim; velocidade −500 px/s; nascimento em X=`scale.width+50` (1330 no canvas de 1280), Y aleatório inteiro 440–630; mesmas listas de texturas; origem `(0,5; 0,5)`, escala 2, corpo de origem 30 × 30 (60 × 60 exibidos), offset `(1,1)` e gravidade desabilitada. O grupo não reconfigura o jogador.

Uma segunda medição real, com o mesmo roteiro da entrada e saída separada, confirmou igualdade integral do JSON de configuração efetiva: score inicial 0, contador 60, delays 500/1000 ms, jogador `(160,654)`, escala 2, origem `(0,5;61/64)`, velocidade 300, corpo 100 × 100, offset `(7,11)` e limites `(48,330,1184,370)`, além das três animações com seus frames, taxas e durações. O teste confirma +1/−1, animação de comer, cor `0xffb3b3` e reação de 400 ms. Nenhum controle, rótulo, painel ou texto foi reorganizado. Ao finalizar, os alimentos remanescentes agora são descartados, como parte da limpeza solicitada, mantendo resultado e controles existentes.

Na medição após a correção, aos 12 segundos havia **6 alimentos, nenhum fora da tela, 7 corpos e 1 overlap**. Os scores e alturas sorteadas não foram comparados como valores fixos entre execuções independentes.

### Verificação significativa

O teste existente de alimentação foi ampliado somente para o ciclo de vida; suas verificações de layout, resultado, controles, teclado/toque, cancelamento, score e reentrada foram mantidas. A criação direta de itens dos casos de score passou a fornecer o grupo. A guarda de início duplo também compara identidades do grupo e overlap.

Além dos dois casos anteriores de término acelerando apenas o TimerEvent do contador, o teste agora percorre uma rodada com **60 ticks normais, sem acelerar timer ou física**, instrumentando o callback real do spawn para observar os parâmetros de criação. Um sampler de `postupdate` registra os recursos em cada frame. Após essa rodada, reabre outra por pelo menos seis segundos de jogo (mais que o tempo de travessia), confirma score/tempo reiniciados, mesmos limites de recursos e sai por Escape. Saída durante partida, resultado e reentrada por toque continuam exercitados.

Primeira execução aprovada da rodada completa:

| Medida | Observado |
| --- | --- |
| Spawns / duração configurada | 120 / 60 segundos de jogo |
| Tempo real do roteiro de rodada | 60.575 ms, incluindo polling e verificações |
| Frames observados na partida | 3.586 |
| Máximo de alimentos vivos | 6 |
| Máximo de corpos físicos, incluindo jogador | 7 |
| Máximo de overlaps ativos / entradas na fila durante jogo | 1 / 1 |
| Máximo de alimentos totalmente fora da tela retidos | 0 |
| Recursos no resultado, após filas do Phaser | 0 alimentos, 0 overlaps ativos, 1 corpo do jogador |
| World anterior após saída pelo Menu | 0 corpos, 0 overlaps ativos |

O limite de seis itens corresponde à travessia de cerca de `(1330+32)/500 = 2,724 s`, com um nascimento a cada 0,5 s. Não é limite imposto à jogabilidade: a produção destrói por borda visual e não limita capacidade ou altera spawn. Os testes também verificam coleta pelo overlap real, coleta duplicada, destruição/saída do grupo, preservação do último pixel, timers sem callbacks após limpeza e ausência de alimentos em cena fora do grupo.

A execução final agregada repetiu a rodada completa: 120 spawns, 3.586 frames, aproximadamente 60.639 ms reais do roteiro e os mesmos máximos de 6 itens, 7 corpos, 1 detector e 0 alimentos fora da tela. As rodadas reabertas mantiveram o limite após a travessia inicial; os casos de resultado positivo/negativo e reentrada por toque passaram.

| Verificação desta etapa | Resultado |
| --- | --- |
| Medição real da entrada e após a correção | Antes: 14/9/15/24; depois: 6/0/7/1 (itens/fora/corpos/overlaps, aos 12 s); configuração efetiva idêntica |
| `npm.cmd run test:food-ui` | Passou, incluindo rodada natural completa, rodada reaberta, início duplo, coleta, término e recursos liberados |
| `npm.cmd run test:quiz` | 19/19 passaram; doubles/lógica, não renderização visual |
| `npm.cmd run test:scene-comparison` | 4/4 passaram; política de comparação |
| `npm.cmd run build-nolog` | Passou; aviso anterior de chunk acima de 500 kB |
| `node --check` dos três arquivos JavaScript alterados; `git diff --check` | Passaram |
| `npm.cmd run test:browser` | Passou, código 0: menu, editor, passeio, animações e alimentação ampliada |

O navegador é Edge headless real/WebGL (SwiftShader), com mouse/teclado e toque emulado em 1280 × 720 e 844 × 390 no teste de alimentação. Não houve celular físico, GPU de hardware ou Canvas real. A inspeção da versão instalada e as observações reais substituem suposições sobre APIs; não se usaram doubles para comprovar descarte físico ou renderização.

Evidências fora de `public`: saídas ignoradas `tmp/food-ui-validation/` e diretório externo da etapa. Neste último, `baseline/baseline.json`, `baseline.log`, `apos-correcao/baseline.json`, `apos-correcao.log`, `food-primeira-execucao/report.json`, `test-food-ui.log` e `test-browser-final.log` preservam medições e resultados separados. `medir-entrada.mjs` e `medir-correcao.mjs` são diagnósticos temporários externos; não entram no produto. Nenhum perfil de navegador, captura, cache, `dist` ou backup entra no commit.

Arquivos da etapa: `src/game/scenes/FoodGame.js`, `src/game/objects/FoodObjects.js`, `tests/foodGameUI.browser-check.mjs`, `docs/food-game-ui.md` e este registro. Os outros 305 arquivos de entrada foram conferidos por SHA-256, sem divergência. Nenhuma dependência, versão, lockfile, asset, configuração Vite, nome/registro de cena ou teste dos outros jogos foi modificado. Sem pooling, refatoração adicional de UI ou ajuste de dificuldade. O servidor de validação foi encerrado; os avisos anteriores de chunk grande e de import do manifesto em `public` permaneceram, sem novo erro identificado. Capturas das instruções e do resultado da rodada completa foram abertas e inspecionadas visualmente.

Status da **etapa 2: aprovada tecnicamente**, com suíte completa aprovada, evidências de retenção limitada, detector único e limpeza em término/saída/reentrada, sem falha nova identificada. O commit `093f56271bf2792cb2c3fb4c9c86483c22f401d5` contém a implementação e os resultados; este registro acrescenta seu SHA em commit documental posterior, evitando referência circular ao próprio commit. A etapa 3 não foi iniciada. Sem push, merge, publicação ou reescrita dos commits anteriores.

## Etapa 3 — identificação definitiva do passeio

Execução autorizada em 24/10/2026 (America/Sao_Paulo). Branch existente conferida antes de editar: `etapa-3`, HEAD `1ac7801f0ef38182be3e898772b7948832eff270`, árvore limpa, sem arquivos novos não ignorados, staged, unstaged ou remoções. `origin` de leitura e envio continua em `https://github.com/sdl9/pet-educa.git`, na raiz `D:/ARQUIVOS/Documents/pet-educa`. Nenhum AGENTS.md aplicável encontrado. Branch e upstream já existiam; não foram criados, trocados ou publicados. Os commits anteriores foram preservados.

### Recuperação da entrada

Diretório externo: `$env:TEMP\pet-educa-etapa-3-20261024`. `entrada.bundle` contém a referência de entrada `etapa-3` e passou em `git bundle verify`; SHA-256 `BA0DA2091D4915C11B8A5B5F3F2D7A85BD97873C7196AC05AB08D36C46559347`. Os 310 arquivos versionados foram copiados com caminhos e hashes dos bytes verificados em `entrada-bytes/`; `arquivos-entrada.json`, `estado-entrada.txt`, `staged.patch` e `unstaged.patch` preservam o inventário e o estado separado do índice/árvore. Não havia alterações locais não commitadas a separar. Nada ignorado/desconhecido foi limpo.

Para recuperar, conferir o bundle e cloná-lo em uma pasta nova, usando `entrada-bytes/` e o manifesto para bytes locais exatos; não aplicar restauração ampla sobre trabalho posterior. A cópia inclui tanto o protótipo antigo `WalkGame.js` quanto a cena funcional `WalkGameLearning.js`, permitindo recuperar ambos sem colisão de nomes. Nenhum histórico antigo foi importado e o repositório original não foi alterado.

### Conferência dos usos e remoções

Foram lidos menu, Boot/Preloader/Intro, entradas e registro das cenas, os dois arquivos do passeio, cenas de template, utilitários, anotações, testes/ferramentas, documentação e configurações Vite. Buscas incluíram imports estáticos/dinâmicos, strings de cena, chamadas start/launch/run/switch/restart, queries, arrays de registro, caminhos de fontes e referências em scripts/manifestos/CSS/HTML. A conclusão não se baseou apenas em nomes semelhantes.

| Conteúdo de entrada | Evidência de papel/consumo | Tratamento |
| --- | --- | --- |
| `WalkGameLearning.js` | Classe/chave usadas pelo cartão Passeio Consciente, Preloader e testes; contém jogador, Saci, colisões, interações, diálogos e tutor | Implementação integral preservada como `WalkGame.js`, classe/chave `WalkGame` |
| `WalkGame.js` antigo | `create` e instruções estavam comentados; não era destino do menu ou query, apesar do registro | Protótipo retirado antes da movimentação para evitar sobrescrever a cena funcional |
| `Game.js` | Registrada como `MainGame`, sem entrada ativa por menu/query ou outra cena; sua transição para GameOver estava comentada | Arquivo, import e registro retirados |
| `GameOver.js` | Só possuía saída para MainMenu; única referência de entrada era o comentário em Game.js | Arquivo, import e registro retirados |
| `FuncoesJogo.js` | Arquivo de zero bytes, sem imports/consumidores | Retirado |
| `FuncoesUI.js` | Único import no protótipo removido; suas chamadas ficavam no corpo comentado | Retirado após o protótipo; nenhum consumidor ativo restante |

O método próprio `FoodGame.criarBotaoMenu` tem nome semelhante ao utilitário, mas não o consumia: a alimentação e seus controles foram preservados. `Player`, `WalkPlayer`, `Saci`, sistemas, assets, mapas e dados não foram renomeados nem alterados. `anotacoes.md` permanece byte a byte intacto; comentários pedagógicos e o texto comentado do protótipo foram preservados em [notas-prototipo-passeio.md](notas-prototipo-passeio.md). Licenças, créditos e material original dos assets foram mantidos.

### Equivalência e rotas

Uma comparação exata com a cópia de entrada confirmou que o conteúdo da cena funcional é idêntico após substituir **somente** `export class WalkGameLearning` por `export class WalkGame` e `super('WalkGameLearning')` por `super('WalkGame')`. Não houve divisão, reordenação ou reformatação da cena. Coordenadas, escalas, velocidades, física, diálogos, sete cuidados e animações permanecem no mesmo código. A prova dessa normalização é registrada em `identidade-cena.json` no diretório externo.

O registro contém agora Boot, Preloader, Intro, MainMenu, FoodGame, SaciGame e WalkGame; WalkLayoutEditor continua sendo acrescentado somente em DEV. O menu usa WalkGame. A única alteração na decisão do Preloader foi o nome do destino; condições e precedências das queries foram preservadas, inclusive a espera pelas fontes.

| Query | Dev | Distribuição de produção |
| --- | --- | --- |
| Nenhuma | Intro | Intro |
| `walkLearning` | WalkGame | WalkGame |
| `walkLayoutEditor` | WalkLayoutEditor | Intro |
| `walkLayoutEditor&walkLearning` | WalkLayoutEditor | WalkGame |
| `saciQuiz` | SaciGame, partida | Intro |
| `quizVisual` | SaciGame, demonstração/inspetor | Intro |
| `quizVisual&walkLearning` | SaciGame, demonstração/inspetor | WalkGame |

Quatro testes atuais e três scripts históricos de `tmp` receberam somente as substituições explícitas de classe/chave/caminho, incluindo imports dinâmicos, listas de arquivos protegidos, transições e metadados de novas execuções. As assertions e os snapshots/JSONs históricos não foram afrouxados ou regenerados. As ocorrências restantes do nome anterior são registros históricos, o prompt original do pacote de assets e a assertion que exige sua ausência do JavaScript de produção; não são consumidores ativos.

A documentação atual aponta para a cena definitiva e mantém os nomes antigos nos relatos datados. O prompt original em `public/assets/WalkGame_Assets_Animados` foi preservado como material de reprodução da integração; os avisos documentais explicam a correspondência com o nome atual.

### Verificações executadas

Servidores locais de validação: dev por `npm.cmd run dev-nolog -- --host 127.0.0.1 --strictPort` em 8080; distribuição construída por `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 8081 --strictPort`. Ambos vinculados a localhost; isso não é publicação. `log.js` não foi executado e não houve instalação ou alteração de dependências/versões/lockfile.

Foi acrescentado `npm.cmd run test:walk-routes`, separado da suíte existente, para verificar dev e build real. O teste obtém o Game real do módulo Phaser exportado pelo build, sem modificar produção para expor objetos de teste. Confere o registro completo, 14 combinações ambiente/query e três carregamentos adicionais para fluxo/reentrada/toque (17 no relatório). Em produção, exige ausência do editor/inspetor no registro, nas queries e nos marcadores específicos do JavaScript gerado. O artefato validado continha `index-PpKFtxQj.js` e `phaser-BvVujFYZ.js`.

| Verificação | Resultado atual |
| --- | --- |
| Comparação normalizada da cena | Passou: apenas classe e chave diferem da cena funcional de entrada |
| `npm.cmd run test:quiz` | 19/19 passaram; lógica e doubles de UI, não renderização real |
| `npm.cmd run test:scene-comparison` | 4/4 passaram; política de comparação |
| `npm.cmd run build-nolog` | Passou; aviso anterior de chunk acima de 500 kB |
| `npm.cmd run test:walk-routes` | Passou no Edge real, contra dev e produção: cena, registro, menu/reentrada, teclado/toque, diálogo, Saci/coração, colisores e avanço da fonte/brinquedo/tutor |
| `npm.cmd run test:browser` | Passou: menu, editor, passeio, animações e alimentação completa/reaberta |
| `test:walk-ui` dentro da suíte | Confirmou 12 páginas, cinco pontos, sete cuidados, três tópicos, conclusão, PC/toque e menu/reentrada |
| `test:walk-animations` dentro da suíte | Confirmou frames/taxas, percurso, pausa/retomada sincronizada, colisão física/índice espacial, entrada E/Espaço/toque e reentrada |
| `test:walk-editor` dentro da suíte | Comparação de 1595 objetos de cenário, seleção/arraste/snap/cancelamento, download real, integridade oficial e descarte por recarga |
| `node --check` e `git diff --check` | Passaram nos arquivos de código alterados/novo |
| Scripts históricos L1/L2/manual em cópia isolada | Alcançaram as divergências históricas: hashes L1, layout congelado L2 e 52 elementos contra 41 no manual; nenhum import de cena antiga foi necessário |

Os três scripts históricos foram executados a partir de cópias byte a byte em `ferramentas-isoladas/`, fora do checkout, preservando os relatórios versionados originais. Seus códigos 1 não são apresentados como aprovação: continuam comparando com estados antigos já divergentes antes da organização. Nenhuma expectativa histórica foi alterada para torná-los verdes. Na execução histórica manual também houve aviso de contexto WebGL perdido; ficou registrado como limitação daquela execução e não foi usado como evidência visual aprovada. O novo teste de produção e a suíte atual passaram em suas próprias execuções; não se atribuiu causa não comprovada àquele aviso.

Evidências locais fora de `public`: `tmp/walk-ui-validation/routes/report.json` e capturas de dev/produção, relatórios/capturas dos testes atuais e, no diretório externo da etapa, `test-walk-routes.log`, `test-browser.log`, `historico-l1.log`, `historico-l2.log` e `historico-manual.log`. Capturas, JSONs e build de referência são artefatos locais, sem perfis/cache no commit. O navegador foi Edge headless/WebGL (SwiftShader), com teclado/mouse e toque emulado; aparelho físico, GPU de hardware e Canvas real não foram verificados.

A conferência de hashes preservou os outros 288 arquivos de entrada fora dos 22 caminhos explicitamente alterados/removidos. Isso inclui todos os assets/mapas/dados/sistemas/objetos, cena e teste de alimentação da etapa 2, SaciGame, fontes, licenças, lockfile, Vite e anotações da usuária. Foram adicionados apenas o teste de rotas e as notas preservadas. Nenhuma nova funcionalidade de jogo ou ajuste de regra foi introduzido.

As capturas de produção no PC, toque emulado, conclusão dos sete cuidados e editor foram abertas e inspecionadas. Os dois servidores locais foram encerrados; permaneceu o aviso anterior do manifesto em `public`. Foram copiadas e conferidas por SHA-256 50 evidências e arquivos de referência do build, em `evidencias/` e `distribuicao-verificada/` no diretório externo, com manifesto `evidencias-sha256.json`. A cópia do build contém HTML e JavaScript para conferência, não um pacote completo dos assets. Nenhum perfil de navegador foi arquivado.

Status da **etapa 3: aprovada tecnicamente**, com suíte atual e distribuição real aprovadas, sem falha funcional nova identificada. Os três checks históricos continuam divergentes e a cobertura física/hardware permanece limitada conforme acima. O commit técnico local `cdb772ff1f4d58778aefc3b8ebdc4248b107388e` contém a implementação e os resultados; este complemento documental registra seu SHA sem referência circular ao próprio commit. A etapa 4 não foi iniciada. Sem push, merge, publicação ou reescrita de histórico.
