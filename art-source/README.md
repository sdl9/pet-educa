# Materiais de origem preservados

Esta pasta fica fora de `public` e não integra o build Vite. Na etapa 5, os
pacotes abaixo foram movidos arquivo por arquivo, com SHA-256 conferido e sem
alterar seus bytes, estrutura interna, licenças, créditos ou instruções originais.
São materiais históricos; a integração atual já está implementada no jogo.

| Origem anterior | Destino atual | Uso preservado |
| --- | --- | --- |
| `public/assets/WalkGame_Assets_Animados` | `art-source/WalkGame_Assets_Animados` | Frames, referências, GIFs, prompt, manifestos/hashes e três spritesheets originais |
| `public/assets/menu/Pet-Educa-Telas` | `art-source/menu/Pet-Educa-Telas` | Oito imagens, fontes e suas duas licenças, layout de referência e prévias |
| `public/assets/quiz-saci-q4-assets` | `art-source/quiz-saci-q4-assets` | Pacote Q4 completo, manifesto, prévias, validação e gerador Python original |
| `public/assets/2.png`, `public/assets/tst.png` | `art-source/legacy/` | Originais carregados pelo Preloader sem consumidores ativos; preload retirado |

Os assets efetivos permanecem nos caminhos originais em
`public/assets/walk/animations`, `public/assets/pet-educa-ui` (incluindo fontes e
licenças) e `public/assets/quiz-saci`. Nenhuma imagem ou fonte foi regenerada.

No pacote Q4, `tools/build_background.py` resolve `ROOT` a partir da própria
localização. A árvore interna `public/assets/quiz-saci` foi mantida, portanto as
instruções de reprodução do README original continuam relativas à raiz daquele
pacote. O script e suas dependências originais foram preservados; não foram
executados nem instalados nesta etapa. Suas saídas ficam dentro de `art-source`.

Os prompts originais podem citar nomes anteriores de cenas/mapas. A correspondência
atual é `WalkGame.js`/`walkMap.json`, documentada em
[configuracao-passeio.md](../docs/configuracao-passeio.md). O catálogo de execução
continua mantido manualmente e não foi podado nesta limpeza.

Inventário, tamanhos, hashes e validação da movimentação estão em
[limpeza-repositorio.md](../docs/limpeza-repositorio.md) e no backup externo da etapa.
