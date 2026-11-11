# Direção de arte

O cenário preserva a paleta escura de vinho, madeira envelhecida, janelas alaranjadas e velas quentes. `pixel-art.js` desenha os ambientes em Canvas, com madeira no dormitório, leitura, cozinha e observação, e pedra nas demais áreas. Móveis sólidos são definidos em `world.js`, compartilhando limites com as colisões. O dormitório agora tem duas camas e um tapete retangular para Mel.

Os protagonistas mantêm as artes enviadas. O vigia usa o novo conjunto encapuzado, e Mel usa o novo conjunto da gata branca de pelos volumosos e olhos verde-claros, com quatro idles deitada e seis quadros de caminhada por direção. Os dez personagens, incluindo Daty, Inauri, líder e Tomas, estão no único atlas `sprites.png`, com transparência e compressão sem perda. `sprites.zip` preserva os originais atuais e os metadados. `tools/import-characters.py` reconstrói o atlas; `character-data.js` define recortes e âncoras.

O menu usa `menu-original.png`. O detalhe do altar usa `altar-pixel.png`. `portraits.png` permanece como alternativa de retratos, e as artes em `references/` são referências de origem. Os cenários e finais são desenhados em Canvas. `tools/build-art.cjs` recria apenas retratos e detalhe do altar.

Mel começa no dormitório e percorre os cômodos acessíveis usando os quadros de caminhada nas quatro direções. Ela alterna caminhada e pequenas pausas; ao se aproximar do jogador, para e olha para ele. A interação abre a caixa de diálogo com retrato estático, sem animação de carinho. A caminhada dos demais personagens avança apenas com deslocamento. As portas são desenhadas conforme seu estado físico, usando a mesma lista de portas do mapa.

Créditos preservados: Pesquisa — Enzo Raphael dos Reis Pessoa. Ideia, História e Arte — Felipe Bertol Schneider. Desenvolvimento — Enzo Raphael dos Reis Pessoa e Felipe Bertol Schneider.

## Estaturas e idles frontais

Baixos (40 px): Mira, Kali e Daty. Medianos (46 px): Noah, Eron e Tomas. Altos (54 px): vigias, Líder e Inauri. Mel mantém a escala anterior. A altura é normalizada no atlas com vizinho mais próximo; os pés continuam ancorados no ponto do personagem.

Daty tem cabelo castanho ondulado de comprimento médio, sobretudo branco com detalhes pretos e calça azul-claro. Inauri é alto, com pouco cabelo, camisa social azul-escuro e calça branca. Ambos têm quatro quadros de idle frontal, ainda sem ciclos de caminhada ou outras direções. Estão disponíveis como `daty` e `inauri`, sem inserção de novas cenas.

Tomas usa moletom branco encardido, calça preta rasgada, cabelo preto longo e óculos arredondados. O Líder usa o traje escuro do Vigia com detalhes dourados e bengala de ametista. Esses visuais novos estão nos quatro quadros de idle frontal; os ciclos de caminhada e demais direções existentes foram preservados e ajustados em estatura. Mira, Kali, Noah, Eron e o Vigia também usam os quatro quadros frontais de respiração.

O manifesto dentro de `sprites.zip` preserva estaturas, fontes e durações (450/250/450/250 ms). `tools/import-characters.py` reconstrói os dez personagens sem perder esses ajustes. Fontes dos novos desenhos em `assets/sprites-e-idles/idle-sources/`; a arte foi criada com a ferramenta integrada de geração de imagens e exportada sem suavização.

## Exploração — 29/10/2026

Cartas, bilhetes, livros, chaves, fita, peça de tabuleiro e as duas fotos usam `assets/exploracao/objetos.png`. Esses objetos são desenhados no plano do chão antes dos personagens, inclusive quando Kali pisa sobre eles. Não há rótulo flutuante de fotografia sobre o corpo; o aviso de interação continua no HUD.

Os criados-mudos do dormitório usam a frente de `assets/exploracao/criado-mudo.png`, com a mesma origem ao abrir e fechar. O tampo e a vela originais do mapa são preservados para evitar chamas duplicadas. E e o botão de interação alternam as gavetas; `world.drawers` guarda os dois estados. Saves anteriores começam com as gavetas fechadas. A consulta não altera pistas, prazos, recursos ou relações.

`tools/normalize-exploration-art.py` extrai e normaliza as artes geradas, com alpha preservado. As fontes estão em `assets/exploracao/fontes/`. `tools/prepare-web-assets.py` gera revisões por conteúdo das imagens, JavaScript e CSS. O renderer não utiliza mais o atlas procedural antigo como substituto durante uma falha de carregamento.
