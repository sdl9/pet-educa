# Interface do jogo de alimentação

## Estado atual

As instruções do FoodGame adaptam a tela existente sobre o cenário da alimentação,
com o painel e botão verde do Pet Educa e as fontes Lilita One e Nunito Sans.
O título é "Ajude o Caramelo a comer bem!", seguido da duração de **1 minuto**,
do objetivo e do aviso para desviar dos alimentos ruins. Dois grupos exibem os
assets do jogo com legendas: **Pode comer**, com confirmação, e **Faz mal**, com X.
Os símbolos são desenhados, sem depender de cores ou emojis.

`src/game/data/foodConfig.js` é a fonte única para carregamento dos assets,
sorteio dos alimentos e instruções. Preserva os quatro bons (ração, arroz,
cenoura, água) e seis ruins (chocolate, uvas, abacate, bala, cebola, alho).
A composição usa duas linhas por grupo, quatro itens à esquerda e seis à direita,
com fontes de pelo menos 30 px lógicos e imagens na mesma escala da partida.

Cada nova entrada, inclusive depois do resultado, reapresenta as instruções.
Somente clicar/tocar em **Começar** inicia a partida; Enter aguarda esse botão.
Enquanto isso, a física fica pausada, sem jogador, alimentos, overlap ou timers.
O início repõe os **60 segundos** já existentes e zero pontos. Cliques repetidos
não recriam jogador, timer, gerador ou detector. O container e seus eventos são
destruídos ao começar ou sair para o menu. Não há uma segunda tela de instruções.

Ao chegar a zero, o contador encerra a partida uma única vez. Movimento,
coletas e geração de alimentos param, preservando os Pontos finais. O mesmo
método criarBalao monta o resultado centralizado sobre o jogo, exibindo
"Partida finalizada!", "Seus Pontos: X" e o botão "Menu". Enter também retorna
ao menu nessa etapa. Reentrar reapresenta as instruções, preparando 60 segundos e zero pontos.
O HUD usa "Pontos" e "Tempo". Na etapa 6, somente esses rótulos e os do resultado
foram corrigidos; posições, fontes, tamanhos, painel e regras foram preservados.

O botão Menu permanece no canto superior direito durante as instruções e
a partida. Usa o controle já compartilhado com o passeio. Escape também
retorna ao menu. A saída bloqueia novas ativações, interrompe o movimento
e cancela timer/spawn antes de trocar de cena. O cronômetro foi deslocado
para a esquerda do botão. Regras de alimentos, pontuação e movimento não mudaram.

Os alimentos surgem um por vez a cada **650 ms**, alternando bom e ruim.
Com a velocidade de **325 px/s**, ficam cerca de 211 pixels entre os centros.
O ajuste após avaliação com crianças reduz a velocidade anterior de 500 px/s
em 35% e aumenta o intervalo anterior de 500 ms em 30%. Não há aceleração
progressiva. A velocidade do personagem permanece em 300 px/s.
Como cada item permanece mais tempo visível, o limite de retenção passa de seis
para sete itens, sem pooling ou crescimento durante a partida. O teste mede
a chegada à faixa de captura em cerca de quatro segundos e a rodada de 60 s.
As alturas continuam aleatórias, mas os pares simultâneos que podiam se
sobrepor foram removidos. A sequência recomeça a cada partida.

## Ciclo de vida dos alimentos — etapa 2

Na etapa 2, cada partida passou a possuir um grupo físico de alimentos e um
único overlap entre esse grupo e o jogador. `FoodObjects.criar(cena, tipo, grupo)`
continua criando e configurando cada sprite; não há reaproveitamento de itens.
Os valores anteriores são aplicados depois dos defaults do grupo para preservar
velocidade, escala, corpo e ausência de gravidade.

A coleta remove e destrói o membro antes de pontuar, impedindo contagem dupla.
Após a atualização física, o alimento é destruído somente quando
`getBounds().right < 0`: considera-se a imagem inteira, inclusive a parte que
ultrapassa o corpo de colisão. Fim do tempo, Menu e shutdown limpam grupo, itens,
detector, referências e timers da partida. O resultado mantém seus textos e
controles; os alimentos remanescentes são descartados ao encerrar a partida.

O teste `npm.cmd run test:food-ui` preserva as verificações anteriores e acrescenta
coleta real pelo overlap, idempotência, reação vermelha, limite do último pixel,
uma rodada de 60 segundos sem aceleração e rodada reaberta. Mede alimentos,
corpos, fila de detectores e itens fora da tela em cada frame da rodada completa.
O relatório `tmp/food-ui-validation/report.json` contém a seção `lifecycle`.
As medições e verificações datadas da etapa estão em
[organizacao-entrega.md](organizacao-entrega.md).

## Comandos atuais

Abra pelo menu: Jogo da Alimentação. Execute o Vite com npm.cmd run dev-nolog.
Para repetir a validação no navegador, execute npm.cmd run test:food-ui
com o servidor na porta 8080. O teste usa o Edge instalado em modo headless;
na sandbox deste ambiente, o navegador precisa ser executado fora dela.

## Registros de validação

2026-11-03 — instruções ilustradas: `test:food-ui` passou no Edge headless
WebGL/SwiftShader. Conferiu a classificação dos dez assets, legendas, geometria,
espera de 2,2 s sem consumir tempo/criar corpos ou eventos da partida, Enter sem
iniciar, cliques repetidos sem recriar recursos, descarte da UI ao sair/iniciar,
retorno ao menu, reentrada e nova partida depois do resultado. Preservou os testes
de coleta, pontos positivos/negativos, rodada real de 60 s, 92 spawns a 650 ms,
velocidade de 325 px/s e um único overlap. As capturas das instruções foram
inspecionadas visualmente em 1280 × 720, 844 × 390 e 740 × 360, sem cortes ou
sobreposições. Toque foi emulado; não houve teste em celular físico.
Também passaram `test:menu`, `test:quiz` (21 casos), `test:quiz-visual` (doubles),
`test:scene-comparison` (4 casos), `build-nolog`, `test:distribution` e
`git diff --check`. O build manteve o aviso de chunk acima de 500 kB.
Evidências locais: `tmp/food-ui-validation/report.json` e PNGs nessa pasta.

Etapa 6: `test:food-ui` passou com os rótulos corrigidos e assertions de encaixe do
HUD e resultado, em PC e toque emulado, preservando os demais casos. A comparação
real antes/depois confirmou painéis/botões, posições, fontes/escalas e alturas de
linha iguais; apenas texto/largura intrínseca mudou. Incluiu resultado positivo,
negativo e uma sonda auxiliar de HUD com −120 pontos. Não houve celular físico.
Evidências e limites estão no registro datado da etapa 6 em
[organizacao-entrega.md](organizacao-entrega.md).

Registro histórico da integração anterior: painel comparado à Intro, cenário próprio preservado e ausência
do parque/título/retrato; medidas reais de texto e botão,
Menu antes/durante a partida, início único, remoção das instruções, movimento,
timer/spawn, Enter/Escape, toque emulado, cancelamento e reentrada limpa.
Passou em 1280 × 720 e 844 × 390, no Edge WebGL/SwiftShader, sem erros de
console/execução ou assets. Não foi usado um celular físico.
Capturas e relatório ficam em tmp/food-ui-validation. Build-nolog passou.
O teste também percorre os 60 ticks do contador (acelerando apenas seu
TimerEvent), confere o resultado, bloqueio de coletas/movimento após o fim,
Pontos positivos/negativos, saída por mouse/toque e reinício após a conclusão.

Arquivos daquela integração: src/game/scenes/FoodGame.js, tests/foodGameUI.browser-check.mjs,
package.json, .gitignore e este documento. Intro e componentes compartilhados
continuaram sem alterações naquela integração.
