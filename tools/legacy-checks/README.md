# Verificações históricas do passeio

Scripts anteriormente rastreados em `tmp`, preservados na etapa 5 porque são
referenciados no diagnóstico histórico. Execute a partir da raiz, com o servidor
`npm.cmd run dev-nolog` ativo e Edge instalado (`WALK_EDGE_PATH` seleciona o executável):

```powershell
node tools/legacy-checks/walk-player-l1.browser-check.mjs
node tools/legacy-checks/walk-player-l2.browser-check.mjs
node tools/legacy-checks/walk-manual-v2.browser-check.mjs
```

Esses scripts **não compõem a suíte atual**. Seus snapshots descrevem versões
anteriores: L1 ainda exige hashes antigos, L2 compara layout congelado e o manual
compara toda a cena com os membros editáveis. As divergências já comprovadas estão
em [organizacao-entrega.md](../../docs/organizacao-entrega.md); não são corrigidas
ou afrouxadas nesta movimentação.

L1/L2 leem `tests/fixtures/walk-history/l1-baseline.json`, cópia byte a byte da
fixture original. O manual usa o rascunho oficial em `docs/layout`. Relatórios,
capturas e downloads novos vão para `tmp/legacy-checks/`, ignorado pelo Git;
as cópias locais antigas de `tmp` permanecem intactas. O modo histórico `--baseline`
de L1 continua gravando apenas saídas locais; não regrava a fixture preservada.
L2 também só lê a fixture preservada.
Esse modo não foi executado na organização.

Para a validação atual, use os comandos documentados em
[testes-navegador.md](../../docs/testes-navegador.md). O antigo check de geometria
simulada do quiz foi movido para `tests/quizSaciVisual.check.mjs`, comando
`npm.cmd run test:quiz-visual`; ele não comprova renderização real.
