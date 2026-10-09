# Contrato de interação — OldHood

Atualizado em 09/10/2026. Fonte: pedido aprovado e módulos carregados pelo index.html da raiz. Idioma pt-BR, salvamento local, funcionamento sem internet.

| Fluxo | Componente | Resultado e recuperação |
| --- | --- | --- |
| Conversar | game.js, DialogueUI | Pausa o mundo. Setas selecionam; Enter/E/Espaço, números ou toque confirmam. Prisão, resgate e transferência precedem falas genéricas. |
| Consultar caderno | notebook.js, modal nativo | J: Investigação; I: Objetos; T: Pedidos. Texto selecionável e rolável, foco visível, abas acessíveis por teclado. |
| Usar objeto | Interação no local | Mostrar prova, entregar recurso ou usar ferramenta junto ao alvo correspondente. Consultar objetos não os consome. |
| Orientar | Marcar no caderno; M | Uma marcação ativa. Caminhos aparecem por solicitação; apagar preserva as pistas. |
| Aceitar pedido | Conversa pessoal | Registra uma vez e acompanha o pedido escolhido. Não revela pedidos futuros no caderno. |
| Recolher/entregar | GameSocial.perform | Exige acesso, proximidade e itens. Ação válida custa uma durante o prazo; falha não cobra. Entrega não acumula recompensa por repetição. |
| Caixa T-17 | cruzamento | Erros permitem tentar novamente, sem perda ou vigilância. |
| Sinal de Tomas | sinalGrade | Duas curtas e uma longa, escolhidas em texto; sem exigência de rapidez. Escutar permite prosseguir sem conhecer o sinal. Não abre a grade. |
| Fechar | closeModal | Retorna à escolha de conversa se houver, ou ao cenário. Foto reaberta em Objetos volta à mesma seção. |
| Salvar/retomar | topdown.v2 | Campos antigos preservados; acrescenta memória social. Saves avançados não precisam voltar às cenas novas. |

As relações têm requisitos internos preservados, sem números, barras ou classificações na interface. A memória registra recusas distintas de Noah, fontes protegidas, documentos compartilhados e compromissos cumpridos. Recusas novas não causam denúncia automática. A reparação de Noah ainda exige abrir o trinco diante de Kali.

A exploração prioriza cenário e interação contextual. Detecção, ferimentos, advertências e prazo permanecem explícitos. Custos, exposição de informação e ações irreversíveis são descritos antes de confirmar. Caderno, diálogos, mapa e fotos pausam o mundo.

A arte do caderno é local; o HTML apresenta as informações. Kalam Regular e Bold com licença OFL; Solway nas conversas. Duas páginas no computador, uma no celular. Rolagem dentro do papel. Se a imagem falhar, mantém superfície clara. Redução de movimento e controles de toque continuam disponíveis.

## Registros anteriores de fotografias e conversas

As seções abaixo documentam verificações anteriores. A versão atual usa Objetos no caderno em lugar do antigo inventário separado; relações numéricas e marcadores automáticos foram removidos.

## Fotografias — pedido do jogador de 27/09/2026

| Capacidade | Dono canônico | Variante e comportamento | Verificação |
|---|---|---|---|
| Descobrir foto | `photos.js`, `nearby` / `interact` | E ou Interagir; exige proximidade e visão livre, respeitando paredes | testes de regras e integração |
| Exibir lembrança | `modal` / `closeModal` em game.js | `photo-memory`: foto em fade e fala abaixo; foco preso pelo dialog nativo; E, Espaço, Esc e botão fecham | navegador desktop/celular e redução de movimento |
| Reabrir foto | `showInventory` | Uma cópia por inventário, sem custo de ação nem mudança de cena; fechar retorna ao inventário | salvamento e releitura |
| Falha de imagem | variante `photo-memory` | Mensagem com Tentar novamente, manter inventário e saída disponíveis | falha de recurso em navegador |

A foto da família fica junto à mesa de cabeceira do dormitório; a de Eron e Tomas, perto da mesa da sala de leitura. As duas usam os pontos e marcadores de `GamePhotos`. Mundo, rondas e prazo permanecem pausados no modal. Retratos e diálogos comuns mantêm seu comportamento.

Estaturas no cenário: o renderer usa `CharacterData.height` (40/46/54 px), incluindo a arte de reserva durante carregamento. Âncora dos pés preservada; idles frontais recebem o tempo da animação, retratos de conversa continuam parados.

Verificação das fotos e estaturas: 44 testes Node aprovados; Chromium via Playwright em 1280×900 e 390×844, descoberta, fade, foco/Tab/Esc, toque, releitura após reload, falha de imagem e nova tentativa, redução de movimento do sistema e do jogo. Auditoria estática continua com os 27 falsos positivos preexistentes de listeners via `$`; nenhum novo tipo de aviso.


## Conversas ilustradas — 05/10/2026

| Capacidade | Dono canônico | Comportamento | Verificação |
|---|---|---|---|
| Identificar quem fala | showDialogue / DialogueUI.speakerKey | nome real na aba, ilustração e moldura por personagem; guard/leader usam vigia/lider | nove variantes em navegador |
| Escolher | DialogueUI.bindChoices / game.js | uma seleção por vez; setas circulam e pulam opções bloqueadas; mouse e foco movem a seta sem executar | testes unitários e integração |
| Confirmar | botões nativos / manipulador de teclado | Enter, E, Espaço, número, clique ou toque executam a ação uma vez; Enter/E não deixam a ação nativa duplicar | integração e navegador |
| Ler conteúdo longo | .dialogue-scroll | texto e escolhas rolam juntos, nome e saída ficam acessíveis; foco permanece no diálogo | navegador estreito e texto longo |
| Falha de arte | paintPortrait | reserva em pixels e botões funcionais; arquivos locais independem de rede | ausência de retrato simulada |

A seleção não gasta prazo, não avança roteiro e não salva consequências. Apenas confirmar usa a ação já existente. Requisitos continuam brancos e legíveis nas opções indisponíveis. `aria-current` marca a opção atual; a seta e o contorno de foco complementam a cor. Tab circula pelos botões visíveis; Esc devolve o foco ao cenário quando a saída é permitida.

A auditoria estática de 05/10 mantém os mesmos 27 falsos positivos de `affordance.actionless-button`, classificados pelo script como erros: ele não reconhece os listeners canônicos registrados por `$` em `game.js`. A auditoria não passou sem achados; nenhum novo tipo de achado apareceu. Evidência: `previas/dialogos/auditoria-estatica.json`. As ações da conversa são exercitadas por testes de integração e navegador; não foram adicionados handlers inline duplicados.


Verificação desta atualização: 59 testes Node aprovados. Chromium/Electron em 1360×1000 e 390×844: nove retratos e filtros de moldura, conversas reais de vigia/Mira/Eron/Noah/líder, texto branco, seleção roxa e seta visível, setas/Enter/E/Tab/Esc, confirmação única, conteúdo longo, redução de movimento e reserva de arte ausente. Nenhum erro de JavaScript. `previas/dialogos/verificacao.json` registra os resultados. O validador oficial de DESIGN.md retornou zero erros, com avisos de tokens documentais literais não referenciados; o CSS permanece canônico e os valores das conversas foram comparados por token.

## Tela cheia e conversas compactas — 09/10/2026

Botão ⛶ ou F entra e sai da tela cheia. Esc sai antes de fechar uma consulta ou abrir a pausa. O jogo pede tela cheia para o documento inteiro; caderno, fotografias e controles continuam disponíveis. Sem API ou com pedido recusado, o modo expandido ocupa a área da aba. O estado de jogo não é alterado.

Caixa de fala e retratos menores. A medição da área real e da fonte local divide as falas em páginas, incluindo respostas e mudanças da escolha. Não há rolagem nos diálogos. As escolhas são mostradas em grupos paginados; uma opção longa demais é lida integralmente em páginas antes de sua confirmação. Custos e bloqueios são preservados. O número original de cada escolha continua sendo seu atalho. Navegação e leitura não cobram prazo nem executam escolhas. O diário continua rolável.

A fotografia da família foi atualizada pela ferramenta imagegen integrada usando os retratos atuais de Kali, Daty e Inauri. Arte e prompt estão em assets/fotos/; a fotografia anterior foi preservada em backups/antes-tela-cheia-familia-20261009/.
