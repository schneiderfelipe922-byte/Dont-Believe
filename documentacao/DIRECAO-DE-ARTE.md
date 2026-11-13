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
