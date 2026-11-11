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
