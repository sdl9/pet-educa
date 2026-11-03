# Ajustes após avaliação com crianças

Implementação de 03/11/2026, limitada ao ritmo da alimentação e a cinco perguntas
por partida do Quiz do Saci. A motivação é o feedback informado pela usuária;
esta execução não realizou uma nova avaliação com crianças ou celular físico.

## Entrada e recuperação

Raiz conferida `D:/ARQUIVOS/Documents/pet-educa`, origin de leitura/envio
`https://github.com/sdl9/pet-educa.git`. Branch de entrada `etapa-7`, entrada
`a4dc595b59fee746f70dac6158f639c4e4cefae1`, árvore/índice limpos e 297 arquivos
rastreados. Não foram encontradas instruções AGENTS.md aplicáveis. Nenhuma
branch foi criada/trocada pelo agente, nenhum remote foi alterado e nenhum
trabalho alheio foi incluído.

Antes do commit, a conferência detectou a branch atual **`quiz-e-food`** no
mesmo HEAD de entrada. O reflog registra a troca de `etapa-7` para ela durante
a execução, fora dos comandos do agente. A proteção interrompeu a primeira
tentativa antes do staging/commit. Após conferir novamente HEAD e escopo do
diff, o trabalho foi mantido na branch atual `quiz-e-food`, sem troca automática.
Os testes continuam correspondendo aos mesmos bytes de produção e testes.

Recuperação externa em `$env:TEMP\pet-educa-feedback-20261103`: `entrada.bundle`
verificado, `entrada-bytes/` com os 297 caminhos e hashes conferidos,
`arquivos-entrada.json` e `estado-entrada.txt`. SHA-256 do bundle:
`28635FC6B19FBE2B8BF779A72549492470AC0DEC62D7046929F7C65FE838332B`.
Para recuperar, conferir o hash/bundle e clonar em pasta nova; comparar bytes
com o manifesto, sem restauração ampla sobre alterações posteriores.

## Alimentação

| Parâmetro | Anterior | Atual |
| --- | --- | --- |
| Velocidade horizontal dos alimentos | −500 px/s | **−325 px/s** (35% mais lenta) |
| Intervalo de spawn | 500 ms | **650 ms** (+30%) |
| Distância nominal entre centros | 250 px | 211,25 px |
| Velocidade do personagem | 300 px/s | 300 px/s |
| Duração da partida | 60 s | 60 s |
| Aceleração progressiva | Ausente | Ausente |
| Pico de itens observado nos testes completos | 6, etapa 7 | **7**, nesta execução |
| Gerações por rodada completa | Cerca de 120 | **92** |

Não há limite artificial novo de spawn. O descarte existente e o tempo de
travessia limitam os itens vivos. Como cada item agora demora mais para sair,
o pico natural passa a sete, mesmo com menos gerações por segundo. Continuam
separados horizontalmente, sem sobreposição visual; não há acúmulo fora da tela
nem crescimento de detectores. Não foi necessário desviar dos percentuais
iniciais solicitados.

Na rodada real sem aceleração, o teste observou **60.547 ms**, **3.590 frames**,
máximo sete itens, um detector e zero itens completamente fora da tela após
postupdate. A primeira chegada à faixa horizontal de captura foi registrada
**3.884,5 ms após o início da instrumentação**, instalada logo após o início da
partida: aproximadamente quatro segundos, com 56 segundos no contador.
Depois da travessia inicial, a geração continua a cada 650 ms. Isso verifica
que os itens alcançam a faixa de captura com tempo para jogar.

Os testes preservam coleta por overlap, pontuação única, bons/ruins alternados,
resultados positivos/negativos, tint `0xffb3b3` de 400 ms, último pixel visível,
início duplo, controles PC/toque, fim do tempo, Menu e reentrada. A velocidade
horizontal real do jogador também foi conferida em 300 px/s. Assets, dimensões,
origens, corpo, posição de nascimento, pontuação, animações e encerramento não
foram alterados.

## Quiz do Saci

O banco contém exatamente **15 perguntas**, IDs 1–15, com alternativas e
gabarito originais. Seu arquivo não foi editado; SHA-256 dos bytes de entrada
e saída: `7BA6417F4E87A91825CD2D8092EC3958B1E5611853BB314752401510D12B8B69`.
O feedback existente continua associado à alternativa correta da pergunta;
nenhum conteúdo educativo foi reescrito ou inventado.

`SaciQuizRound` guarda o banco e embaralha uma cópia com Fisher–Yates em cada
`reset()`, selecionando os primeiros cinco objetos completos. Início, reentrada
e **Jogar novamente** sorteiam sem recarregar a página. Não há repetição dentro
da partida nem histórico entre partidas; um novo sorteio pode legitimamente
repetir perguntas anteriores. Produção usa `Math.random`; um gerador injetável
permite verificar os sorteios de forma determinística nos testes.

Progresso e resultado já usam `round.total`; agora mostram **1 de 5** até
**5 de 5**, máximo de cinco acertos. Após a quinta resposta, o feedback mantém
**Finalizar**, concluindo pelo avanço manual existente. Reinício limpa índice,
acertos, fase e feedback, e cria outra seleção. Cena e UI de produção não
precisaram mudar, preservando aparência, feedback e navegação.

## Verificações executadas

Node 24.19.0, npm 11.17.0, Phaser 4.0.0, Vite 6.4.3 e Edge instalado
156.0.4314.58. Sem instalação/atualização de dependências ou execução de log.js.
Dev local 8080 por `npm.cmd run dev-nolog -- --host 127.0.0.1 --strictPort`;
dist servido em 8081 por `node node_modules/vite/bin/vite.js preview --host
127.0.0.1 --port 8081 --strictPort`.

| Comando | Resultado |
| --- | --- |
| `npm.cmd run test:quiz` | **21/21**: banco completo preservado, cinco únicas, todo o banco elegível, associações corretas, bloqueio/avanço, resultados e novo sorteio no reinício |
| `npm.cmd run test:quiz-visual` | Aprovado nas APIs simuladas WebGL/Canvas; não é execução visual real |
| `npm.cmd run test:scene-comparison` | **4/4**, cenário e política de comparação preservados |
| `npm.cmd run test:browser` | Código 0: menu, editor, passeio, animações, quiz atualizado e alimentação completa/reaberta |
| `npm.cmd run test:walk-routes` | Código 0: dev/produção, rotas, sete cuidados, controles e ferramentas restritas ao desenvolvimento |
| `npm.cmd run build-nolog` | Aprovado; aviso anterior de chunk acima de 500 kB permanece |
| `npm.cmd run test:distribution` | Aprovado: 131 arquivos públicos idênticos por SHA-256; 134 arquivos/4.178.791 bytes em dist |
| `git diff --check` | Aprovado |

Os testes unitários/UI usam doubles. Separadamente, a automação CDP executou
o aplicativo real em Edge headless/WebGL, com PC 1280 × 720 e toque emulado
844 × 390; o menu também usa 740 × 360. O quiz percorreu duas partidas por
modo, exatamente cinco perguntas únicas, resultados **3/5** e **5/5**, feedback
sem avanço automático, bloqueio de segunda resposta, Finalizar, reinício e
reentrada zerados. O primeiro sorteio usa a aleatoriedade normal; para provar
o trabalho do botão de reinício, apenas o teste injeta uma sequência controlada
e confere 14 chamadas de Fisher–Yates e outra seleção. Não se exige que dois
sorteios aleatórios sejam diferentes por acaso.

Inspeção visual: foram abertas capturas de **Pergunta 5 de 5/Finalizar** em
toque e da alimentação com quatro itens separados. Não foram encontrados
cortes nessas capturas. Isso não equivale a jogar manualmente, testar com
crianças, celular físico ou confirmar todos os navegadores.

Logs `test-browser.log`/`test-walk-routes.log`, relatórios e capturas selecionados
ficam na recuperação externa. Os testes não observaram exceções da aplicação
ou falhas de assets nos filtros existentes. Não foi repetida a auditoria
estrita ampliada de console da etapa 7; sua intervenção preexistente do Phaser
em touchcancel continua registrada como anterior, sem correção nesta tarefa.

Foram copiadas **32 capturas/relatórios selecionados**, com caminhos e SHA-256
conferidos em `evidencias-sha256.json`. A comparação dos arquivos de entrada
confirmou **282 de 297 arquivos preexistentes intactos**, fora dos 15 caminhos
explicitamente editados; o relatório atual é o único arquivo novo. Incluem-se
entre os preservados banco, Player, passeio, assets, licenças, dependências e
lockfile. Os dois servidores locais próprios foram encerrados.

## Arquivos afetados

| Grupo | Arquivos |
| --- | --- |
| Produção | `src/game/objects/FoodObjects.js`, `src/game/scenes/FoodGame.js`, `src/game/systems/SaciQuizRound.js` |
| Testes | `tests/saciQuizRound.test.js`, `tests/saciQuizUI.test.js`, `tests/foodGameUI.browser-check.mjs`, `tests/petEducaUI.browser-check.mjs`, `tests/walkUI.browser-check.mjs` |
| Documentação | `README.md`, `docs/food-game-ui.md`, `docs/quiz-saci-visual.md`, `docs/pet-educa-ui.md`, `docs/testes-navegador.md`, `docs/checklist-celular.md`, este relatório e referência em `docs/organizacao-entrega.md` |

As verificações históricas da etapa 7 permanecem datadas e não foram
reescritas como validação desta alteração. Seu ZIP candidato continua ligado
ao commit antigo e não foi sobrescrito/regenerado. Sem publicação, push,
merge, nova arquitetura ou mudanças no passeio. Avaliação do novo ritmo por
crianças e validação em celular físico permanecem pendentes.
