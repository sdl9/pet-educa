# Organização da entrega — Pet Educa

## Escopo e fluxo de branches

Registro da etapa 0, executada em 24/10/2026 (America/Sao_Paulo): linha de base, diagnóstico e recuperação. A etapa 1, autorizada posteriormente, está registrada na seção final. Os limites específicos da etapa 0 abaixo são históricos. O ajuste de branches fornecido pela usuária prevalece sobre a orientação anterior de criar `organizacao-entrega`.

- Trabalhar somente na branch existente da etapa solicitada, conferindo-a antes de editar.
- A etapa 0 usa `etapa-0`; nenhuma branch foi criada ou trocada.
- A usuária criará cada próxima branch a partir da anterior após os commits da etapa concluída.
- Não avançar automaticamente; não fazer push, merge, publicação ou reescrita de histórico.
- Não modificar implementação, assets, configurações funcionais ou testes nesta etapa.

| Etapa | Branch | Commit de entrada | Commit de conclusão técnica | Pendências |
| --- | --- | --- | --- | --- |
| 0 | `etapa-0` | `dd334db2a1ffae306ce45c91bc04526821a76ac7` | `a06f1159a7caae3c41ae24eab78fc881b08c5347` | Expectativas históricas divergentes; aparelho físico e GPU de hardware não verificados |
| 1 | `etapa-1` | `140655f14ba60b65a98bfe469c34ee24c0fe9ef5` | A registrar após o commit local dos testes | Intermitência temporal observada no teste preservado de animações; cobertura física/hardware permanece pendente |

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

Status da **etapa 1: candidata com validação pendente**. A implementação dos testes solicitados está concluída e a última suíte agregada passou, mas permanece pendente esclarecer a intermitência observada no teste preservado de animações. Sua causa não foi comprovada nem sua falha reproduzida na cópia de entrada; portanto, ela não é descartada como limitação do ambiente ou declarada corrigida apenas por uma repetição verde. O SHA de conclusão da implementação será acrescentado em um commit documental posterior, evitando referência circular ao próprio commit. A etapa 2 não foi iniciada; sem push, merge, publicação ou modificações de produção.
