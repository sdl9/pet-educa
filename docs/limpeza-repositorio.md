# Limpeza do estado atual — etapa 5

Branch `etapa-5`, entrada `9fd2c2c0894d6a172ab97afb23976847015e8acb`, cópia
`sdl9/pet-educa`. Esta limpeza afeta o índice e o build atuais. **Não remove
arquivos do histórico Git**, não reescreve commits e não reduz por promessa o
banco de objetos de `.git`. Não houve push, merge ou publicação.

## Inventários de entrada separados

Os inventários completos estão fora do repositório em
`$env:TEMP\pet-educa-etapa-5-20261024`, com caminhos relativos:

| Classe | Inventário | Entrada |
| --- | --- | --- |
| Versionados | `arquivos-versionados-entrada.json` | 308 arquivos; 19.171.786 bytes locais, com tamanho e SHA-256 de cada um |
| Locais não versionados e não ignorados | `arquivos-locais-nao-versionados.txt` | Zero arquivos; lista vazia registrada |
| Ignorados | `arquivos-ignorados-entrada.txt` e `diretorios-ignorados-entrada.txt` | 5.009 arquivos; dependências, dist e evidências locais de testes |

O inventário de ignorados lista caminhos, sem ler conteúdo de perfis/cache.
Os 308 arquivos versionados foram copiados com seus caminhos em `entrada-bytes/`,
com hashes verificados. `entrada.bundle` contém a entrada e histórico alcançável,
verificado por `git bundle verify`; SHA-256
`1D218C1C6361DBF2DDB1CC132D8492E4C68FDCA74814D917F67984A65B021CA9`.
`estado-entrada.txt`, `staged.patch` e `unstaged.patch` registram a árvore/índice
limpos; os patches são vazios. Não havia mudanças locais a sobrepor.

## Origens, destinos e tamanhos

Bytes da entrada; pacotes e originais de arte mantêm exatamente esse tamanho nos
destinos, sem regenerar, comprimir novamente ou transformar arquivos.

| Origem | Destino/retirada do índice | Arquivos e bytes antes → depois | Justificativa |
| --- | --- | --- | --- |
| `public/assets/WalkGame_Assets_Animados/` | `art-source/WalkGame_Assets_Animados/` | 43 / 2.337.032 → iguais no destino | Pacote original: frames, referências, prévias, prompt, manifesto e spritesheets; execução já usa cópias em `public/assets/walk/animations` |
| `public/assets/menu/Pet-Educa-Telas/` | `art-source/menu/Pet-Educa-Telas/` | 18 / 1.023.914 → iguais no destino | Fonte das telas, fontes e licenças, layout e prévias; execução usa `public/assets/pet-educa-ui`, incluindo fontes/licenças |
| `public/assets/quiz-saci-q4-assets/` | `art-source/quiz-saci-q4-assets/` | 26 / 108.393 → iguais no destino | Pacote Q4, prévias, validação e gerador original; execução usa `public/assets/quiz-saci` |
| `public/assets/2.png` e `tst.png` | `art-source/legacy/`; duas linhas de preload retiradas | 2 / 2.424.913 → iguais no destino | Chaves `logo`/`tst` só eram carregadas; sem consumidores ativos em cenas, UI, CSS, manifestos ou ferramentas |
| `tmp/` rastreado | 19 entradas retiradas só do índice; scripts/fixture úteis preservados abaixo | 19 / 3.829.248 → 0 no índice de `tmp`; todos os originais continuam no disco | Resíduos de execução; não apagar diretório local nem perder ferramentas/evidências |
| `dist.zip` | Retirado só do índice; `/dist.zip` ignorado | 1 / 5.800.137 → 0 no índice; mesmos bytes no disco | Pacote acidental/antigo; não é o candidato da etapa 7 e não foi regenerado |
| `h -u origin walk-layout-editor-phase-a` | Retirado só do índice e ignorado por regra específica | 1 / 7.660 → 0 no índice; mesmos bytes no disco | Conteúdo confirmado como saída de terminal/diffstat, com escapes ANSI, não ferramenta do projeto |

Não havia perfis de navegador ou caches entre os 19 arquivos rastreados de `tmp`.
A retirada usou a lista explícita de 21 arquivos e `git rm --cached`, sem remoção
do disco. `/tmp/` passa a ser inteiramente ignorado. As 21 cópias locais foram
conferidas novamente por SHA-256; o índice não contém mais nenhuma entrada `tmp`.

Os 89 arquivos de arte foram movidos individualmente segundo
`destinos-planejados.json`, com validação dos caminhos absolutos e hashes. Foram
retiradas individualmente 24 pastas de origem já vazias, apenas com exclusão não
recursiva que recusa pastas não vazias. Nenhuma pasta `tmp` foi removida e nenhum
arquivo local desconhecido foi apagado.

## Ferramentas, fixture e evidências preservadas

| Origem em `tmp` | Destino mantido no projeto | Ajuste limitado |
| --- | --- | --- |
| `quiz-visual-validation/check-ui.mjs` | `tests/quizSaciVisual.check.mjs` | URL relativa da raiz; comando `test:quiz-visual` |
| `walk-player-l1.browser-check.mjs` | `tools/legacy-checks/walk-player-l1.browser-check.mjs` | Comando no comentário, leitura da fixture estável e saídas em `tmp/legacy-checks` |
| `walk-player-l2.browser-check.mjs` | `tools/legacy-checks/walk-player-l2.browser-check.mjs` | Comando no comentário, leitura da fixture estável e saídas em `tmp/legacy-checks` |
| `walk-manual-v2.browser-check.mjs` | `tools/legacy-checks/walk-manual-v2.browser-check.mjs` | Comando no comentário e saídas em `tmp/legacy-checks`; rascunho de `docs/layout` preservado |
| `walk-player-l1-validation/baseline.json` | `tests/fixtures/walk-history/l1-baseline.json` | Nenhuma alteração de bytes; 633.532 bytes |

Os quatro scripts e a fixture somavam 690.833 bytes na entrada. As assertions
foram preservadas. O modo histórico `--baseline` de L1 continua limitado a saídas
locais e não regrava a fixture mantida; L2 só a lê. Esse modo não foi executado. As ferramentas
históricas não são promovidas à suíte atual. Consulte seu
[README](../tools/legacy-checks/README.md) para comandos e divergências conhecidas.

Os 15 PNGs/JSONs históricos de `tmp`, incluindo o snapshot original, foram
selecionados e copiados com hashes para `evidencias-historicas/` no diretório
externo da etapa. As cópias locais originais permanecem em seus caminhos, agora
ignoradas. Capturas, cache, perfis, backup e dist não entram no novo commit.
Relatos datados mantêm seus caminhos antigos; a documentação atual aponta para
os novos comandos, fontes e destinos.

## Distribuição antes e depois

Foi executado `build-nolog` tanto antes quanto depois da limpeza, sem `log.js`,
troca de dependências ou alteração de lockfile/Vite. Tamanhos são somas dos
arquivos descomprimidos, sem contar diretórios ou o ZIP antigo.

| Conjunto | Antes | Depois | Diferença |
| --- | --- | --- | --- |
| `public` | 220 arquivos / 8.649.457 bytes | 131 arquivos / 2.755.205 bytes | −5.894.252 bytes |
| `dist` construído | 223 arquivos / 10.072.901 bytes | 134 arquivos / 4.178.584 bytes | −5.894.317 bytes (58,52%) |
| Arte original retirada de `public` | 89 arquivos / 5.894.252 bytes | Mesmos arquivos/bytes em `art-source` | Preservada no projeto, excluída do build |

`npm.cmd run test:distribution` verifica o índice atual, ausência de pacotes de
origem/prévias/prompts/perfis/cache no build (incluindo pastas vazias), integridade
de todas as entradas do catálogo e igualdade SHA-256 de cada arquivo público com
sua cópia em dist. Relatório local: `tmp/distribution-validation/report.json`.
O catálogo do passeio foi preservado integralmente, incluindo entradas extras.

Os 131 arquivos mantidos em `public` também foram comparados diretamente com a
entrada: mesmos caminhos e bytes, inclusive todos os assets carregados, fontes,
licenças, mapas, manifestos e CSS. A movimentação das fontes Q4 conserva a árvore
interna exigida pelo gerador Python, que resolve caminhos a partir de si próprio.
Ele não foi executado; nada foi reamostrado, redimensionado ou recolorido.

Verificações reais, limitações, recuperação e commits desta etapa são registrados
em [organizacao-entrega.md](organizacao-entrega.md).
