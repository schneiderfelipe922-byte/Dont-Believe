# Direção de arte — guache expressivo

Referência aprovada em 11/11/2026: `assets/fotos/kali-familia-guache-v3.png`, complementada por `assets/fotos/eron-tomas-guache-v3.png`. Estas referências prevalecem sobre descrições visuais anteriores incompatíveis. Ferramenta usada: image_gen integrada; prompts completos e arquivos de origem em `artes-2026-11-11.json`.

## Pessoas

Silhuetas expressivas e assimétricas, formas angulares orgânicas e proporções levemente exageradas. Rostos construídos com poucos planos; olhos, sobrancelhas e boca simples, com expressão legível. Cabelos em grandes mechas e massas recortadas. Guache opaco com pinceladas largas e quebradas; contornos de nanquim irregulares e seletivos. Não buscar geometria perfeita, anatomia fotográfica, acabamento de anime polido ou microtextura realista.

Preservar identidade, idade aparente, vínculos e emoção da cena. Kali: cabelo vermelho desalinhado, óculos pretos retangulares, camiseta escura sobre mangas claras. Eron: cabelo violeta e casaco escuro. Tomas: cabelo preto, óculos e moletom claro; saudável nas lembranças anteriores ao confinamento. Pais: mãe de cabelo castanho-avermelhado e casaco claro; pai com entradas no cabelo castanho, camisa azul-escura e calça clara. Não copiar o sorriso das fotos para cenas de medo, luto ou privação.

## Cor e materiais

Sombras ameixa/violeta, carvão colorido, marfim envelhecido e ocre. Luz quente nas lembranças; ajustar temperatura e contraste ao contexto narrativo. Grandes massas de valor antes dos detalhes. Textura de papel e pincel dentro da pintura, sem moldura artificial de desgaste. Nada de acabamento plástico ou brilho digital.

## Cenários

Aplicar a mesma linguagem de pintura, com perspectiva superior de RPG 2D e paredes em corte. Entradas, caminhos e objetos de investigação devem ter silhuetas distintas. Deixar piso livre para leitura e navegação; evitar que textura pareça obstáculo. Armazém é uma sala, não um corredor. Lavadora tem abertura superior. Subterrâneo separa celas e arquivos, com acesso às celas independente da porta dos arquivos.

## Aplicação e revisão

As duas fotos v3 estão aplicadas em `javascript/photos.js`. A rodada de clima de 11/11/2026 aplica a direção a 25 arquivos: dez retratos, três imagens do prólogo, menu, mapa, altar, prancha dos seis finais, três revelações e cinco cenários da expansão. Prompts e origens estão em `artes-clima-2026-11-11.json`; as versões imediatamente anteriores estão em `backups/artes-antes-clima-2026-11-11`, mantendo os caminhos relativos. Os nomes dos arquivos ativos foram preservados para compatibilidade.

Os cinco cenários de expansão continuam sendo artes preparadas, sem integração jogável. As três revelações têm imagens atualizadas no módulo existente, mas seus gatilhos ainda não estão ligados ao jogo. O armazém recebeu cartas e roupas desordenadas; conferir a disposição entre a vista da porta e o mapa antes da integração. Não anunciar a expansão como pronta.

Antes de aplicar outra imagem, verificar reconhecimento dos personagens, emoção, silhueta, enquadramento no celular e consistência de objetos entre ilustrações e mapa. Preservar versões anteriores. Para mapas existentes, verificar alinhamento de móveis, passagens e colisões.

## Critérios do projeto

Clareza: atende como direção visual, priorizando entradas e objetos reconhecíveis; compreensão dos novos mapas ainda precisa de teste jogável. Pistas e escolhas: fotos preservam vínculos e contexto, sem inventar provas ou consequências. Finais: esta revisão não altera decisões ou epílogos. A aprovação estética não substitui a avaliação narrativa e os testes previstos na base permanente.

## Prompt-base

Handmade bold dry gouache and broken ink contours; strongly stylized organic angular shapes, expressive asymmetrical silhouettes, simplified facial planes and larger hair shapes, broad visible brushwork, flat graphic value masses, dusty plum violet shadows, muted ochre light and aged ivory. Preserve character identity, age, costume and the scene's specific emotion. No realistic microdetail, glossy anime finish, perfect geometric shapes, artificial distressed border, text or UI. Adapt lighting and composition to narrative purpose.

## Clima emocional — regra permanente

A referência define a linguagem da pintura, não a emoção de todas as cenas. Antes de produzir uma arte, registrar o sentimento e o fato narrativo que ela deve comunicar.

| Contexto | Tratamento |
| --- | --- |
| Lembrança afetuosa | Ocre e marfim, luz acolhedora, pinceladas abertas; sorrisos apenas quando cabem. |
| Medo e suspeita | Sombras violetas mais densas, luz localizada, expressão tensa e composição contida. |
| Luto e abandono | Cores abafadas, massas escuras maiores, marcas secas e pesadas; postura abatida e silêncio visual. |
| Fome e confinamento | Roupa larga, rosto e membros magros, postura fraca; grades legíveis, sem ferimentos gráficos nem borda de desgaste. |
| Esperança e libertação | Abertura de luz e espaço, sem apagar o desgaste vivido. |
| Traição, isolamento e captura | Contrastes mais severos e espaço opressivo, distinguindo cada consequência. |

Peso emocional vem de expressão, postura, cor, luz e pincelada; não de acrescentar violência ou esconder informação. Nunca escurecer rostos, etiquetas, caminhos ou controles a ponto de prejudicar a leitura. A roupa T-17 permanece uma observação, não uma prova automática do destino de Tomas. Retratos genéricos de diálogo não devem antecipar sua privação na cela. Manter a diferença entre os seis finais e preservar os fatos de cada cena.

Avaliação desta rodada: identidade e sinais narrativos preservados; nenhuma regra, escolha, custo ou condição de final foi alterada. A revisão visual e os testes técnicos não substituem uma sessão com alguém que desconhece o jogo.

Validação da aplicação: 111 testes automatizados aprovados; build estático concluído; ensaio no navegador sem erros para teclado, portas e os seis finais. Prólogo verificado em computador, celular e horizontal, incluindo pausa, retomada, movimento reduzido, nova tentativa de imagem e abertura local sem internet. Capturas em `previas/colisoes` e `previas/prologo`. Nenhum teste com participante novo foi realizado nesta rodada.

## Plantas completas e visibilidade

A planta expandida mais recente está descrita em `MAPA-COMPLETO.md`: armazém no lugar da antiga cela, quarto de Elias no antigo espaço dos arquivos, pátio e lavanderia anexos, subterrâneo em imagem separada. São artes preparadas; não substituir a geometria antiga apenas trocando o PNG. A visão por sala e os avisos de vigias foram implementados no mapa atual, preservando a orientação por passagens.

## Integração dos sprites — 13/11/2026

Personagens em guache aplicados pelo renderer, incluindo caminhada de seis frames e correções frente/costas. Recortes e âncoras individuais preservam os pés; escala comum por direção. Os cenários expandidos já estão jogáveis conforme `MAPA-COMPLETO.md`. Esta atualização substitui os estados históricos de “prévia” acima. Os sprites da infância no prólogo e os retratos ilustrados específicos mantêm suas artes próprias. 131 testes aprovados e revisão no navegador nos três formatos de tela; nenhuma mudança nas condições dos seis finais.

## Diário e celas compactas — 14/11/2026

1. Propósito: substituir o caderno fotográfico por guache e corrigir a escala das celas individuais.
2. Experiência: páginas claras com tinta escura; no celular, uma página ampliada. Celas menores com camas proporcionais e acesso legível pela grade.
3. Regras: piso interno de cada cela passa a 145 × 140 px; corredores de entrada, grades e móveis acompanham a pintura. Mira e Tomas reposicionados no piso livre. Saves em áreas agora sólidas usam a recuperação existente de posição.
4. Visual e som: guache seco, capa ameixa, papel marfim; subterrâneo mantém confinamento e sombras violetas. Sem áudio novo. Arte do diário: assets/diario/caderno-kali-guache-v2.png. Subterrâneo mantém caminho ativo anterior. Geradas com image_gen integrada; fontes exec-2fc5904e-4fc7-44be-8059-d2b129442ab8.png e exec-046582a5-2df7-4af4-9722-75252705f207.png.
5. Impacto: colisões, pontos dos personagens e recortes sob grades atualizados juntos; escadas, trancas, provas, custos e seis finais preservados. Versões anteriores em backups/antes-diario-celas-20261114.
6. Tamanho: duas imagens e integração local, sem expansão narrativa.
7. Testes e conclusão: 133 testes aprovados e build concluído. Navegador em 1280×800/900, 390×844 e 844×390: escadas, cela trancada/aberta, arquivos; diário, leitura, foco, rolagem, offline e falha de imagem. Capturas em previas/cenarios-jogaveis e previas/diario. Clareza atende às verificações de interface e acesso; pistas/escolhas e finais atendem por preservação das regras e regressão. Nenhuma validação com participantes novos foi realizada.

## Proporções e paleta no mapa — 14/11/2026

1. Propósito: corrigir personagens pequenos diante do mobiliário e utensílios desproporcionais.
2. Experiência: personagens do cenário com escala visual 1,6×, preservando diferenças de estatura e apoio dos pés. Xícaras, pratos, livros, tigelas e assentos reduzidos nas pinturas, sem remover objetos de investigação.
3. Regras: velocidade, alcance de interação, colisão dos pés e decisões permanecem iguais; tigelas das celas recebem limites menores compatíveis com a arte. A escala é aplicada apenas na renderização do mapa, sem alterar retratos nem o prólogo.
4. Visual e som: sprites com saturação 0,78, brilho 0,92, contraste 0,96 e pigmento ocre no térreo/violeta no subterrâneo; transparência e quadros originais preservados. Som não alterado. Pinturas editadas com image_gen integrada: exec-b2e3ed4e-ce29-4e21-afac-b3aeca220085.png e exec-003235a3-bcef-4241-8ee7-652427083fe7.png. Instrução: preservar geometria e pontos narrativos; reduzir objetos portáteis e assentos em relação à referência humana de 64 px.
5. Impacto: paredes, grandes móveis, escadas, grades, provas e seis finais preservados. Backup em backups/antes-proporcoes-paleta-20261114.
6. Tamanho: duas pinturas, tratamento dos sprites em cache no renderer e ajuste das colisões das tigelas.
7. Testes: 133 testes aprovados; build estático concluído. Navegador em computador, celular e horizontal: sem erros, escadas, trancas das celas e arquivos preservados. Capturas examinadas do dormitório e lavanderia confirmam objetos menores que os personagens e leitura de identidade. Clareza atende na revisão visual e de acesso; pistas/escolhas e finais atendem por preservação e regressão. Não houve teste com participante novo.

## Redução dos personagens no mapa — 17/11/2026

1. Propósito: corrigir o tamanho excessivo relatado pelo usuário, reduzindo a escala do mapa de 1,6× para 1,2× (25% em largura e altura).
2. Experiência: silhuetas menores deixam mais cenário visível; nomes, orientação e comandos de interação mantidos. Revisão das capturas do dormitório em computador e celular confirma reconhecimento dos personagens e passagem visível.
3. Regras: âncoras dos pés, posições, alcance, colisões e velocidade preservados; sombras e indicador de disfarce acompanham a redução.
4. Visual e som: artes, diferenças de estatura, expressões, paleta e som preservados. Retratos e prólogo não usam esta escala.
5. Impacto: alteração restrita ao renderer do mapa; sem mudanças em pistas, escolhas, progresso salvo ou condições dos seis finais. Revisão do script no HTML atualizada para evitar cache antigo.
6. Tamanho: ajuste de renderização, atualização de cache e regeneração da distribuição estática.
7. Testes e conclusão: 137 testes aprovados; build de 94 arquivos concluído. Ensaio em Chromium em 1280×800, 390×844 e 844×390 sem erros JavaScript, com movimento, escadas, cela fechada/aberta e mapa. Capturas em `previas/personagens-menores/`. Clareza: atende na revisão visual de nomes, personagens e passagem e na regressão das interações. Pistas/escolhas: atende por preservação de conteúdo e regras. Finais: atende por preservação das condições e regressão automatizada. Não houve teste com participante novo.
