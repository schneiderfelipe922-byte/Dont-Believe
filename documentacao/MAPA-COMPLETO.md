# Cenários jogáveis — atualização de 12/11/2026

As duas plantas completas estão integradas ao jogo. A restrição de enxergar apenas o cômodo atual foi retirada: a câmera e o mapa mostram os ambientes do andar atual. O subterrâneo permanece separado do térreo.

## Acessos e orientação

- Térreo: dormitório, leitura, armazém, corredor, salão do obelisco, cozinha, observação, quarto de Elias, pátio e lavanderia.
- Escada de serviço da cozinha: use E para descer ao corredor das celas; use E na escada subterrânea para voltar.
- Arquivos: permanecem trancados pelo mecanismo do altar. A escada da cozinha não contorna essa condição. Após o desbloqueio, a escotilha do salão e a escada dos arquivos permitem ida e volta.
- Celas de Mira e Tomas: compartilham o desbloqueio existente, preservando chave, arame, ronda e distração. A grade aberta não equivale a resgate.
- Armazém opcional: chave no armário de serviço da lavanderia. A chave não altera prazo, suspeita, resgates ou acesso aos arquivos.
- Objetivos marcados em outro piso apontam para a escada apropriada. M mostra a planta do piso atual. Os avisos ligados à antiga ocultação de cômodos foram removidos.

## Colisões, personagens e salvamentos

As colisões foram refeitas para as duas artes, incluindo móveis, paredes, árvore, lavadora e grades. Os destinos das escadas são pontos livres, com breve proteção contra detecção na chegada. Cada posição normalizada recebe identificação de andar; visão e interação não atravessam andares. A navegação de moradores permanece física e Mel circula pelo térreo, sem usar escadas automaticamente.

O formato externo do save continua versão 2; a geometria usa `expanded-v2`. Salvamentos `illustrated-v1` são convertidos uma única vez por sala; posições nas antigas celas e arquivos migram para o subterrâneo. Inventário, decisões, prazo e finais não são reiniciados. As posições inválidas são recuperadas em piso livre.

## Escopo narrativo

Lavanderia, armazém e quarto de Elias oferecem observações contextualizadas. Examinar não consome ações do prazo nem transforma rumores em prova de morte. O registro dessas observações é idempotente. A mudança espacial preserva as condições existentes dos seis finais e não representa a conclusão de todas as atividades da expansão narrativa originalmente proposta.

## Avaliação dos critérios

1. **Clareza — atende à revisão técnica e visual:** passagens identificadas, instruções de E, pisos separados, marcação de acesso para objetivos em outro andar e ajuda atualizada. Ainda não houve teste com jogador novo.
2. **Pistas e escolhas — atende por preservação:** objetos mantêm seu significado, as referências espaciais acompanham as celas no subterrâneo, e chave/observações opcionais não substituem provas ou escolhas existentes.
3. **Finais compreensíveis — preservação verificada:** as seis rotas completas continuam alcançáveis, sem mudar suas condições ou consequências. A compreensão narrativa por novos jogadores continua pendente de sessão observada.

Roteiro proporcional: propósito — aplicar as artes aprovadas e ampliar a exploração; experiência — circulação contínua por andar; regras — escadas por interação, trancas e prazo preservados; identidade — plantas em guache aprovadas; impacto — geometria, renderização, posições e migração; escopo — cenários jogáveis, sem substituir os sprites; conclusão — testes de rotas, obstáculos, saves e navegador em três formatos.

Backup anterior à integração: `backups/antes-cenarios-jogaveis-2026-11-11`. Capturas: `previas/cenarios-jogaveis`. Scripts de validação: `tools/playtest-expanded-map.cjs` e testes de cenários, mundo, colisões, expansão e finais. Abertura local por `index.html`; pacote estático em `vercel-dist` após o build. Nenhuma publicação no GitHub faz parte desta alteração.

Validação concluída: **127 testes automatizados aprovados**. Navegador local em computador (1280×800), celular (390×844) e horizontal (844×390): carregamento das artes, escadas, bloqueio e abertura das celas, acesso aos arquivos, planta e ausência de transbordamento horizontal. Teste das revelações confirmou disparo único do armazém, interação da lavadora, pausa da simulação e retomada da página após recarregar, sem erros JavaScript. Build estático: 67 arquivos. Os sprites pintados permanecem somente na prévia aprovada para revisão.

---

## Histórico de planejamento de 11/11/2026 (estado anterior, substituído pela atualização acima)

# Planta completa e visão por sala — 11/11/2026

## Distribuição proposta nas artes

- Térreo: dormitório, leitura, corredor dos vigias, salão do obelisco, cozinha, observação, quarto abandonado de Elias, armazém, pátio e lavanderia.
- A instrução mais recente substitui a antiga cela pelo armazém. O quarto de Elias passa a ocupar o espaço dos antigos arquivos do térreo; não retirar sua investigação.
- O pátio liga o corredor à lavanderia. O armazém continua opcional, com chave no armário de serviço da lavanderia.
- Subterrâneo separado: escada de serviço próxima à cozinha, corredor, duas celas individuais (Mira e Tomas), porta restrita e arquivos. Segundo acesso pelos arquivos corresponde ao mecanismo do altar. A escada de serviço não deve permitir contornar a tranca dos arquivos.
- A escotilha junto ao obelisco e a entrada do quarto de Elias foram corrigidas na segunda geração.

Artes: `assets/cenarios/expansao/mapa-terreo-completo-v1.png` e `assets/cenarios/expansao/mapa-subterraneo-completo-v1.png`. Geradas com image_gen integrada; prompts e referências completos em `mapas-completos-2026-11-11.json`.

## O que está funcionando

A visão por sala está aplicada ao mapa jogável atual. O restante fica oculto; soleiras e passagens ligadas à sala permanecem visíveis para orientar a travessia. A sala muda ao atravessar. A câmera acompanha Kali. As rondas mantêm suas regras; a aproximação por uma passagem recebe aviso visual `PASSOS · VIGIA`, inclusive sem áudio. Com som ligado há duas batidas de passos. O caderno mostra a planta esquemática e a rota marcada, sem revelar interiores ou personagens distantes. Objetivo marcado em outra sala aponta para a passagem do percurso.

Os dois novos mapas são artes de planejamento, **ainda não substituem a geometria jogável**. A alteração cela → armazém está na geração pedida; o jogo atual ainda conserva as posições antigas. Integrar a expansão exige colisões, objetos, objetivos, acesso entre andares, migração e revelações. Não usar a nova imagem com as colisões antigas nem anunciar a expansão como implementada.

## Avaliação antes da implementação

1. Clareza — atende à proposta visual: saídas visíveis, planta esquemática e indicação de passagem. A versão que apenas escondia vigias precisava de ajuste; o usuário escolheu explicitamente avisos nas portas.
2. Pistas e escolhas — atende por preservação: esconder interiores evita revelar conteúdo de salas vizinhas; nenhum documento, escolha ou recompensa foi alterado. A planta expandida reserva os locais de investigação.
3. Finais — atende por preservação: condições e epílogos continuam iguais. Avisos de ronda evitam ocultar o risco sem retorno perceptível. Confirmar compreensão com jogadores novos continua necessário.

## Roteiro proporcional

Propósito: exploração mais íntima, suspense e visão clara da expansão. Experiência: revelar um cômodo por vez, orientar pelas passagens e avisar aproximação. Regras: transição espacial automática, sem custo de ações; rondas continuam andando; áudio opcional com equivalente visual. Identidade: guache angular, nanquim irregular, violeta/ocre; subterrâneo mais opressivo. Impacto: renderização, planta do caderno, avisos e ajuda; sem mudança no formato do save ou condições de finais. Escopo: duas plantas ilustradas completas e visão por sala no mapa atual; integração geométrica dos novos mapas permanece pendente. Reversão: scripts anteriores em `backups/antes-visao-por-sala-2026-11-11`; mapa original preservado.

## Validação

114 testes automatizados aprovados, incluindo visibilidade de salas e soleiras e aviso de vigia próximo sem revelar vigias distantes. Navegador local: avisos e transição de dormitório para corredor em computador, celular e horizontal, sem erros de JavaScript. Capturas revisadas em `previas/visao-sala`. Build estático concluído. Ainda sem teste com jogador novo; o áudio foi implementado, mas não avaliado auditivamente nesta rodada.
