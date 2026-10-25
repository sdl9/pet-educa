# Notas preservadas do protótipo do passeio

Na etapa 3, a implementação funcional anteriormente chamada `WalkGameLearning`
passou a se chamar `WalkGame`. O arquivo antigo com esse nome era um protótipo
com `create` e instruções comentados. As notas pedagógicas abaixo foram
preservadas fora da implementação. O código integral de entrada permanece no
backup da etapa, indicado em [organizacao-entrega.md](organizacao-entrega.md).

As anotações da usuária em [anotacoes.md](../anotacoes.md), sobre variável local,
propriedade da instância e separação de interface/lógica, foram mantidas intactas.

Comentários preservados do protótipo:

> Botao guardado em this porque ele pertence ao estado de instrucoes
> e sera removido quando o jogo comecar.

> Aqui passamos uma funcao como argumento.
> FuncoesUI cria o botao; FoodGame decide o que acontece no clique.
> Esse tipo de funcao passada para outra funcao e chamado de callback.

O texto de instrução do protótipo, então comentado e sem exibição no fluxo real,
era: “Faça um passeio pela praça! Nesse minigame você passeará pela praça, e
conversará com os moradores.” Os textos educativos da cena funcional e seus
diálogos não foram alterados.

`FuncoesJogo.js` estava vazio. `FuncoesUI.js` oferecia os dois botões do protótipo,
mas não possuía consumidor ativo. A retirada desses arquivos não altera os
controles atuais: por exemplo, o método próprio `FoodGame.criarBotaoMenu` continua
na alimentação e não era um consumidor daquela classe utilitária.
