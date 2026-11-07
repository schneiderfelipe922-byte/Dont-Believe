# Prólogo jogável — 30/10/2026

A partida começa com a imagem dos pais vistos do banco traseiro. Seis legendas apresentam a fuga da Actras, a orientação da mãe sobre sua crença e o impacto. E, Enter, Espaço, clique ou toque avançam a leitura.

A última fala faz uma transição curta pelo preto até a estrada noturna. Kali criança anda com WASD, setas ou direcional de toque. É preciso aproximar-se do carro e usar E, Espaço, Interagir ou Examinar o carro para revelar a ilustração dos pais mortos, com as chamas próximas. Depois das falas da descoberta e da chegada da Actras, o jogo segue para o despertar no dormitório.

As ilustrações ocupam a janela, preservando a imagem inteira, com legendas livres na parte inferior. Não há moldura de diálogo nem retrato separado no prólogo. No celular vertical, uma extensão escurecida e desfocada da própria arte preenche o fundo. Pausa e retomada preservam fase, página e posição da criança. O restante da história mantém seu sistema de diálogos e de investigação.

## Arquivos

- `javascript/prologue.js`: falas, fases, transições, câmera, movimento e interação com o carro. Recortes da prancha de Kali são constantes, sem leitura de pixels no navegador, para funcionar ao abrir `index.html` diretamente.
- `css/prologue.css`: imagem, legenda, toque e movimento reduzido.
- `javascript/game.js`: início, salvamento, pausa, comandos e retorno ao capítulo.
- `javascript/assets.js` e `index.html`: inclusão dos recursos com revisão de cache.
- `assets/prologo/estrada-noturna-seca-v2.png`: cenário sem chuva, revisado com a ferramenta integrada `image_gen`.
- `assets/prologo/kali-banco-traseiro-pais-desespero.png`, `pais-no-carro-incendio-proximo-v3.png` e `kali-crianca-sprites.png`: artes integradas.

## Verificação

100 testes existentes aprovados. `tools/playtest-prologue.cjs` percorre abertura, movimento, proximidade do carro, revelação, pausa e retomada, chegada ao orfanato, saves anteriores, recuperação de arte ausente e execução direta por `file://`. Perfis: computador, celular vertical e celular horizontal; inclui movimento reduzido. Capturas e relatório em `previas/prologo/`.

## Prompt da revisão do cenário

Use case: lighting-weather. Edit this exact existing 2D overhead RPG game environment image of an isolated forest road at night with a BLUE car overturned onto its roof and burning on the upper roadside. ONLY REMOVE THE RAIN AND WETNESS. It must be a DRY NIGHT. Remove all falling rain streaks, droplets, puddles, water ripples, slick wet asphalt and mirrorlike light reflections on the road. Replace wet road material with dry worn matte asphalt and dry dirt on the shoulder; keep subdued diffuse warm illumination from the burning car and cool blue night lighting. Keep exactly the same composition, overhead orthographic camera, all tree and rock locations, car size, car position, fire/smoke, skid marks, centerline, road width, and crisp detailed pixel-art drawing style. The road is the game's existing traversable map, so DO NOT MOVE ANYTHING OR CHANGE ITS GEOMETRY. Preserve original landscape aspect ratio and dimensions. No people, no bodies, no text, no UI, no daylight. Targeted weather edit: all elements unchanged except rain/wet appearance removed.
