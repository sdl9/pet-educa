# Conferência em celular físico

**Pendente de validação da usuária.** Nenhum aparelho físico foi usado na etapa 7.
Os resultados de toque emulado/WebGL no computador estão em
[organizacao-entrega.md](organizacao-entrega.md) e não preenchem este checklist.

Antes de testar, anote: arquivo candidato/commit, aparelho e sistema, navegador e
versão, data, orientação e dimensões visíveis. Sirva o conteúdo extraído do ZIP
por HTTP; confira que está usando o mesmo candidato identificado no registro.

- [ ] Em horizontal, abrir Intro e os três jogos pelo menu; conferir fontes,
  acentos, textos e áreas de toque, sem cortes ou sobreposições.
- [ ] Alimentação: mover pelo direcional, coletar bons/ruins, conferir Pontos e
  Tempo até o fim, resultado, Menu e reentrada com tempo/pontuação reiniciados.
- [ ] Passeio: movimento/câmera/colisões, conversas e tópicos, sete cuidados e
  conclusão, Saci/coração, fonte/brinquedo/tutor animados, Menu e reentrada limpa.
- [ ] Quiz: escolha única, acerto/erro, leitura das perguntas longas (6, 11 e 13)
  e feedback, avanço manual, conclusão das 15 perguntas, reinício e Menu.
- [ ] Cancelar gesto/soltar fora do controle; alternar aba ou bloquear/desbloquear
  e voltar. Conferir que não há movimento preso, resposta ou navegação duplicada.
- [ ] Conferir carregamento após recarregar e reabrir os jogos; registrar imagens,
  fontes ou controles ausentes e erros de rede/console, se o navegador permitir
  observá-los. Anotar separadamente o que não foi possível inspecionar.

Registre o resultado e eventuais passos de reprodução antes de marcar os itens.
O registro técnico da etapa 7 identifica uma intervenção preexistente do Phaser
ao tentar cancelar `touchcancel` não cancelável, reproduzida no pacote anterior
e no atual. Registre se ela também aparece no aparelho e se há efeito no gesto;
os casos automatizados de cancelamento preservaram o estado dos controles.
Este arquivo não declara aprovação de celular físico nem autoriza publicação.
