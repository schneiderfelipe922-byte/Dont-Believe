# Direção de arte

O cenário preserva a paleta escura de vinho, madeira envelhecida, janelas alaranjadas e velas quentes. `pixel-art.js` desenha os ambientes em Canvas, com madeira no dormitório, leitura, cozinha e observação, e pedra nas demais áreas. Móveis sólidos são definidos em `world.js`, compartilhando limites com as colisões. O dormitório agora tem duas camas e um tapete retangular para Mel.

Os protagonistas mantêm as artes enviadas. O vigia usa o novo conjunto encapuzado, e Mel usa o conjunto da gata branca. Os oito personagens, incluindo líder e Tomas, estão no único atlas `sprites.png`, com transparência e compressão sem perda. `sprites.zip` preserva os originais atuais e os metadados. `tools/import-characters.py` reconstrói o atlas; `character-data.js` define recortes e âncoras.

O menu usa `menu-original.png`. O detalhe do altar usa `altar-pixel.png`. `portraits.png` permanece como alternativa de retratos, e as artes em `references/` são referências de origem. Os cenários e finais são desenhados em Canvas. `tools/build-art.cjs` recria apenas retratos e detalhe do altar.

Mel começa no dormitório e percorre os cômodos acessíveis usando os quadros de caminhada nas quatro direções. Ela alterna caminhada e pequenas pausas; ao se aproximar do jogador, para e olha para ele. A interação abre a caixa de diálogo com retrato estático, sem animação de carinho. A caminhada dos demais personagens avança apenas com deslocamento. As portas são desenhadas conforme seu estado físico, usando a mesma lista de portas do mapa.

Créditos preservados: Pesquisa — Enzo Raphael dos Reis Pessoa. Ideia, História e Arte — Felipe Bertol Schneider. Desenvolvimento — Enzo Raphael dos Reis Pessoa e Felipe Bertol Schneider.
